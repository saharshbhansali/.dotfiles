module.exports = function buildManifest(type = 'chrome') {
  const result = {
    "name": "PrintFriendly - Print and PDF Web Pages",
    "manifest_version": 3,
    "version": process.env.EXTENSION_VERSION || "3.2.0",
    "description": "Make web pages printer-friendly and convert them to PDFs. Easily remove ads and navigation, and customize what you print or PDF.",
    "homepage_url": "https://www.printfriendly.com",
    "permissions": [
      "activeTab",
      "contextMenus",
      "scripting",
      "storage",
      // "downloads",
      // "notifications"
      // "offscreen"
    ],
    "icons": {
      "16": "images/print-friendly-16px.png",
      "48": "images/print-friendly-48px.png",
      "128": "images/print-friendly-128px.png"
    },
    "background": {
      "service_worker": "service_worker.js",
      "type": "module"
    },
    "action": {
      "default_icon": {
        "16": "images/print-friendly-green-19px.png",
        "24": "images/print-friendly-green-19px.png",
        "32": "images/print-friendly-green-19px.png",
      },
      "default_title": "PrintFriendly - Print and PDF Web Pages"
    },
    "web_accessible_resources": [
      {
        "resources": ["core.html", "algo.html", "print_sandbox_page.html"],
        "matches": ["*://*/*"]
      }
    ],
    "content_security_policy": {
      "extension_pages": "script-src 'self'; object-src 'self';",
      "sandbox": "sandbox allow-scripts allow-popups allow-modals allow-downloads; script-src 'self'; child-src 'self';"
    },
    "sandbox": {
      "pages": ["print_sandbox_page.html"]
    },
    "default_locale": "en",
    "options_ui": { "page": "options.html" }
  };

  switch (type) {
    case 'firefox':
      break;
    case 'chrome':
      result.incognito = "split";
      break;
  }

  return result;
}
