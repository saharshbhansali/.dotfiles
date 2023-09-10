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
(function(){var a={asphalt:{visible:!0}},c=!1;chrome.storage.sync.get({sponsors:a},function(d){for(var b in d.sponsors)"undefined"===typeof a[b]?c=!0:a[b].visible=d.sponsors[b].visible;for(b in a)a[b].visible&&document.getElementById(b).classList.remove("hidden");c&&chrome.storage.sync.set({sponsors:a});document.querySelectorAll("button.hide-sponsor").forEach(function(e){e.addEventListener("click",function(){this.parentNode.classList.add("hidden");a[e.parentNode.id].visible=!1;chrome.storage.sync.set({sponsors:a})})})})})();