$VPN = "ProtonVPN"
$VPN_Path = "C:\Program Files (x86)\Proton Technologies\ProtonVPN"

# Change VPN setting to connect on startup before using this script.

echo "Searching for VIT Network..."

echo ""

$SSID_Name = Invoke-Expression "netsh wlan show interfaces | select-string SSID"

# pure powershell version: $SSID_Name = Invoke-Expression "(get-netconnectionProfile).Name"

if($SSID_Name -match "VIT2.4G" -or $SSID_Name -match "VIT5G"){

echo "VIT Network found..."

echo "Connecting to VPN..."

echo "Checking for running instances..."

try {$Check_VPN = Get-Process "$VPN"

if($Check_VPN -notmatch "ObjectNotFound" -and $Check_VPN -match "$VPN"){

echo "Killing all $VPN instances..."

echo "Restarting $VPN..."
  }
} 
catch {

echo "Starting $VPN..."

}

Start-Process -FilePath "$VPN_Path\$VPN.exe"

echo "Connecting $VPN (automatic)..."

echo "..."

Start-Sleep -Seconds 15

echo "Connection Success!!"

cd ~

} else {

echo "Connection failed :/"

}

Start-Sleep -Seconds 1

exit
