#!/bin/zsh

ID="21BCI0028"
PASS="LK3RA6"

echo "Checking for VIT WiFi..."

SSID=$(iw dev | grep -iE 'ssid') # grep -iE 'VIT[2.4 5]+G')

if [[ $SSID =~ 'VIT[2.4 5]+G$' ]]
then 
	echo "Logging in $ID!..."

	curl 'http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://captive.apple.com/hotspot-detect.html' \
  	-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' \
  	-H 'Accept-Language: en-IN;q=0.8' \
  	-H 'Cache-Control: max-age=0' \
  	-H 'Connection: keep-alive' \
  	-H 'Content-Type: application/x-www-form-urlencoded' \
  	-H 'DNT: 1' \
  	-H 'Origin: http://phc.prontonetworks.com' \
  	-H 'Referer: http://phc.prontonetworks.com/cgi-bin/authlogin?' \
  	-H 'Sec-GPC: 1' \
  	-H 'Upgrade-Insecure-Requests: 1' \
  	-H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.81 Safari/537.36' \
  	--data-raw 'userId=$ID&password=$PASS&serviceName=ProntoAuthentication&Submit22=Login' \
  	--compressed \
  	--insecure -Ss &> /dev/null

	echo "Logged in $ID"

else
	echo "Wrong Network... "

fi
