#!/bin/bash

# alias >aliases
sed -E "s/([^=]*)=(.*)/alias '\1'=\2/; p" aliases >aliases.zsh
echo "" >>aliases.zsh
echo "-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------" >>aliases.zsh
echo "" >>aliases.zsh
# als >> aliases.zsh
