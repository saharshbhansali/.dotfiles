#!/bin/bash

sed -E "s/([^=]*)=(.*)/alias '\1'=\2/; p" aliases >aliases.zsh
