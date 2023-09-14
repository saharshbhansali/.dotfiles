#!/bin/sh
echo "Removing all kde configs"
sudo rm .config/session/kwin_*
sudo rm .config/*plasma* -r
sudo rm .config/*kde* -r
sudo rm .config/*kwin*
sudo rm -r .local/share/kded5
sudo rm .gtkrc-2.0-kde4
sudo rm .config/session/kwin_* -r
