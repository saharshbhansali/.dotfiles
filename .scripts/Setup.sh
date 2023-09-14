#!\bin\sh

# For all the files in the .config folder - bash syntax checked later

mkdir -p ~/.config

files = []
for file in files
	ln -s ~/.dotfiles/.config/$file ~/.config/$file

others = {}
for item,val in others:
	ln -s ~/.dotfiles/$item ~/$val
