#!/bin/bash
 
ID="Enter your ID here"
#$ (echo "Enter your ID here: ";read)
PASS="Enter your password here"
 
 
login_request(){
    echo "Logging in $ID!..."
curl 'http://phc.prontonetworks.com/cgi-bin/authlogin' -H 'Accept: 
text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' -H 'Accept-Language: en-IN;q=0.8' -H 'Cache-Control: max-age=0' -H 'Connection: keep-alive' -H 'Content-Type: application/x-www-form-urlencoded' -H 'DNT: 1' -H 'Origin: http://phc.prontonetworks.com' -H 'Referer: http://phc.prontonetworks.com/cgi-bin/authlogin' -H 'Sec-GPC: 1' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 
(KHTML, like Gecko) Chrome/104.0.5112.81 Safari/537.36' --data-raw "userId=$1&password=$2&serviceName=ProntoAuthentication&Submit22=Login" --compressed --insecure &> /dev/null
    echo "Logged in $ID"
}
 
login_request $ID $PASS
