## Environmental Variable Setup

# Gradle Setup
# GRADLE="/opt/gradle/gradle-7.5.1/bin:"

# Nessus Setup 
# NESSUS="/opt/nessus:"

# GoLang Setup 
# export GOROOT="/opt/go"
# export GO_USER="$HOME/go/bin/"
export GOPATH="/opt/go/bin/"
GO_ALL="$GOPATH"

# Node Setup
# NODE="$HOME/.nvm/versions/node/v16.17.0/bin:"

# Set XDG_CONFIG_HOME
export XDG_CONFIG_HOME="$HOME/.config/"

export PATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/usr/lib64/ccache:$HOME/bin:$HOME/.local/bin:/var/lib/snapd/snap/bin:$HOME/.cargo/bin:"
export PATH=$PATH:$XDG_CONFIG_HOME:$GO_ALL

#if [ -x "$(command -v tmux)" ] && [ -n "${DISPLAY}" ] && [ -z "${TMUX}" ]; then
#  tmux attach || tmux >/dev/null 2>&1
#fi 

