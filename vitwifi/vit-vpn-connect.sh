nm-applet &

# setting default value for the client parameter
## client="${client:=$default}"
## client="${1:-$default}"

default='p'
client="${1:-$default}"

if [[ $client == "p" ]]; 
then
  pkill protonvpn
  protonvpn-cli connect --fastest
  nmcli connection down pvpn-ipv6leak-protection

elif [[ $client == 'w' ]];
then

  pkill windscribe
  windscribe-cli connect best
  windscribe-cli disconnect
  windscribe-cli connect best

else
  echo "Choose --client (w)indscribe or (p)roton"

fi
