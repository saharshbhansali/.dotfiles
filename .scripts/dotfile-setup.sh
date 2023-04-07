#!/bin/bash

# Update package lists
sudo dnf update -y

# Install zsh
sudo dnf install -y zsh

# Change the default shell to zsh
chsh -s $(which zsh)

# Clone your dotfiles repository
git clone https://github.com/yourusername/dotfiles.git

# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install Powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/themes/powerlevel10k

# Symlink your zshrc file from your dotfiles repository
ln -s ~/dotfiles/zshrc ~/.zshrc

# Symlink your config files from your dotfiles repository
ln -s ~/dotfiles/.config/autostart ~/.config/autostart
ln -s ~/dotfiles/.config/bat ~/.config/bat
ln -s ~/dotfiles/.config/binwalk ~/.config/binwalk
ln -s ~/dotfiles/.config/btop ~/.config/btop
ln -s ~/dotfiles/.config/calibre ~/.config/calibre
ln -s ~/dotfiles/.config/cef_user_data ~/.config/cef_user_data
ln -s ~/dotfiles/.config/Code ~/.config/Code
ln -s ~/dotfiles/.config/com.github.tkashkin.gamehub ~/.config/com.github.tkashkin.gamehub
ln -s ~/dotfiles/.config/dconf ~/.config/dconf
ln -s ~/dotfiles/.config/discord ~/.config/discord
ln -s ~/dotfiles/.config/evolution ~/.config/evolution
ln -s ~/dotfiles/.config/flameshot ~/.config/flameshot
ln -s ~/dotfiles/.config/gedit ~/.config/gedit
ln -s ~/dotfiles/.config/GIMP ~/.config/GIMP
ln -s ~/dotfiles/.config/github-copilot ~/.config/github-copilot
ln -s ~/dotfiles/.config/goa-1.0 ~/.config/goa-1.0
ln -s ~/dotfiles/.config/htop ~/.config/htop
ln -s ~/dotfiles/.config/i3 ~/.config/i3
ln -s ~/dotfiles/.config/imsettings ~/.config/imsettings
ln -s ~/dotfiles/.config/KDE ~/.config/KDE
ln -s ~/dotfiles/.config/konsave ~/.config/konsave
ln -s ~/dotfiles/.config/ksnip ~/.config/ksnip
ln -s ~/dotfiles/.config/lutris ~/.config/lutris
ln -s ~/dotfiles/.config/matplotlib ~/.config/matplotlib
ln -s ~/dotfiles/.config/menus ~/.config/menus
ln -s ~/dotfiles/.config/mpv ~/.config/mpv
ln -s ~/dotfiles/.config/nautilus ~/.config/nautilus
ln -s ~/dotfiles/.config/neofetch ~/.config/neofetch
ln -s ~/dotfiles/.config/nvim ~/.config/nvim
ln -s ~/dotfiles/.config/plasma-workspace ~/.config/plasma-workspace
ln -s ~/dotfiles/.config/protonvpn ~/.config/protonvpn
ln -s ~/dotfiles/.config/qBittorrent ~/.config/qBittorrent
ln -s ~/dotfiles/.config/ranger ~/.config/ranger
ln -s ~/dotfiles/.config/spotify ~/.config/spotify
ln -s ~/dotfiles/.config/spotify-adblock ~/.config/spotify-adblock
ln -s ~/dotfiles/.config/thefuck ~/.config/thefuck
ln -s ~/dotfiles/.config/Thonny ~/.config/Thonny
ln -s ~/dotfiles/.config/Thunar ~/.config/Thunar
ln -s ~/dotfiles/.config/touchegg ~/.config/touchegg
ln -s ~/dotfiles/.config/vlc ~/.config/vlc
ln -s ~/dotfiles/.config/Wallpapers ~/.config/Wallpapers
ln -s ~/dotfiles/.config/Windscribe ~/.config/Windscribe
ln -s ~/dotfiles/.config/wireshark ~/.config/wireshark
ln -s ~/dotfiles/.config/xfce4 ~/.config/xfce4
ln -s ~/dotfiles/.config/xsettingsd ~/.config/xsettingsd
ln -s ~/dotfiles/.config/znt ~/.config/znt

# Reload your shell
exec zsh

