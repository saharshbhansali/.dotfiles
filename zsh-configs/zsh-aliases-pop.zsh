### SHELL ALIASES  ###

# APT Aliases

alias 'upgrade'='sudo apt update && sudo apt upgrade'
alias 'upgrade-get'='sudo apt-get update && sudo apt-get upgrade'
alias 'install'='sudo apt install'
alias 'install-get'='sudo apt-get install'
alias 'remove'='sudo apt remove'
alias 'remove-get'='sudo apt-get remove'
alias 'clean'='sudo apt autoremove'
alias 'clean-get'='sudo apt-get autoremove'
alias 'search'='apt search'
alias 'search-get'='apt-get search'
alias 'update'='sudo apt update'
alias 'update-get'='sudo apt-get update'

# Hibernate Aliases

alias 'hibernate'='sudo systemctl hibernate'
alias 'pm-hib'='sudo pm-hibernate'

# Lock Screen with Betterlockscreen

alias 'lock'='betterlockscreen --lock '

# Information and Movement Aliases

alias 'lah'='ls -lah --color=auto'
alias '.1'='cd ..'
alias '.2'='cd ../..'
alias '.3'='cd ../../..'
alias '.4'='cd ../../../..'

# Creating directories

alias 'mkalldir'='mkdir -p -v'

# Clipboard

alias 'clipC'='xclip -sel clip'

# Confirmations

alias 'mv'='mv -i'
alias 'cp'='cp -i'
alias 'rm'='rm -i'
alias 'ln'='ln -i'

# Picom
alias 'effects'='picom --experimental-backends -b'

# Rofi
#alias 'menu'='rofi -show run'
alias 'menu'='rofi -combi-modi window,drun,ssh,combi -theme Arc-Dark -font "hack 12" -show combi'

# Brightness

alias 'brightness'='xrandr --brightness '

# Vim customizations - can't autogenerate .vimrc rip

alias 'vim'='vim "+set nu"'

# Logging into NotEC2 VPS

user="azureuser"
ip="20.219.12.205"
key="~/.ssh/NotEC2_key.pem"

alias 'NotEC2'="ssh $user@$ip -i $key"
