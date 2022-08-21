ID="21BCI0028"

echo "Logging out $ID! ..."

curl 'http://phc.prontonetworks.com/cgi-bin/authlogout' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' \
  -H 'Accept-Language: en-IN;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'DNT: 1' \
  -H 'Sec-GPC: 1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.81 Safari/537.36' \
  --compressed \
  --insecure &> /dev/null

echo "Logged out $ID!"
