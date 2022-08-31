nm-applet &

# setting default value for the client parameter
${client:-"proton"}

if [[ $client == "proton" ]]; then
pkill protonvpn
protonvpn-cli connect --fastest

elif [[ $client == 'windscribe' ]]; then
pkill windscribe
windscribe-cli connect best
windscribe-cli disconnect
windscribe-cli connect best

else
  echo "Chose --client windscribe or proton"

fi
