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

# Reload your shell
exec zsh

