#!/bin/bash

nm-applet &

# setting default value for the client parameter
## client="${client:=$default}"
## client="${1:-$default}"

default='c'
client="${1:-$default}"

if [[ $client == 'c' ]]; then
	echo "Cloudflare WARP starting"
	wg-quick down cloudflare

	wg-quick up cloudflare
	speedtest-cli

elif [[ $client == 'r' ]]; then
	echo "Riseup-VPN starting"
	pkill riseup

	# riseup-vpn.launcher --start-vpn "on"
	# riseup-vpn.launcher --start-vpn "off"
	# riseup-vpn.launcher -w -a --start-vpn "on" 2&> /dev/null &
	riseup-vpn.launcher -w -a --start-vpn "on" 2 &>/dev/null
	curl -H "X-Auth-Token: $(cat /tmp/bitmask-token)" localhost:8080/vpn/status ─╯
	curl -H "X-Auth-Token: $(cat /tmp/bitmask-token)" localhost:8080/vpn/start
	speedtest-cli

elif [[ $client == 'p' ]]; then
	echo "Proton VPN starting"
	pkill protonvpn
	protonvpn-cli connect --fastest
	nmcli connection down pvpn-ipv6leak-protection
	speedtest-cli

elif [[ $client == 'w' ]]; then
	echo "Windscribe VPN starting"
	pkill windscribe
	windscribe-cli connect best
	windscribe-cli disconnect
	windscribe-cli connect best
	speedtest-cli

else
	echo "Choose --client (c)loudflare-warp, (r)iseup-vpn, (w)indscribe or (p)roton"

fi

echo "VPN Script Complete. Starting Ping test"
ping -c 5 1.1.1.1
