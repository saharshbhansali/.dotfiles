/*
##
##  Enhancer for YouTube™
##  =====================
##
##  Author: Maxime RF <https://www.mrfdev.com>
##
##  This file is protected by copyright laws and international copyright
##  treaties, as well as other intellectual property laws and treaties.
##
##  All rights not expressly granted to you are retained by the author.
##  Read the license.txt file for more details.
##
##  © MRFDEV.com - All Rights Reserved
##
*/
(function(){function c(){chrome.storage.local.get({blockhfrformats:!1,blockwebmformats:!1,controlspeed:!0,controlspeedmousebutton:!1,controlvolume:!1,controlvolumemousebutton:!1,defaultvolume:!1,ignorepopupplayer:!0,overridespeeds:!0,pausevideos:!0,qualityembeds:"medium",qualityembedsfullscreen:"hd1080",reversemousewheeldirection:!1,selectquality:!1,selectqualityfullscreenoff:!1,selectqualityfullscreenon:!1,speed:1,speedvariation:.1,volume:50,volumevariation:5},function(a){document.dispatchEvent(new CustomEvent("efyt-update-preferences",
{detail:{prefs:a}}))})}chrome.runtime.onMessage.addListener(function(a,d,e){"pause-video"===a.message&&document.hidden&&document.dispatchEvent(new Event("efyt-pause-video"))});chrome.storage.onChanged.addListener(c);document.addEventListener("efyt-get-preferences",c);document.addEventListener("efyt-pause-videos",function(a){try{chrome.runtime.sendMessage({request:"pause-videos"})}catch(d){}});var b=document.createElement("script");b.src=chrome.runtime.getURL("resources/youtube-embed.js?")+new URLSearchParams({incognito:chrome.extension.inIncognitoContext});
document.documentElement.appendChild(b);b.remove()})();