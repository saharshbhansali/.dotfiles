### SHELL ALIASES  ###

# DNF Aliases

alias 'upgrade'='sudo dnf upgrade'
alias 'install'='sudo dnf install'
alias 'remove'='sudo dnf remove'
alias 'clean'='sudo dnf autoremove'
alias 'search'='dnf search'
alias 'info'='dnf info'
alias 'reinstall'='sudo dnf reinstall'
alias 'update'='sudo dnf check-update'
alias 'system-upgrade37'='sudo dnf --refresh upgrade && sudo dnf system-upgrade download --releasever=37'

# Git Aliases

# alias 'gstatus'='git status'
# alias 'gadd'='git add'
# alias 'gaddall'='git add .'
# alias 'gcommit'='git commit -m'
# alias 'gpush'='git push'
# alias 'gpull'='git pull'
# alias 'gclone'='git clone'
# alias 'gbranch'='git branch'
# alias 'gmerge'='git merge'
# alias 'gcheckout'='git checkout'
# alias 'greset'='git reset'
# alias 'grevert'='git revert'
# alias 'glog'='git log'
# alias 'gdiff'='git diff'
# alias 'gstash'='git stash'

# Hibernate Aliases

alias 'hibernate'='sudo systemctl hibernate'
alias 'pm-hib'='sudo pm-hibernate'

# Information and Movement Aliases

alias 'lsx'='exa -lh --color=auto'
alias 'ls'='ls --color=auto'
alias 'lss'='exa -lh --color=auto'
alias 'la'='exa -lahg --color=auto --git'
# alias 'cat'='bat'
alias '.1'='cd ..'
alias '.2'='cd ../..'
alias '.3'='cd ../../..'
alias '.4'='cd ../../../..'
alias '.d'='cd ~/Desktop/.desktopstuff'
alias '.Dk'='~/Desktop/'
alias '.Dw'='~/Downloads/'
alias '.Dp'='~/Downloads/packages/'
alias '..d'='~/.dotfiles'
alias '.CS'='~/Downloads/packages/CyberSecurity/'

# VIT WiFi login aliases

alias 'vwifi'='~/login-vit-wifi.sh'
alias 'vwifi-off'='~/logout-vit-wifi.sh'
alias 'vpn-on'='~/login-vit-wifi.sh && ~/vpn-vit-connect.sh'
alias 'cf-on'='~/login-vit-wifi.sh && wg-quick up cloudflare && ping 8.8.8.8 -c 5'
alias 'cf-off'='wg-quick down cloudflare'

# Confirmations

## File manipulation
alias 'mv'='mv -i'
alias 'cp'='cp -i'
alias 'rm'='rm -i'
alias 'ln'='ln -i'
alias 'ip'='ip -c'

## pkill
alias 'pkill'='pkill -e'

# Diff 

alias 'vdiff'="diff --color -EZy"

# Creating directories

alias 'mkalldir'='mkdir -p -v'

# Clipboard

alias 'clipC'='xclip -sel clip'

# Picom

alias 'effects'='picom --experimental-backends -b'

# Rofi

#alias 'menu'='rofi -show run'
alias 'menu'='rofi -combi-modi window,drun,ssh -theme Arc-Dark -font "hack 12" -show combi'

# Brightness

alias 'brightness'='xrandr --brightness '

# VIM customizations - can't autogenerate .vimrc rip

alias 'vim'='vim "+set nu"'

# https://github.com/nvbn/thefuck Alias

eval $(thefuck --alias)

# Logging into NotEC2 VPS

# alias 'NotEC2'='ssh azureuser@20.219.12.205 -i ~/.ssh/NotEC2_key.pem'

user="azureuser"
ip="20.219.12.205"
key="~/.ssh/NotEC2_key.pem"
alias 'NotEC2'="ssh $user@$ip -i $key"

# CyberSec Lists Shortcuts

## SecLists Shortcut

SecLists="/opt/SecTools/SecLists/"

## KaliLists Shortcut

KaliLists="/opt/SecTools/KaliLists/"

## Auto_Wordlists Shortcut

AutoWordlists="/opt/SecTools/AutoWordlists/"

# CyberSec Tools Aliases

## Metasploit Alias

alias 'Metasploit'="/opt/SecTools/metasploit-framework/bin/msfconsole"

## Ghidra Alias

alias 'Ghidra'="/opt/SecTools/ghidra/ghidraRun"

## ZAP Alias

alias 'ZAP'="/opt/SecTools/zaproxy/zap.sh &> /dev/null &"

## IDA Free Alias

alias 'IDA'="/opt/SecTools/idafree-8.2/ida64 &> /dev/null &"

## John The Ripper Alias 

alias 'John'="/opt/SecTools/john/run/john"

## Gobuster Alias

alias 'Gobuster'="go run /opt/SecTools/gobuster/main.go"

## Postman Alias

alias 'Postman'="/opt/SecTools/Postman/Postman &> /dev/null &"

## Obsidian MainVault Alias

alias 'OMV'="~/obsidian-MainVault/"

## X Alias

# alias 'X'="/opt/SecTools/X/"



