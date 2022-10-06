#!/bin/zsh

ID="Enter ID here"
PASS="Enter password here"
device='wlo1'

login_request(){
	echo "Logging in $ID!..."
curl 'http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://www.msftconnecttest.com/redirect' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' \
  -H 'Accept-Language: en-IN;q=0.8' \
  -H 'Cache-Control: max-age=0' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'DNT: 1' \
  -H 'Origin: http://phc.prontonetworks.com' \
  -H 'Referer: http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://networkcheck.kde.org/' \
  -H 'Sec-GPC: 1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.81 Safari/537.36' \
  --data-raw "userId=$1&password=$2&serviceName=ProntoAuthentication&Submit22=Login" \
  --compressed \
  --insecure -sS &> /dev/null # ~/logs-vit-wifi.txt 
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
	echo "Wrong Network... "

	echo " Trying to login to VIT WiFi"

	Y=$(nmcli device wifi connect "VIT5G")

	if [[ "$Y" =~ 'successfully' ]]
	then
	  login_request $ID $PASS
	
	else
		echo "Failed to connect to VIT 5G WiFi, trying 2.4G"

		Y=$(nmcli device wifi connect "VIT2.4G")

	  if [[ "$Y" =~ "successfully" ]] 
	  then
		  
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

ping 8.8.8.8 -c 5
