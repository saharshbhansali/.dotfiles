#!/bin/zsh

# Function to recursively delete all files with specific extensions in directories with class numbers
delete_files() {
    local dir="$1"
    
    # Find files with specific extensions in directories with class numbers and delete them
    find "$dir" -type d -name '*-*' -exec sh -c 'cd "$1" && rip *.pdf *.ppt *.pptx *.doc *.docx' sh {} \;
}

# Start the deletion process from the current directory
delete_files "$(pwd)"

