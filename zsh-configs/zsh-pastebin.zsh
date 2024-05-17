#!/usr/bin/env bash
_PBENC_VERSION="1.0"
_PBENC_FORMAT="2"

## paste.c-net.org functions

pastebin()
{
    local url='https://paste.c-net.org/'
    if (( $# )); then
        local file
        for file; do
            curl -s \
                --data-binary @"$file" \
                --header "X-FileName: ${file##*/}" \
                "$url"
        done
    else
        curl -s --data-binary @- "$url"
    fi
}
pasteget()
{
    local url='https://paste.c-net.org/'
    if (( $# )); then
        local arg
        for arg; do
            curl -s "${url}${arg##*/}"
        done
    else
        local arg
        while read -r arg; do
            curl -s "${url}${arg##*/}"
        done
    fi
}

## Usage:

# $ pastebin ./my/file.bin ./my/file2.bin
# https://paste.c-net.org/ExampleOne
# https://paste.c-net.org/ExampleTwo
# $ { printf '%s\n' "-- MY DMESG --"; dmesg; } | pastebin
# https://paste.c-net.org/ExampleThree
# $ pasteget ExampleThree
# -- MY DMESG --
# [...]

## Insane usage:
# $ echo "This is a test." | pastebin | pasteget
# This is a test.

# common web request helper function
function __pbenc-curl
{
	set -- --silent --include "$@"
	unset HTTP_CODE HTTP_HEADERS HTTP_RESPONSE
	declare -g -A HTTP_HEADERS=()
	declare -g -i HTTP_CODE=0
	HTTP_RESPONSE=''
	local line key value
	{
		while read -r line; do
			if ! [[ "$line" =~ ^HTTP/[0-9.]+\ ([0-9]+) ]]; then
				sf_println2 "$FUNCNAME: No HTTP code received from server"
				return 1
			fi
			HTTP_CODE="${BASH_REMATCH[1]}"
			while read -r line; do
				line="${line//$'\r'/}"
				if [[ -z "$line" ]]; then
					(( HTTP_CODE >= 200 )) || continue 2
					HTTP_RESPONSE=$(base64 -w0)
					break 2
				fi
				IFS=': ' read -r key value <<<"$line" || :
				HTTP_HEADERS["${key,,}"]="$value"
			done
		done
	} < <(curl "$@")
}


# encrypt and upload
function pbenc-push
{
	local url='https://paste.c-net.org/';

	# read options
	local passphrase="" simple=false
	local OPTIND=1 OPTARG OPTERR opt
	while getopts ":p:s" opt; do
		case "$opt" in
			p)
				read -r passphrase <<<"$OPTARG"
				if [[ -z "$passphrase" ]]; then
					printf 'Empty passphrase unacceptable\n' >&2
					printf 'Aborted\n' >&2
					return 1
				fi
			;;
			s) simple=true ;;
			[?])
				printf '%s\n' "Unknown option -${OPTARG}" >&2
				return 1
			;;
			:)
				printf '%s\n' "Option -${OPTARG} requires an argument" >&2
				return 1
			;;
		esac
	done
	shift $((OPTIND-1))
	if [[ "${1:-}" = "--" ]]; then shift; fi

	# if no parameters are provided, pretend we specified stdin
	if ! (( $# )); then set -- '-';	fi

	# simple mode and passphrases don't mix
	if $simple; then
		if [[ -n "$passphrase" ]]; then
			printf 'Simple mode is active. A random encryption key will be generated for you. Do not provide one.\n' >&2
			return 1
		fi
		passphrase=$(openssl rand -hex 256)
	fi

	# we can't read both pastes and the passphrase from stdin
	if [[ -z "$passphrase" ]]; then
		local arg
		for arg; do
			if [[ "$arg" = '-' ]]; then
				printf 'When reading pastes from stdin, please use -p to specify a passphrase, or use -s (simple mode) to automatically generate one.\n' >&2
				return 1
			fi
		done
	fi

	# we need to have an encryption passphrase
	if [[ -z "$passphrase" ]]; then
		read -r -s -p 'Passphrase: ' passphrase
		printf '\n' >&2
	fi
	if [[ -z "$passphrase" ]]; then
		printf 'Aborted\n' >&2
		return 1
	fi

	# generate a key from the passphrase
	local _
	read -r key _ < <(printf '%s' "$passphrase" | sha256sum)

	# go through each file
	local file;
	for file in "$@"; do
		local iv data
		iv="$(openssl rand -hex 16)" # unique iv per file
		data="$(base64 -w0 "$file")" # this will happily read '-' as <stdin>

		# checksum, and prepare the upload
		local filesum upload
		read -r filesum _ < <(base64 -d <<<"$data" | sha256sum)
		upload=$(
			{
				printf 'PBENC %s\n' "$_PBENC_FORMAT"
				printf '%s\n' "$iv"
				{
					printf '%s\n' "$filesum"
					base64 -d <<<"$data"
				} | openssl enc -a -iv "$iv" -K "$key" -aes-256-cbc
			} | base64 -w0
		)

		# send it!
		local HTTP_CODE HTTP_HEADERS=() HTTP_RESPONSE
		__pbenc-curl --header "X-FileName: pbenc.bin" --data-binary @- "$url" < <(base64 -d <<<"$upload")
		if (( HTTP_CODE != 200 )); then
			printf 'pbenc: web request failed (code:%s)\n' "$HTTP_CODE" >&2
			base64 -d <<<"$HTTP_RESPONSE" >&2
			return 1
		fi

		# print results
		local paste
		paste=$(base64 -d <<<"$HTTP_RESPONSE")
		if $simple; then
			printf '%s#%s\n' "$paste" "$key"
		else
			printf '%s\n' "$paste"
		fi
	done;
}


# download and decrypt
function pbenc-pull
{
	local url='https://paste.c-net.org/';

	# read options
	local outfile="" passphrase=""
	local OPTIND=1 OPTARG OPTERR opt
	while getopts ":o:p:" opt; do
		case "$opt" in
			o) outfile="$OPTARG" ;;
			p)
				read -r passphrase <<<"$OPTARG"
				if [[ -z "$passphrase" ]]; then
					printf 'Empty passphrase unacceptable\n' >&2
					printf 'Aborted\n' >&2
					return 1
				fi
			;;
			[?])
				printf '%s\n' "Unknown option -${OPTARG}" >&2
				return 1
			;;
			:)
				printf '%s\n' "Option -${OPTARG} requires an argument" >&2
				return 1
			;;
		esac
	done
	shift $((OPTIND-1))
	if [[ "${1:-}" = "--" ]]; then shift; fi

	# if no parameters are provided, read pastes from stdin
	local args
	if ! (( $# )); then
		mapfile -t args
		set -- "${args[@]}"
	fi

	# go through each paste
	local arg
	for arg in "$@"; do
		local key=""

		# grab a key from the paste, or ask the user for a passphrase if we don't have one (yet)
		if [[ "$arg" = *'#'* ]]; then
			key="${arg##*#}"
			arg="${arg%#*}"
		else
			if [[ -z "$passphrase" ]]; then
				if [[ -n "${args[*]}" ]]; then
					# we can't read both pastes and the passphrase from stdin, though
					printf 'When reading pastes from stdin, please use -p to specify a passphrase.\n' >&2
					return 1
				fi
				read -r -s -p 'Passphrase: ' passphrase
				printf '\n' >&2
				if [[ -z "$passphrase" ]]; then
					printf 'Aborted\n' >&2
					return 1
				fi
			fi
			local _
			read -r key _ < <(printf '%s' "$passphrase" | sha256sum)
		fi

		# grab the paste
		local HTTP_CODE HTTP_HEADERS HTTP_RESPONSE
		__pbenc-curl "${url}${arg##*/}"
		if (( HTTP_CODE != 200 )); then
			printf 'pbenc: web request failed (code:%s)\n' "$HTTP_CODE" >&2
			base64 -d <<<"$HTTP_RESPONSE" >&2
			return 1
		fi

		# decrypt and print
		base64 -d <<<"$HTTP_RESPONSE" |
		{
			read -r pbenc format
			if [[ "$pbenc" != "PBENC" ]]; then
				printf 'pbenc: invalid file header\n' >&2
				return 1
			elif [[ "$format" != "$_PBENC_FORMAT" ]]; then
				printf 'pbenc: format "%s" is not supported.\n' "$format" >&2
				printf 'pbenc: Perhaps it was generated with a more recent version?\n' >&2
				return 1
			fi
			read -r iv
			if ! payload="$(set -o pipefail; openssl enc -a -iv "$iv" -K "$key" -aes-256-cbc -d | base64 -w0)"; then
				printf 'pbenc: decryptionhttps://paste.c-net.org/OnstageLeveled failed!\n' >&2
				return 1
			fi

			{
				read -r filesum
				read -r checksum _ < <(sha256sum)
			} < <(base64 -d <<<"$payload")
			if [[ "$filesum" != "$checksum" ]]; then
				printf 'pbenc: checksum mismatch!\n' >&2
				return 1
			fi
			base64 -d <<<"$payload" | tail -n +2 |
			{
				if [[ -n "$outfile" ]] && [[ "$outfile" != "-" ]]; then
					cat >"$outfile"
				else
					cat >&1
				fi
			}
		}
	done
}


# if we're not being sourced, we act like a proper script
if ! (return 0 2>/dev/null); then
	set -eu
	case "${1:-}" in
		push|bin|put) shift; pbenc-push "$@" ;;
		pull|get|fetch) shift; pbenc-pull "$@" ;;
		version) printf '%s\n' "$_PBENC_VERSION" >&2 ;;
		*)
# this can't be indented
expand -t 4 >&2 <<EOF
pbenc: Sends or retrieves encrypted files to or from paste.c-net.org
	   Files are stored with an encrypted checksum to prevent tampering
version: $_PBENC_VERSION


Usage:
	pbenc [options] <command> [file] [...]


Commands:
	push (aliases: bin, put)
		Encrypts a file (or stdin), and sends it to the pastebin.
	pull (aliases: get, fetch)
		Retrieves a file from the pastebin, and decrypts it.
	version
		Print version and exit.


Options:
	-o <path/to/destination>
		Provide an output filename to save your data to that, instead of
		writing to stdout.
	-p <passphrase>
		Provide a passphrase as an argument instead of prompting for it.
		Keep in mind that some systems display arguments in process lists.
	-s
		Use simple mode (push mode only), generating a random encryption
		key, attaching it as a URL fragment. URL fragments are never sent
		to the pastebin. Useful to quickly pass a paste to a friend,
		passphrase included.
		NOTE: For secure file transfer, the passphrase, random or not,
		should be passed to the recipient through a separate channel of
		communication.


Examples:
	pbenc push -p 'Top Secret' file_name
		Pushes the file 'file_name' to the pastebin, encrypting it with the
		passphrase 'Top Secret'.

	echo 'Hello World!' | pbenc push -s
		Pushes the text 'Hello World!' to the pastebin, encrypting it with
		a random key, returned as a URL fragment.

	pbenc pull ExampleOne
		Pulls the paste 'ExampleOne' from the pastebin, asking for the
		decryption passphrase.

	pbenc pull -p 'Top Secret!' ExampleTwo
		Pulls the paste 'ExampleTwo' from the pastebin, decrypting it with
		the passphrase 'Top Secret!'
		NOTE: This example paste is not encrypted, so decryption will fail.
	
	pbenc pull -p 'Top Secret!' -o myfile ExampleThree
		Pulls the paste 'ExampleThree' from the pastebin, decrypting it with
		the passphrase 'Top Secret!', saving it as "./myfile".
		The target directory, if any, must exist.
		NOTE: This example paste is not encrypted, so decryption will fail.
	
	pbenc pull https://paste.c-net.org/ExampleThree#4fb1d740c2a3dedbfc4310254886d38a64eb27256cd445e2fdc79a41d65b1df3
		Pulls the paste 'ExampleThree' from the pastebin, decrypting it with
		the key from the URL fragment. The URL fragment is not sent to the
		server.
		NOTE: This example paste is not encrypted, so decryption will fail.

	source pbenc
		Include this in your .bashrc file, or an automated script, to have
		the 'pbenc-push' and 'pbenc-pull' functions be available in your
		shell.


EOF
			exit $(( $# ? 1 : 0 ))
		;;
	esac
fi

# vim: tabstop=4:softtabstop=4:shiftwidth=4:noexpandtab
