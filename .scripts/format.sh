#!/bin/zsh

temp=$(ls | grep -iE '.java' > filelist.txt && cat filelist.txt)
echo $temp
# Create or clear the output file
echo "# Assignment 1" > Assignment\ 1.md
echo "##### by Saharsh Bhansali" >> Assignment\ 1.md
echo '- - - ' >> Assignment\ 1.md
backticks='```'
# Read the file list
while IFS= read -r file
do
  # Append the Java block markers and the file content to the output file
  name=${file%Cipher.java}
  echo "## ${name} Cipher" >> Assignment\ 1.md
  echo '#### Code:\n' >> Assignment\ 1.md
  echo '```java' >> Assignment\ 1.md
  echo "// Name: Saharsh Bhansali" >> Assignment\ 1.md
  cat "$file" >> Assignment\ 1.md
  echo '' >> Assignment\ 1.md
  echo '```' >> Assignment\ 1.md
  echo '' >> Assignment\ 1.md
  echo '#### Output:\n' >> Assignment\ 1.md
  echo '```' >> Assignment\ 1.md
  echo "zsh> java $file" >> Assignment\ 1.md
  echo '' >> Assignment\ 1.md
  java "$file"
  echo ''
  java "$file" >> Assignment\ 1.md
  echo '```' >> Assignment\ 1.md
  echo '' >> Assignment\ 1.md
  echo '- - -' >> Assignment\ 1.md
  echo '<div style="page-break-after: always;"></div>' >> Assignment\ 1.md
  echo '' >> Assignment\ 1.md
done < filelist.txt

