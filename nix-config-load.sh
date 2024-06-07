#!/bin/sh

pastebin() {
	local url='https://paste.c-net.org/'
	if ( ($#)); then
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
pasteget() {
	local url='https://paste.c-net.org/'
	if ( ($#)); then
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

# Usage:
# $ pastebin ./my/file.bin ./my/file2.bin
# https://paste.c-net.org/ExampleOne
# https://paste.c-net.org/ExampleTwo
# $ { printf '%s\n' "-- MY DMESG --"; dmesg; } | pastebin
# https://paste.c-net.org/ExampleThree
# $ pasteget ExampleThree
# -- MY DMESG --
# [...]
#
# Insane usage:
# $ echo "This is a test." | pastebin | pasteget
# This is a test.

mkdir nixos-config
pasteget FertileWhispers >nixos-config/flake.lock
pasteget ObjectFender >nixos-config/flake.nix
mkdir default
pasteget bermudaanswers >default/configuration.nix
pasteget siblingchips >default/hardware-configuration.nix
pasteget trishhanding >default/home.nix
mv default nixos-config/

nixos-rebuild test --flake ./nixos-config#default
