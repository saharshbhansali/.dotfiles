(() => {
  // src/background/icon/iconSetter.js
  function setIconForCurrentTab(tabId) {
    chrome.tabs.get(tabId, (tab) => {
      setIcon(tab.url, tabId);
    });
  }
  function setIcon(url, tabId) {
    if (url) {
      if (url.includes("phind.com")) {
        chrome.action.setIcon({ path: { "48": "assets/icons/icon_phind-48.png" }, tabId });
      }
    }
  }

  // src/background/icon/icon.js
  function iconListeners() {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      setIconForCurrentTab(tabId);
    });
    chrome.tabs.onActivated.addListener((activeInfo) => {
      setIconForCurrentTab(activeInfo.tabId);
    });
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        return;
      }
      chrome.tabs.query({ active: true, windowId }, (tabs) => {
        if (tabs[0]) {
          setIconForCurrentTab(tabs[0].id);
        }
      });
    });
  }

  // src/background/export/exportOnce.js
  function clickActionListener() {
    chrome.action.onClicked.addListener(async (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() {
          window.isInjecting = true;
        }
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["main.js"]
      });
    });
  }

  // src/background/export/exportAll.js
  function exportAllThreadsListener() {
    let currentIndex = 0;
    let lengthList = 0;
    let isExporting = false;
    let eventCount = 0;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.message === "exportAllThreads") {
        isExporting = true;
        currentIndex = request.redirect ? -1 : 0;
        lengthList = request.length;
        if (!request.redirect) {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "executeScript", index: currentIndex }, function(response) {
              console.log(response.message);
            });
          });
        }
        setTimeout(function() {
          sendResponse({ message: "exportAllThreads started" });
        }, 1);
      }
      if (request.message === "stopExportingThreads") {
        isExporting = false;
        sendResponse({ message: "exportAllThreads stopped" });
      }
      if (request.message === "LOAD_COMPLETE") {
        eventCount++;
        if (eventCount % 2 === 0) {
          if (isExporting) {
            if (currentIndex >= lengthList) {
              isExporting = false;
              sendResponse({ message: "exportAllThreads finished" });
              return;
            }
            currentIndex++;
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
              if (currentIndex < lengthList) {
                chrome.tabs.sendMessage(tabs[0].id, { message: "executeScript", index: currentIndex }, function(response) {
                  console.log(response.message);
                });
              }
            });
            setTimeout(function() {
              sendResponse({ message: "exportAllThreads in progress" });
            }, 1);
          } else {
            setTimeout(function() {
              sendResponse({ message: "LOAD_COMPLETE processed" });
            }, 1);
          }
        } else {
          setTimeout(function() {
            sendResponse({ message: "Before load complete" });
          }, 1);
        }
      }
      return true;
    });
  }

  // src/background/messenger/notify.js
  function notify() {
    onInstalledNotifier();
    onUninstalledNotifier();
  }
  function onInstalledNotifier() {
    chrome.runtime.onInstalled.addListener(function(details) {
      if (details.reason === "install") {
      } else if (details.reason === "update") {
        chrome.storage.sync.set({ displayModalUpdate: true }, function() {
          console.log("Last update modal will be displayed");
        });
      }
    });
  }
  function onUninstalledNotifier() {
    chrome.runtime.setUninstallURL("https://forms.gle/5stYhnaRkBR9GGBv5", function() {
      console.log("Uninstall survey URL set");
    });
  }

  // src/background.js
  clickActionListener();
  iconListeners();
  exportAllThreadsListener();
  notify();
})();
