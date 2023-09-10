export PATH="/home/saharsh/bin:/opt/gradle/gradle-7.5.1/bin:/home/saharsh/.nvm/versions/node/v16.17.0/bin:/usr/lib64/ccache:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/var/lib/snapd/snap/bin:/home/saharsh/.local/bin:/home/saharsh/.cargo/bin:/opt/nessus/sbin:/opt/nessus/bin"
export LD_LIBRARY_PATH="/opt/oracle/instantclient_21_10" # :$LD_LIBRARY_PATH"
export XDG_CONFIG_HOME="/home/saharsh/.config/"
export GOROOT="/opt/go/bin/"
export PATH=$PATH:$GOROOT:$LD_LIBRARY_PATH:$XDG_CONFIG_HOME
#if [ -x "$(command -v tmux)" ] && [ -n "${DISPLAY}" ] && [ -z "${TMUX}" ]; then
#  tmux attach || tmux >/dev/null 2>&1
#fi 

echo '\nCurrent Directory: '
pwd
echo '\n'
