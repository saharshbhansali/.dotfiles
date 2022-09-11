### SHELL ALIASES  ###

# APT Aliases

alias 'upgrade'='sudo dnf upgrade'
alias 'install'='sudo dnf install'
alias 'remove'='sudo dnf remove'
alias 'clean'='sudo dnf autoremove'
alias 'search'='dnf search'
alias 'info'='dnf info'
alias 'reinstall'='sudo dnf reinstall'
alias 'update'='sudo dnf check-update'

# Hibernate Aliases

alias 'hibernate'='sudo systemctl hibernate'
alias 'pm-hib'='sudo pm-hibernate'

# Lock Screen with Betterlockscreen

alias 'lock'='betterlockscreen --lock '

# Information and Movement Aliases

alias 'lah'='ls -lah --color=auto'
alias 'ls'='exa -lahg --git'
alias 'cat'='bat'
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
alias 'menu'='rofi -combi-modi window,drun,ssh -theme Arc-Dark -font "hack 12" -show combi'

# Brightness

alias 'brightness'='xrandr --brightness '

# Vim customizations - can't autogenerate .vimrc rip

alias 'vim'='vim "+set nu"'

# https://github.com/nvbn/thefuck Alias

eval $(thefuck --alias)


