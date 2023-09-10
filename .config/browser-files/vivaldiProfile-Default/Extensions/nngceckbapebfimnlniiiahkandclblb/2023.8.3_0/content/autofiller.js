/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
document.addEventListener("DOMContentLoaded", (event) => {
    let pageHref = null;
    let filledThisHref = false;
    let delayFillTimeout;
    const activeUserIdKey = "activeUserId";
    let activeUserId;
    chrome.storage.local.get(activeUserIdKey, (obj) => {
        if (obj == null || obj[activeUserIdKey] == null) {
            return;
        }
        activeUserId = obj[activeUserIdKey];
    });
    chrome.storage.local.get(activeUserId, (obj) => {
        var _a, _b;
        if (((_b = (_a = obj === null || obj === void 0 ? void 0 : obj[activeUserId]) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.enableAutoFillOnPageLoad) === true) {
            setInterval(() => doFillIfNeeded(), 500);
        }
    });
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.command === "fillForm" && pageHref === msg.url) {
            filledThisHref = true;
        }
    });
    function doFillIfNeeded(force = false) {
        if (force || pageHref !== window.location.href) {
            if (!force) {
                // Some websites are slow and rendering all page content. Try to fill again later
                // if we haven't already.
                filledThisHref = false;
                if (delayFillTimeout != null) {
                    window.clearTimeout(delayFillTimeout);
                }
                delayFillTimeout = window.setTimeout(() => {
                    if (!filledThisHref) {
                        doFillIfNeeded(true);
                    }
                }, 1500);
            }
            pageHref = window.location.href;
            const msg = {
                command: "bgCollectPageDetails",
                sender: "autofiller",
            };
            chrome.runtime.sendMessage(msg);
        }
    }
});

/******/ })()
;