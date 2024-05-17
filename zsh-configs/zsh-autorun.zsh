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

# Set Spicetify path
SPICETIFY="$HOME/.spicetify"

# pnpm
export PNPM_HOME="$HOME/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

export PATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/usr/lib64/ccache:$HOME/bin:$HOME/.local/bin:/var/lib/snapd/snap/bin:$HOME/.cargo/bin"
export PATH="$PATH:$XDG_CONFIG_HOME:$SPICETIFY:$GO_ALL:$GEM_BIN"


