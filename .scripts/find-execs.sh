find . -type f -executable $(for i in {"./a/*","./b*/*","./c/*","./*d*/*"}; do echo "-not -path $i"; done)
