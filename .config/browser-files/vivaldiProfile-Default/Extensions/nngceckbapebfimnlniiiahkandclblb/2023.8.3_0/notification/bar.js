/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 265:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__(265);
document.addEventListener("DOMContentLoaded", () => {
    // delay 50ms so that we get proper body dimensions
    setTimeout(load, 50);
});
function load() {
    const theme = getQueryVariable("theme");
    document.documentElement.classList.add("theme_" + theme);
    const isVaultLocked = getQueryVariable("isVaultLocked") == "true";
    document.getElementById("logo").src = isVaultLocked
        ? chrome.runtime.getURL("images/icon38_locked.png")
        : chrome.runtime.getURL("images/icon38.png");
    const i18n = {
        appName: chrome.i18n.getMessage("appName"),
        close: chrome.i18n.getMessage("close"),
        never: chrome.i18n.getMessage("never"),
        folder: chrome.i18n.getMessage("folder"),
        notificationAddSave: chrome.i18n.getMessage("notificationAddSave"),
        notificationAddDesc: chrome.i18n.getMessage("notificationAddDesc"),
        notificationEdit: chrome.i18n.getMessage("edit"),
        notificationChangeSave: chrome.i18n.getMessage("notificationChangeSave"),
        notificationChangeDesc: chrome.i18n.getMessage("notificationChangeDesc"),
    };
    const logoLink = document.getElementById("logo-link");
    logoLink.title = i18n.appName;
    // Update logo link to user's regional domain
    const webVaultURL = getQueryVariable("webVaultURL");
    const newVaultURL = webVaultURL && decodeURIComponent(webVaultURL);
    if (newVaultURL && newVaultURL !== logoLink.href) {
        logoLink.href = newVaultURL;
    }
    // i18n for "Add" template
    const addTemplate = document.getElementById("template-add");
    const neverButton = addTemplate.content.getElementById("never-save");
    neverButton.textContent = i18n.never;
    const selectFolder = addTemplate.content.getElementById("select-folder");
    selectFolder.hidden = isVaultLocked || removeIndividualVault();
    selectFolder.setAttribute("aria-label", i18n.folder);
    const addButton = addTemplate.content.getElementById("add-save");
    addButton.textContent = i18n.notificationAddSave;
    const addEditButton = addTemplate.content.getElementById("add-edit");
    // If Remove Individual Vault policy applies, "Add" opens the edit tab, so we hide the Edit button
    addEditButton.hidden = removeIndividualVault();
    addEditButton.textContent = i18n.notificationEdit;
    addTemplate.content.getElementById("add-text").textContent = i18n.notificationAddDesc;
    // i18n for "Change" (update password) template
    const changeTemplate = document.getElementById("template-change");
    const changeButton = changeTemplate.content.getElementById("change-save");
    changeButton.textContent = i18n.notificationChangeSave;
    const changeEditButton = changeTemplate.content.getElementById("change-edit");
    changeEditButton.textContent = i18n.notificationEdit;
    changeTemplate.content.getElementById("change-text").textContent = i18n.notificationChangeDesc;
    // i18n for body content
    const closeButton = document.getElementById("close-button");
    closeButton.title = i18n.close;
    if (getQueryVariable("type") === "add") {
        handleTypeAdd();
    }
    else if (getQueryVariable("type") === "change") {
        handleTypeChange();
    }
    closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        sendPlatformMessage({
            command: "bgCloseNotificationBar",
        });
    });
    window.addEventListener("resize", adjustHeight);
    adjustHeight();
}
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return null;
}
function handleTypeAdd() {
    setContent(document.getElementById("template-add"));
    const addButton = document.getElementById("add-save");
    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        // If Remove Individual Vault policy applies, "Add" opens the edit tab
        sendPlatformMessage({
            command: "bgAddSave",
            folder: getSelectedFolder(),
            edit: removeIndividualVault(),
        });
    });
    if (removeIndividualVault()) {
        // Everything past this point is only required if user has an individual vault
        return;
    }
    const editButton = document.getElementById("add-edit");
    editButton.addEventListener("click", (e) => {
        e.preventDefault();
        sendPlatformMessage({
            command: "bgAddSave",
            folder: getSelectedFolder(),
            edit: true,
        });
    });
    const neverButton = document.getElementById("never-save");
    neverButton.addEventListener("click", (e) => {
        e.preventDefault();
        sendPlatformMessage({
            command: "bgNeverSave",
        });
    });
    loadFolderSelector();
}
function handleTypeChange() {
    setContent(document.getElementById("template-change"));
    const changeButton = document.getElementById("change-save");
    changeButton.addEventListener("click", (e) => {
        e.preventDefault();
        sendPlatformMessage({
            command: "bgChangeSave",
            edit: false,
        });
    });
    const editButton = document.getElementById("change-edit");
    editButton.addEventListener("click", (e) => {
        e.preventDefault();
        sendPlatformMessage({
            command: "bgChangeSave",
            edit: true,
        });
    });
}
function setContent(template) {
    const content = document.getElementById("content");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    const newElement = template.content.cloneNode(true);
    content.appendChild(newElement);
}
function sendPlatformMessage(msg) {
    chrome.runtime.sendMessage(msg);
}
function loadFolderSelector() {
    const responseFoldersCommand = "notificationBarGetFoldersList";
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.command !== responseFoldersCommand || msg.data == null) {
            return;
        }
        const folders = msg.data.folders;
        const select = document.getElementById("select-folder");
        select.appendChild(new Option(chrome.i18n.getMessage("selectFolder"), null, true));
        folders.forEach((folder) => {
            // Select "No Folder" (id=null) folder by default
            select.appendChild(new Option(folder.name, folder.id || "", false));
        });
    });
    sendPlatformMessage({
        command: "bgGetDataForTab",
        responseCommand: responseFoldersCommand,
    });
}
function getSelectedFolder() {
    return document.getElementById("select-folder").value;
}
function removeIndividualVault() {
    return getQueryVariable("removeIndividualVault") == "true";
}
function adjustHeight() {
    sendPlatformMessage({
        command: "bgAdjustNotificationBar",
        data: {
            height: document.querySelector("body").scrollHeight,
        },
    });
}


})();

/******/ })()
;