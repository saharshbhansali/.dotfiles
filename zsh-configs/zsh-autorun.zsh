## Environmental Variable Setup

# Gradle Setup
# GRADLE="/opt/gradle/gradle-7.5.1/bin:"

# Nessus Setup 
# NESSUS="/opt/nessus:"

# Ruby Gem Setup
export GEM_BIN="$HOME/.local/share/gem/ruby/3.0.0/bin"

# GoLang Setup 
# export GOROOT="/opt/go"
# export GO_USER="$HOME/go/bin/"
GO_BIN="/opt/go/bin/bin"
export GOPATH="/opt/go/bin/"
GO_ALL="$GOPATH:$GO_BIN"

# Node Setup
# NODE="$HOME/.nvm/versions/node/v16.17.0/bin:"

# Set XDG_CONFIG_HOME
export XDG_CONFIG_HOME="$HOME/.config/"

export PATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/usr/lib64/ccache:$HOME/bin:$HOME/.local/bin:/var/lib/snapd/snap/bin:$HOME/.cargo/bin:"
export PATH="$PATH:$XDG_CONFIG_HOME:$GO_ALL:$GEM_BIN"

# laptop="laptop"
function start_tmux() {
  # tmux attach || tmux new > /dev/null 2>&1
  # if type tmux &> /dev/null; then
  #   echo "Autostarting terminal emulator"
  #      #if not inside a tmux session, and if no session is started, start a new session
  #   if [[ $HOST == $laptop && -z "$TMUX" && -z $TERMINAL_CONTEXT ]]; then
  #     echo "Autostarting tmux emulator"
  #     (tmux attach || tmux new-session)
  #   fi
  # fi
  if [ -x "$(command -v tmux)" ] && [ -n "${DISPLAY}" ] && [ -z "${TMUX}" ]; then
    echo "Autostarting tmux"
    tmux attach || tmux >/dev/null 2>&1
  fi

  if [ -x "$(command -v tmux)" ] && [ -n "${DISPLAY}" ] && [ -z "${TMUX}" ]; then
    echo "ArchWiki"
    exec tmux new-session -A -s ${USER} >/dev/null 2>&1
  fi
  
  [ -z "$TMUX"  ] && { tmux attach || exec tmux new-session;}
}
# start_tmux
# if command -v tmux &> /dev/null && [ -n "$PS1" ] && [[ ! "$TERM" =~ screen ]] && [[ ! "$TERM" =~ tmux ]] && [ -z "$TMUX" ]; then
#   exec tmux
# fi
