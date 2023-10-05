#!/bin/bash

gstp=$(git status --porcelain)
timestamp=$(date)

echo "Starting backup at $timestamp."

if [[ ${#gstp} -ne 0 ]]; then
	echo "Changes detected."
	echo $gstp
	echo "Staging Files."
	sleep 5
	echo $(git add --all)
	echo "Files staged. Committing changes."
	sleep 10
	echo $(git commit -m "Automated backup ($timestamp): $gstp")
	echo "Changes committed. Pulling changes from remote (with fast-forward strategy)."
	sleep 10
	echo $(git pull --ff)
	echo "Changes pulled. Pushing changes to remote."
	sleep 10
	echo $(git push --verbose) #--all)
fi

echo "Done."
