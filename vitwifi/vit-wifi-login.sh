#!/bin/zsh
echo "Enter your ID, Password and Device Name"
ID=$(read)
PASS=$(read)
device=$(read)

login_request(){
	echo "Logging in $ID!..."
	
	## Old Request
	# curl 'http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://www.msftconnecttest.com/redirect' \
  # -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' \
  # -H 'Accept-Language: en-IN;q=0.8' \
  # -H 'Cache-Control: max-age=0' \
  # -H 'Connection: keep-alive' \
  # -H 'Content-Type: application/x-www-form-urlencoded' \
  # -H 'DNT: 1' \
  # -H 'Origin: http://phc.prontonetworks.com' \
  # -H 'Referer: http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://networkcheck.kde.org/' \
  # -H 'Sec-GPC: 1' \
  # -H 'Upgrade-Insecure-Requests: 1' \
  # -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.81 Safari/537.36' \
  # --data-raw "userId=$1&password=$2&serviceName=ProntoAuthentication&Submit22=Login" \
  # --compressed \
  # --insecure -sS &> /dev/null # ~/logs-vit-wifi.txt 

	## New Request - from Brave / Chromium
  # curl 'http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://captive.apple.com/hotspot-detect.html' \
  # -H 'Content-Type: application/x-www-form-urlencoded' \
  # -H 'Origin: http://phc.prontonetworks.com' \
  # -H 'Referer: http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://www.gstatic.com/generate_204' \
  # -H 'Upgrade-Insecure-Requests: 1' \
  # -H 'User-Agent: Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  # --data-raw "userId=$1password=$2&serviceName=ProntoAuthentication&Submit22=Login" \
  # --compressed &> /dev/null 
	
	## Request from Firefox
  curl 'http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://captive.apple.com/hotspot-detect.html' -X POST -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/109.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Origin: http://phc.prontonetworks.com' -H 'DNT: 1' -H 'Connection: keep-alive' -H 'Upgrade-Insecure-Requests: 1' --data-raw "userId=$1&password=$2&serviceName=ProntoAuthentication&Submit22=Login" &> /dev/null
	
	echo "Logged in $ID"
}

# All methods of Substring checking
	#[[ grep -q "success" <<< $Y ]];
	#[[$Y =~ "successfully"]] <-- error was here, I did not give space between " and ]]
	#[[ grep -iE "VIT[2.4 5]+G$" ]]

# ALL Self Calling Methods Work
  # $HOME/login-vit-wifi.sh
  # ./$*
  #./$0
  # a=$(./$0)
  # /bin/zsh /home/saharsh/"$0"
  # exec /home/saharsh/login-vit-wifi.sh
	# login_request $ID $PASS

echo "Checking for VIT WiFi..."

# SSID=$(iw dev $device link | grep -iE 'ssid')
# SSID=$(nmcli | grep -iE 'VIT[2.4 5][G]$')
# SSID=$(nmcli | grep -iE 'VIT(2.4|5)(G|)$')
SSID=$(iw dev $device link | grep -iE 'VIT(2.4|5)(G|)$')
echo $SSID

if [[ $SSID ]]
then 
  login_request $ID $PASS 

else
	echo "VIT Network not found, changing connection... "

	echo " Trying to login to VIT 5G WiFi"

	Y=$(nmcli device wifi connect "VIT5G")

	if [[ "$Y" =~ 'successfully' ]]
	then
	  login_request $ID $PASS
	
	else
		echo "Failed to connect to VIT 5G WiFi, trying 2.4G"

		Y=$(nmcli device wifi connect "VIT2.4G")

	  if [[ "$Y" =~ "successfully" ]] 
	  then
	  	echo "Logged in to VIT WiFi"
		  
		  login_request $ID $PASS 
	  
	  else
		  echo "Connection attempts failed. Try manually"
	  fi
	fi
fi

ipv6=$(nmcli | grep -iE 'pvpn-ipv6leak-protection')
if [[ $ipv6 ]]
then 
	nmcli connection down "pvpn-ipv6leak-protection"
	echo "Disabled ProtonVPN IPV6 Leak Protection"
else
	echo "Done"
fi

echo "WiFi Script Complete. Starting Ping test."
ping -c 5 1.1.1.1
