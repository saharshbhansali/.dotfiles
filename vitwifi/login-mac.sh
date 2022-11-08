#!/bin/bash

echo "Enter Login ID: "
ID=$(read)
echo "Enter Password: "
PASS=$(read)


login_request(){

	echo "Logging in $ID!..."

curl 'http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://captive.apple.com/hotspot-detect.html' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' -H 'Cache-Control: max-age=0' -H 'Connection: keep-alive' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Origin: http://phc.prontonetworks.com' -H 'Referer: http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://phc.prontonetworks.com/' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' --data-raw 'userId=20BBA0095&password=XM6F5Z&serviceName=ProntoAuthentication&Submit22=Login' --compressed --insecure &> /dev/null

	echo "Logged in $ID"

}

login_request $ID $PASS

ping 1.1.1.1 -c 4

