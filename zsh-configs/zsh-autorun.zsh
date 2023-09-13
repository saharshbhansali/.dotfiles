export PATH="$HOME/bin:/opt/gradle/gradle-7.5.1/bin:$HOME/.nvm/versions/node/v16.17.0/bin:/usr/lib64/ccache:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/var/lib/snapd/snap/bin:/home/saharsh/.local/bin:$HOME/.cargo/bin:/opt/nessus/sbin:/opt/nessus/bin"
export LD_LIBRARY_PATH="/opt/oracle/instantclient_21_10" # :$LD_LIBRARY_PATH"
export XDG_CONFIG_HOME="$HOME/.config/"
export GOROOT="/opt/go"
export GOPATH="/opt/go/bin/"
GO_ALL="$GOROOT:$GOPATH:/opt/go/bin/bin"
#export GO_USER="$HOME/go/bin/"
export PATH=$PATH:$LD_LIBRARY_PATH:$XDG_CONFIG_HOME:$GO_ALL #:$GO_USER
#if [ -x "$(command -v tmux)" ] && [ -n "${DISPLAY}" ] && [ -z "${TMUX}" ]; then
#  tmux attach || tmux >/dev/null 2>&1
#fi 

#echo '\nCurrent Directory: '
#pwd
#echo '\n'
