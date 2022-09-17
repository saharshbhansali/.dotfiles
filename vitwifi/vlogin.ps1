$ID = "Enter your Login ID"
$PASS = "Enter your password"

echo "Logging in $ID."

$SSID_Name = Invoke-Expression "netsh wlan show interfaces | select-string SSID"

# pure powershell version: $SSID_Name = Invoke-Expression "(get-netconnectionProfile).Name"

if($SSID_Name -match "VIT2.4G" -or $SSID_Name -match "VIT5G"){

echo "VIT Network Found"

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
Invoke-WebRequest -UseBasicParsing -Uri "http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://www.msftconnecttest.com/redirect" `
-Method "POST" `
-WebSession $session `
-Headers @{
"Accept"="text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
  "Accept-Encoding"="gzip, deflate"
  "Accept-Language"="en-US,en;q=0.9"
  "Cache-Control"="max-age=0"
  "Origin"="http://phc.prontonetworks.com"
  "Referer"="http://phc.prontonetworks.com/cgi-bin/authlogin?URI=http://phc.prontonetworks.com/"
  "Upgrade-Insecure-Requests"="1"
} `
-ContentType "application/x-www-form-urlencoded" `
-Body "userId=$ID&password=$PASS&serviceName=ProntoAuthentication&Submit22=Login"

echo "Logged in $ID!"

} else {

echo "Wrong Network"

}

Start-Sleep -Seconds 1.2

# stop-process -Id $PID

exit
