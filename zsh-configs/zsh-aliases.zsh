### SHELL ALIASES  ###

# pacman Aliases
alias 'upgrade'='yay -Syu'
alias 'install'='yay -S --needed'
alias 'remove'='yay -R'
alias 'clean'='yay -Rns'
alias 'search'='yay -Ss'
alias 'info'='yay -Qii'
alias 'update'='yay -Syy'

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

alias 'lsx'='exa --color=auto'
alias 'ls'='ls --color=auto'
alias 'lss'='exa -lahg --color=auto'
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
alias '..c'='~/.config'
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
#alias 'rip'='rip -i'
alias 'rem'='rip -i'
alias 'ln'='ln -i'
alias 'ip'='ip -c'

## pkill
alias 'pkill'='pkill -e'

# Diff 

alias 'vdiff'="diff --color -EZy"

diff_so_fancy() { 
  diff -u $1 $2 | diff-so-fancy
}
alias dsf='diff_so_fancy'

# Creating directories

alias 'mkalldir'='mkdir -p -v'

# Clipboard

alias 'clipC'='xclip -sel clip'
alias 'clipP'='xclip -sel clip -o'
alias 'xC'='xsel -ib'
alias 'xP'='xsel -ob'
alias 'wlC'='wl-copy'
alias 'wlP'='wl-paste'
alias 'wlCp'='wl-copy -p'
alias 'wlPp'='wl-paste -p'

# Picom

alias 'effects'='picom --experimental-backends -b'

# Rofi

#alias 'menu'='rofi -show run'
alias 'menu'='rofi -combi-modi window,drun,ssh -theme Arc-Dark -font "hack 12" -show combi'

# Brightness

alias 'brightness'='xrandr --brightness '

# VIM customizations - can't autogenerate .vimrc rip

alias 'vim'='vim "+set nu"'

# Weather Report

alias 'weather'='curl wttr.in'

# Export all aliases 
alias 'export-aliases'='alias | sed -E "s/([^=]*)=(.*)/alias '\1'=\2/; p" > aliases.zsh'

# Logging into NotEC2 VPS

# alias 'NotEC2'='ssh azureuser@20.219.12.205 -i ~/.ssh/NotEC2_key.pem'

#user="azureuser"
#ip="20.219.12.205"
#key="~/.ssh/NotEC2_key.pem"
#alias 'NotEC2'="ssh $user@$ip -i $key"

# CyberSec Lists Shortcuts

## SecLists Shortcut

# SecLists="/opt/SecTools/SecLists/"

## KaliLists Shortcut

# KaliLists="/opt/SecTools/KaliLists/"

## Auto_Wordlists Shortcut

# AutoWordlists="/opt/SecTools/AutoWordlists/"

# CyberSec Tools Aliases

## Metasploit Alias

# alias 'Metasploit'="/opt/SecTools/metasploit-framework/bin/msfconsole"
alias 'Metasploit'="/opt/SecTools/metasploit/bin/msfconsole"

## Ghidra Alias

# alias 'Ghidra'="/opt/SecTools/ghidra/ghidraRun"

## ZAP Alias

# alias 'ZAP'="/opt/SecTools/zaproxy/zap.sh &> /dev/null &"

## IDA Free Alias

alias 'IDA'="/opt/SecTools/idafree-8.2/ida64 &> /dev/null &"

## John The Ripper Alias 

# alias 'John'="/opt/SecTools/john/run/john"

## Gobuster Alias

# alias 'Gobuster'="go run /opt/SecTools/gobuster/main.go"

## Postman Alias

# alias 'Postman'="/opt/SecTools/Postman/Postman &> /dev/null &"

## Obsidian MainVault Alias

alias 'OMV'="~/obsidian-MainVault/"

## Nessus Alias

# alias 'Nessus'="/opt/SecTools/nessus/"

## X Alias

# alias 'X'="/opt/SecTools/X/"




