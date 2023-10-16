export PATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/usr/lib64/ccache:$HOME/bin:$HOME/.local/bin:/var/lib/snapd/snap/bin:$HOME/.cargo/bin:"
# export LD_LIBRARY_PATH="/opt/oracle/instantclient_21_10" # :$LD_LIBRARY_PATH"
# GRADLE="/opt/gradle/gradle-7.5.1/bin:"
# NESSUS="/opt/nessus:"
NODE="$HOME/.nvm/versions/node/v16.17.0/bin:"
export XDG_CONFIG_HOME="$HOME/.config/"
export GOROOT="/opt/go"
export GOPATH="/opt/go/bin/"
GO_ALL="$GOROOT:$GOPATH:/opt/go/bin/bin"
#export GO_USER="$HOME/go/bin/"
export PATH=$PATH:$XDG_CONFIG_HOME:$GO_ALL #:$GO_USER:$GRADLE:$NESSUS:$LD_LIBRARY_PATH:
#if [ -x "$(command -v tmux)" ] && [ -n "${DISPLAY}" ] && [ -z "${TMUX}" ]; then
#  tmux attach || tmux >/dev/null 2>&1
#fi 

#echo '\nCurrent Directory: '
#pwd
#echo '\n'
