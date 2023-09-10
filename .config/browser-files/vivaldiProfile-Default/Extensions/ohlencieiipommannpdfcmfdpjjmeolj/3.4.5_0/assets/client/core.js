/*! js-cookie v3.0.1 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,o=e.Cookies=t();o.noConflict=function(){return e.Cookies=n,o}}())}(this,(function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}return function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}));
var logger = (function() {
  var METHODS = ['log', 'error', 'time', 'timeEnd'];
  var NOOP = function() {};

  function logEnabled(pfData) {
    return (
      pfData.config.environment === "development" ||
      pfData.config.environment === 'test' ||
      pfData.config.pfEnableLog ||
      pfData.config.urls.page.indexOf("pfdebug=1") >= 0
    );
  }

  var result = {
    init: function(pfData) {
      for(var i = 0; i < METHODS.length; i++) {
        var functionName = METHODS[i];
        if (logEnabled(pfData)) {
          result[functionName] = Function.prototype.bind.call(console[functionName], console);
        } else {
          result[functionName] = NOOP;
        }
      }
    },
  };

  // NOTE: setup default is to proxy to console
  for(var i = 0; i < METHODS.length; i++) {
    var functionName = METHODS[i];
    result[functionName] = Function.prototype.bind.call(console[functionName], console);
  }

  return result;
})();
var commonUtils = {
  hasClass: function(node, className) {
    if (node.nodeType !== Node.ELEMENT_NODE) { return false; }
    if (node.classList) { return node.classList.contains(className); }

    var classNames = (node.getAttribute('class') || '').split(/\s/);
    return classNames.indexOf(className) >= 0;
  },
  addClassTo: function(node, className) {
    if (node.nodeType !== Node.ELEMENT_NODE) { return; }

    if(!commonUtils.hasClass(node, className)) {
      if (node.classList) {
        node.classList.add(className);
      } else {
        node.className = (node.className || '') + ' ' + className;
      }
    }
  },
  removeClassFrom: function(node, className) {
    if (node.nodeType !== Node.ELEMENT_NODE) { return; }

    if(commonUtils.hasClass(node, className)) {
      if (node.classList) {
        node.classList.remove(className);
      } else {
        var classNames = (node.getAttribute('class') || '').split(' ');
        var index = classNames.indexOf(className);
        if (index >= 0) { classNames.splice(index, 1); }
        node.setAttribute('class', classNames.join(' '));
      }
    }
  },
  getImageWidth: function (img, onServer) {
    if (img.jquery) { img = img[0]; }
    var result = null;
    if (onServer) {
      var pfDataWidth = img.getAttribute('pf-data-width') || img.getAttribute('data-pf_rect_width');
      if (pfDataWidth) { result = parseInt(pfDataWidth, 10); }
    } else if (img.getAttribute('data-pf_rect_width')) {
      result = parseInt(img.getAttribute('data-pf_rect_width'), 10);
    }

    /*
      Fetch current height/width if value is zero as firefox
      sets the width/height as zero for some images when we initially persist
      the values
    */
    if (result === null || result === 0 || typeof result != 'number' || isNaN(result)) {
      result = img.getBoundingClientRect().width;
    }
    return result;
  },

  getImageHeight: function (img, onServer) {
    if (img.jquery) { img = img[0]; }
    var result = null;
    if (onServer) {
      var pfDataHeight = img.getAttribute('pf-data-height') || img.getAttribute('data-pf_rect_height');
      if (pfDataHeight) { result = parseInt(pfDataHeight, 10); }
    } else if (img.getAttribute('data-pf_rect_height')) {
      result = parseInt(img.getAttribute('data-pf_rect_height'), 10);
    }

    /*
      Fetch current height/width if value is zero as firefox
      sets the width/height as zero for some images when we initially persist
      the values
    */
    if (result === null || result === 0 || typeof result != 'number' || isNaN(result)) {
      result = img.getBoundingClientRect().height;
    }
    return result;
  },

  MAX_SVG_SIZE: 1000,
  MAX_SVG_ICON_SIZE: 21,
  ICON_REGEXP: /icon/i,
  svgMaxValue: function(svg) {
    return this.ICON_REGEXP.test(svg.getAttribute('class') || '') ? this.MAX_SVG_ICON_SIZE : this.MAX_SVG_SIZE;
  },

  svgViewBox: function(svg) {
    var viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      var viewBoxValues = viewBox.split(' ');
      if (viewBoxValues.length === 4) { return { width: parseInt(viewBoxValues[2], 10), height: parseInt(viewBoxValues[3], 10) }; }
    }
    return {};
  },

  INFINITY: 1000000,
  getSvgImageWidth: function(svg, onServer) {
    var result = this.getImageWidth(svg, onServer) || this.INFINITY;
    var maxValue = this.svgMaxValue(svg);
    var viewBoxValue = this.svgViewBox(svg).width || this.INFINITY;
    return Math.min(result, maxValue, viewBoxValue);
  },

  getSvgImageHeight: function(svg, onServer) {
    var result = this.getImageHeight(svg, onServer);
    var maxValue = this.svgMaxValue(svg);
    var viewBoxValue = this.svgViewBox(svg).height || this.INFINITY;
    return Math.min(result, maxValue, viewBoxValue);
  },

  getTopWrapper: function(node) {
    var parent = node.parentNode;
    if (parent.childNodes.length > 1) { return node; }
    return this.getTopWrapper(parent);
  },
  selectorsNotToBeRemoved: [
    '.copyright',
    '#copyright',
    '.delete-no',
    '.delete-off',
    '.pf-author',
    '.print-content',
    '#print-content',
    '.pf-date',
    '#pf-date',
    '.pf-title',
    '.pf-footer',
    '.print-header',
    '.print-footer',
    '.print-yes',
    '.pf-content',
    '#pf-content',
  ],
  isDeletableElement: (function () {
    var CLICK_TO_DEL_ELEMENTS = 'small, footer, header, aside, details, dialog, figure, nav, summary, twitter-widget, p, img, blockquote, h1, h2, h3, h4, h5, h6, ol, ul, li, a, table, td, pre, span, code, dl, dt, dd, hr, div.pf-caption, video, figcaption, data';
    var MANY_ELEMENTS_THRESHOLD = 15;

    return function isDeletableElement(node) {
      return (
        !commonUtils.hasClass(node, 'non-delete') &&
        !$(node).find(commonUtils.selectorsNotToBeRemoved.join(', ')).length && (
          node.matches(CLICK_TO_DEL_ELEMENTS) ||
          $(node).find('*:visible').length <= MANY_ELEMENTS_THRESHOLD
        )
      );
    };
  })(),

  resizeImageCssClass: function(value) {
    return 'pf-size-' + value.replace('-size', '').replace('-images', '');
  },

  addCSS: function(css, doc, useBody) {
    var tagName = useBody ? 'body' : 'head';
    var element = doc.getElementsByTagName(tagName)[0];
    var style = doc.createElement('style');

    style.type = 'text/css';
    style.setAttribute('name', 'pf-style');

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }
    element.appendChild(style);
  },

  createIframe: function(doc) {
    var iframe = doc.createElement('iframe');
    // TODO: do we need this src? If yes add sha256 to manifest.json CSP to avoid. Commented for now
    // Error: "Refused to execute JavaScript URL because it violates the following Content Security Policy..."
    /* jshint -W107 */
    // iframe.src = "javascript:false";
    /* jshint +W107 */
    iframe.frameBorder = '0';
    iframe.allowTransparency = 'true';
    return iframe;
  },

  loadHtmlInIframe: function(doc, iframe, html) {
    var dom, idoc;

    try {
      idoc = iframe.contentWindow.document;
    } catch(e) {
      dom = doc.domain;
      /* jshint -W107 */
      iframe.src = "javascript:var d=document.open();d.domain='"+dom+"';void(0);";
      /* jshint +W107 */
      idoc = iframe.contentWindow.document;
    }
    idoc.write(html);
    idoc.close();
  }
};
function toCdnUrl(url) {
  var cdnPrefix = pfData.config.hosts.cdn;
  if (url.indexOf(cdnPrefix) === 0) { return url; }
  return cdnPrefix + url;
};
var messageBus = (function() {
  var setupDone = false;

  var setupPort = function(port, handlers, onError) {
    port.onMessage.addListener(function(request, sender, sendResponse) {
      try {
        if (!request) { return; }

        var type = request.type;
        if (!type) { return; }

        var handler = handlers[type];
        if (!handler) { return; }
        var payload = request.payload;

        handler(payload);
      } catch (e) {
        if (onError) { onError(e); }
        else { throw e; }
      }
    });
    port.onDisconnect.addListener(function (p) {
      if (p.error) { console.log("Disconnected due to an error: " + p.error.message); }
      // NOTE: drop backtrace with setTimeout
      setTimeout(function() {
        var newPort = chrome.runtime.connect({ name: port.name });
        setupPort(newPort, handlers, onError);
      });
    });
  };

  return {
    postMessage: function(destination, type, payload, onError) {
      chrome.runtime.sendMessage({ destination: destination, type: type, payload: payload });
    },
    listen: function(name, handlers, onError) {
      if(setupDone) { return; }
      var port = chrome.runtime.connect({ name: name });
      setupPort(port, handlers, onError);

      setupDone = true;
    },
  };
})();
  
var ContentSecurityPolicy = (function () {
  function isSandboxPolicyHeaderWithNoAllowanceOf(originalResponse, allowRule) {
    if (
      !originalResponse ||
      originalResponse.status !== 'success' ||
      !originalResponse.headers.CSP
    ) { return false; }
    var policyHeader = originalResponse.headers.CSP.toLowerCase();
    return policyHeader.indexOf('sandbox') >= 0 && policyHeader.indexOf(allowRule.toLowerCase()) < 0;
  }

  return {
    isPrintAllowed: function(originalResponse) {
      return !isSandboxPolicyHeaderWithNoAllowanceOf(originalResponse, 'allow-modals');
    },

    isPdfAllowed: function(originalResponse) {
      return !isSandboxPolicyHeaderWithNoAllowanceOf(originalResponse, 'allow-downloads');
    }
  };
})();
var uiLocales = (function () {
  var DATA = {
    "ar": {
      "print": "طباعة",
      "pdf": "PDF",
      "email": "بريد",
      "remove-images": "إزالة الصور",
      "images": "صور",
      "margin": "هامش",
      "undo": "تراجع",
      "txt-size": "حجم الخط",
      "delete": "انقر للحذف",
      "dialog-close": "إغلاق",
      "dialog-title": "جاري طباعة الصفحة",
      "dialog-text": "جاري الإرسال إلى الطابعة.",
      "dialog-text-btn": "إعادة الإرسال",
      "pdf-head": "يتم توليد الملف",
      "pdf-download": "تحميل PDF الخاص بك",
      "email-title": "أرسل هذه الصفحة",
      "email-to": "إلى",
      "email-from": "من",
      "email-message": "رسالة",
      "email-send": "إرسال",
      "email-product-sent-message": "تم إرسال رسالة البريد الإلكتروني. قد تقوم بإغلاق الصفحة",
      "email-sent-message": "تم إرسال رسالة البريد الإلكتروني",
      "page-size": "صفحة الحجم",
      "email-article-sent": "أرسل لك مقال",
      "read-more": "اقرأ المزيد",
      "print-pdf": "الطباعة و PDF",
      "get-pro": "تطوير",
      "pro-alert": "ميزة الترقية"
    },
    "bg": {
      "print": "Печат",
      "pdf": "PDF",
      "email": "Изпрати",
      "remove-images": "Премахни снимките",
      "images": "снимки",
      "margin": "марж",
      "undo": "Отказ",
      "txt-size": "Размер на текст",
      "delete": "Натисни за да изтриеш",
      "dialog-close": "Затвори",
      "dialog-title": "Разпечатване ан страницата",
      "dialog-text": "Изпратено към принтера.",
      "dialog-text-btn": "изпрати отново",
      "pdf-head": "Генериране на PDF",
      "pdf-download": "Изтегли като PDF",
      "email-title": "Изпрати по ел.поща",
      "email-to": "До",
      "email-from": "От",
      "email-message": "Съобщение",
      "email-send": "Изпрати",
      "email-product-sent-message": "Писмото беше изпратено. Може да затворите страницата",
      "email-sent-message": "Писмото беше изпратено",
      "page-size": "Размер на страница",
      "email-article-sent": "ви изпраща публикация",
      "read-more": "Прочети още",
      "print-pdf": "Печат & PDF",
      "get-pro": "Подобряване на",
      "pro-alert": "Тази функция изисква надграждане"
    },
    "cs": {
      "print": "Tisk",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Odebrat obrázky",
      "undo": "Zpět",
      "txt-size": "Velikost textu",
      "images": "obrázky",
      "margin": "Okraj",
      "delete": "Kliknutím vymazat",
      "dialog-close": "Zavřít",
      "dialog-title": "Tisknu vaši stránku",
      "dialog-text": "Odesílám na tiskárnu.",
      "dialog-text-btn": "Zpět",
      "pdf-head": "Generuji PDF",
      "pdf-download": "Stáhnout PDF",
      "email-title": "Odeslat stránku emailem",
      "email-to": "Komu",
      "email-from": "Od",
      "email-message": "Zpráva",
      "email-send": "Odeslat",
      "email-product-sent-message": "Vaše emailová zpráva byla odeslána. Můžete zavřít stránku",
      "email-sent-message": "Vaše emailová zpráva byla odeslána",
      "page-size": "Velikost stránky",
      "email-article-sent": "vám poslal článek",
      "read-more": "Číst více",
      "print-pdf": "Tisk & PDF",
      "get-pro": "Vylepšit",
      "pro-alert": "Upgradujte funkci"
    },
    "da": {
      "print": "Print",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Fjern Billeder",
      "undo": "Fortryd",
      "txt-size": "tekststørrelse",
      "images": "Billeder",
      "margin": "Margen",
      "delete": "Klik for at fjerne",
      "dialog-close": "Luk",
      "dialog-title": "Printer Din Side",
      "dialog-text": "Sender til din printer.",
      "dialog-text-btn": "gen-send",
      "pdf-head": "Genererer Din PDF",
      "pdf-download": "Download din PDF",
      "email-title": "Send Denne Side",
      "email-to": "Til",
      "email-from": "Fra",
      "email-message": "Besked",
      "email-send": "Send",
      "email-product-sent-message": "YDin besked er blevet sendt. Du kan lukke dette vindue",
      "email-sent-message": "Din besked er blevet sendt",
      "page-size": "Sidestørrelse",
      "email-article-sent": "har sendt en besked til dig",
      "read-more": "Læs mere",
      "print-pdf": "Print & PDF",
      "get-pro": "Opgradering",
      "pro-alert": "Opgraderingsfunktion"
    },
    "de": {
      "print": "Drucken",
      "pdf": "PDF",
      "email": "E-Mail",
      "remove-images": "Bilder entfernen",
      "undo": "Rückgängig",
      "txt-size": "Textgröße",
      "margin": "Seitenrand",
      "images": "Bilder",
      "delete": "Klicken, um zu löschen",
      "dialog-close": "Schließen",
      "dialog-title": "An Drucker gesendet",
      "dialog-text": "",
      "dialog-text-btn": "Erneut senden",
      "pdf-head": "PDF wird erzeugt",
      "pdf-download": "PDF öffnen",
      "email-title": "Mailen Sie diese Seite",
      "email-to": "An",
      "email-from": "Von",
      "email-message": "Nachricht",
      "email-send": "Senden",
      "email-product-sent-message": "Ihre E-Mail wurde abgeschickt. Sie können die Seite schließen",
      "email-sent-message": "Ihre E-Mail wurde abgeschickt",
      "page-size": "Seitengröße",
      "email-article-sent": "der Artikel wurde gesendet",
      "read-more": "Weiterlesen",
      "print-pdf": "Drucken & PDF",
      "get-pro": "Aktualisierung",
      "pro-alert": "Upgrade-Funktion"
    },
    "en": {
      "print": "Print",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Remove Images",
      "undo": "Undo",
      "txt-size": "Text Size",
      "margin": "Margin",
      "images": "Images",
      "delete": "Click to delete",
      "dialog-close": "Close",
      "dialog-title": "Printing Your Page",
      "dialog-text": "Sending to your printer.",
      "dialog-text-btn": "re-send",
      "pdf-head": "Generating Your PDF",
      "pdf-download": "Download Your PDF",
      "email-title": "Email This Page",
      "email-to": "To",
      "email-from": "From",
      "email-message": "Message",
      "email-send": "Send",
      "email-product-sent-message": "Your email message has been sent. You may close the page",
      "email-sent-message": "Your Email Message Has Been Sent",
      "page-size": "Page Size",
      "email-article-sent": "sent you an article",
      "read-more": "Read More",
      "print-pdf": "Print & PDF",
      "get-pro": "Get Pro",
      "login": "Login",
      "pro-alert": "Pro Feature"
    },
    "es": {
      "print": "Imprimir",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Imágenes",
      "images": "Imágenes",
      "margin": "Margen",
      "undo": "Deshacer",
      "txt-size": "Tamaño Texto",
      "delete": "Clic para Eliminar",
      "dialog-close": "Cerrar",
      "dialog-title": "Impresión De Página",
      "dialog-text": "Enviar a la impresora.",
      "dialog-text-btn": "reenviar",
      "pdf-head": "Su generación de PDF",
      "pdf-download": "Descarga tu PDF",
      "email-title": "Envía por correo",
      "email-to": "A",
      "email-from": "De",
      "email-message": "Mensaje",
      "email-send": "Enviar",
      "email-product-sent-message": "Tu mensaje se ha enviado. Puedes cerrar la ventana.",
      "email-sent-message": "Tu mensaje se ha enviado",
      "page-size": "Tamaño de la página",
      "email-article-sent": "te ha enviado un artículo",
      "read-more": "Leer más",
      "print-pdf": "Impresión y PDF",
      "get-pro": "Mejorar",
      "pro-alert": "Característica de actualización"
    },
    "et": {
      "print": "Trüki",
      "pdf": "PDF",
      "email": "E-post",
      "remove-images": "Eemalda pildid",
      "images": "Pildid",
      "margin": "Marginaal",
      "undo": "Võta tagasi",
      "txt-size": "Teksti suurus",
      "delete": "Kliki, et kustutada",
      "dialog-close": "Sulge",
      "dialog-title": "Sinu lehekülje trükkimine",
      "dialog-text": "Printerisse saatmine.",
      "dialog-text-btn": "saada uuesti",
      "pdf-head": "PDF'i genereerimine",
      "pdf-download": "Lae alla oma PDF",
      "email-title": "Saada see leht",
      "email-to": "Kuni",
      "email-from": "Pärit",
      "email-message": "Sõnum",
      "email-send": "Saatma",
      "email-product-sent-message": "Sinu e-kiri on saadetud. Sul võib sulgeda leht",
      "email-sent-message": "Sinu e-kiri on saadetud",
      "page-size": "Lehekülje suurus",
      "email-article-sent": "saatis sulle artikli",
      "read-more": "Loe edasi",
      "print-pdf": "Print & PDF",
      "get-pro": "Uuenda",
      "pro-alert": "Uuenda funktsioon"
    },
    "fi": {
      "print": "Tulosta",
      "pdf": "PDF",
      "email": "Sähköposti",
      "remove-images": "Poista kuvat",
      "images": "kuvat",
      "margin": "Marginaali",
      "undo": "Kumoa",
      "txt-size": "Tekstin koko",
      "delete": "Napsauta poistaaksesi",
      "dialog-close": "Sulje",
      "dialog-title": "Tulostetaan",
      "dialog-text": "Lähetetään tulostimeen.",
      "dialog-text-btn": "re-send",
      "pdf-head": "Luodaan PDF",
      "pdf-download": "Lataa PDF",
      "email-title": "Lähetä sähköpostilla",
      "email-to": "Vastaanottaja",
      "email-from": "Lähettäjä",
      "email-message": "Viesti",
      "email-send": "Lähetä",
      "email-product-sent-message": "Sähköpostiviesti on lähetetty. Voit sulkea tämän sivun",
      "email-sent-message": "Sähköpostiviesti on lähetetty",
      "page-size": "Sivun koko",
      "email-article-sent": "Lähetä artikkeli",
      "read-more": "Lue lisää",
      "print-pdf": "Tulosta & PDF",
      "get-pro": "Parantaa",
      "pro-alert": "Päivitä ominaisuus"
    },
    "fr": {
      "print": "Imprimer",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Supprimer les images",
      "images": "Images",
      "margin": "Marge",
      "undo": "Annuler",
      "txt-size": "Taille du texte",
      "delete": "Cliquez pour Supprimer",
      "dialog-close": "Fermer",
      "dialog-title": "Impression de la page",
      "dialog-text": "Envoi vers l'imprimante.",
      "dialog-text-btn": "renvoyer",
      "pdf-head": "Création du document PDF",
      "pdf-download": "Téléchargez votre PDF",
      "email-title": "Envoyer Cette Page",
      "email-to": "Destinataire",
      "email-from": "Expéditeur",
      "email-message": "Message",
      "email-send": "Envoyer",
      "email-product-sent-message": "Votre email a été envoyé. Vous pouvez fermer cette fenêtre.",
      "email-sent-message": "Votre email a été envoyé",
      "page-size": "Taille de la page",
      "email-article-sent": "vous a envoyé un article",
      "read-more": "Lire la suite",
      "print-pdf": "Imprimer & PDF",
      "get-pro": "Améliorer",
      "pro-alert": "Fonction de mise à niveau"
    },
    "he": {
      "print": "הדפסה",
      "pdf": "PDF",
      "email": "שליחה באימייל",
      "remove-images": "הסרת תמונות",
      "images": "תמונות",
      "margin": "שולים",
      "undo": "ביטול פעולה",
      "txt-size": "גודל הגופן",
      "delete": "לחץ כדי למחוק",
      "dialog-close": "יציאה",
      "dialog-title": "הדף שלך תחת הדפסה",
      "dialog-text": "<a onclick='window.print();return false;' href='#' class='btn btn-secondary btn-pf btn-sm re-send'>לשלוח שוב</a>. שליחת למדפסת",
      "pdf-head": "מכינים לך את הPDF ",
      "pdf-download": "הורד PDF שלך",
      "email-title": "שלח דף זה",
      "email-to": "עבור",
      "email-from": "שולח",
      "email-message": "הודעה",
      "email-send": "שלח",
      "email-product-sent-message": "הודעת הדואר האלקטרוני שלך נשלחה. אתה יכול לסגור את הדף",
      "email-sent-message": "הודעת הדואר האלקטרוני שלך נשלחה",
      "page-size": "גודל עמוד",
      "email-article-sent": "שלח לך מאמר",
      "read-more": "קראו עוד",
      "print-pdf": "הדפסה & PDF",
      "get-pro": "שדרג",
      "pro-alert": "תכונת שדרוג"
    },
    "hr": {
      "print": "Printanje",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Ukloni slike",
      "images": "Slike",
      "margin": "Margina",
      "undo": "Nazad",
      "txt-size": "Veličina teksta",
      "delete": "Izbriši",
      "dialog-close": "Zatvori",
      "dialog-title": "Printaj Stranicu",
      "dialog-text": "Printaj se na štampanje.",
      "dialog-text-btn": "pošalji ponovo",
      "pdf-head": "Generisanje PDF",
      "pdf-download": "Preuzmite PDF",
      "email-title": "Pošaljite ovu stranicu",
      "email-to": "Kome",
      "email-from": "Od",
      "email-message": "Poruka",
      "email-send": "Pošalji",
      "email-product-sent-message": "Vaša e-mail poruka je poslana. Možete zatvoriti stranicu",
      "email-sent-message": "Vaša e-mail poruka je poslana",
      "page-size": "Veličina stranice",
      "email-article-sent": "poslao članak",
      "read-more": "Opširnije",
      "print-pdf": "Printanje & PDF",
      "get-pro": "Nadogradnja",
      "pro-alert": "Značajka nadogradnje"
    },
    "hu": {
      "print": "Nyomtatás",
      "pdf": "PDF",
      "email": "E-mail",
      "remove-images": "Képek eltávolítása",
      "images": "Képek",
      "margin": "Oldalmargó",
      "undo": "Visszavonás",
      "txt-size": "Szövegméret",
      "delete": "Kattints a törléshez",
      "dialog-close": "Bezár",
      "dialog-title": "Oldal nyomtatása",
      "dialog-text": "Nyomtatóra küldés",
      "dialog-text-btn": "újraküldés",
      "pdf-head": "PDF készítése",
      "pdf-download": "PDF letöltése",
      "email-title": "Oldal ajánlása emailben",
      "email-to": " Címzett",
      "email-from": "Feladó",
      "email-message": "Üzenet",
      "email-send": "Küld",
      "email-product-sent-message": "Az e-mail üzenet el lett küldve. Lehet, hogy zárja be az oldalt",
      "email-sent-message": "Az e-mail üzenet el lett küldve",
      "page-size": "Oldalméret",
      "email-article-sent": "küldött egy cikket",
      "read-more": "Tovább",
      "print-pdf": "Print & PDF",
      "get-pro": "Frissítés",
      "pro-alert": "Frissítési szolgáltatás"
    },
    "it": {
      "print": "Stampa",
      "pdf": "PDF",
      "email": "E-mail",
      "remove-images": "Rimuovi Immagini",
      "images": "Immagini",
      "margin": "Margine",
      "undo": "Annulla",
      "txt-size": "Dimensione Carattere",
      "delete": "Clicca per Eliminare",
      "dialog-close": "Chiudi",
      "dialog-title": "Stampa in corso",
      "dialog-text": "Invio alla stampante in corso.",
      "dialog-text-btn": "Reinviare",
      "pdf-head": "Generazione del documento PDF",
      "pdf-download": "Scarica il PDF",
      "email-title": "Invia questa pagina",
      "email-to": "A",
      "email-from": "Da",
      "email-message": "Messaggio",
      "email-send": "Inviare",
      "email-product-sent-message": "Il tuo messaggio e-mail è stato inviato. È possibile chiudere la pagina",
      "email-sent-message": "Il tuo messaggio e-mail è stato inviato",
      "page-size": "Formato pagina",
      "email-article-sent": "ti ha inviato un articolo",
      "read-more": "Per saperne di più",
      "print-pdf": "Stampa e PDF",
      "get-pro": "aggiornamento",
      "pro-alert": "Funzionalità di aggiornamento"
    },
    "ja": {
      "print": "印刷",
      "pdf": "PDF",
      "email": "Eメール",
      "remove-images": "画像を削除",
      "images": "画像",
      "margin": "マージン",
      "undo": "やり直し",
      "txt-size": "文字の大きさ",
      "delete": "クリックしてこの部分を削除",
      "dialog-close": "閉じる",
      "dialog-title": "現在印刷中",
      "dialog-text": "プリンターに送信中",
      "dialog-text-btn": "再送信する",
      "pdf-head": "PDF作成中",
      "pdf-download": "PDFをダウンロード",
      "email-title": "このページをEmailで送信",
      "email-to": "宛先",
      "email-from": "送信元",
      "email-message": "本文",
      "email-send": "送信",
      "email-product-sent-message": "Eメールが送信されました。",
      "email-sent-message": "Eメールが送信されました。",
      "page-size": "ページの大きさ",
      "email-article-sent": "記事を送信しました。",
      "read-more": "続きを読む",
      "print-pdf": "印刷 & PDF",
      "get-pro": "アップグレード",
      "pro-alert": "この機能はアップグレードが必要です"
    },
    "ko": {
      "print": "인쇄",
      "pdf": "PDF",
      "email": "메일",
      "remove-images": "이미지 제거",
      "images": "이미지들",
      "margin": "여유",
      "undo": "되돌리기",
      "txt-size": "텍스트 크기",
      "delete": "삭제",
      "dialog-close": "닫기",
      "dialog-title": "웹페이지 인쇄",
      "dialog-text": "인쇄를 진행합니다.",
      "dialog-text-btn": "인쇄 시작",
      "pdf-head": "PDF 변환 진행중",
      "pdf-download": "PDF 다운로드",
      "email-title": "전자메일 전송",
      "email-to": "수신인",
      "email-from": "송신인",
      "email-message": "메시지",
      "email-send": "보내기",
      "email-product-sent-message": "메일이 전송되었습니다. 페이지를 닫을 수 있습니다",
      "email-sent-message": "메일이 전송되었습니다. ",
      "page-size": "페이지 크기",
      "email-article-sent": "님이 메일을 전송하셨습니다.^^",
      "read-more": "자세히 보기",
      "print-pdf": "PDF 인쇄",
      "get-pro": "업그레이드",
      "pro-alert": "업그레이드 기능"
    },
    "lt": {
      "print": "Spausdinti",
      "pdf": "PDF",
      "email": "El. Paštas",
      "remove-images": "Pašalinti Paveiksliukus",
      "images": "Vaizdai",
      "margin": "Margin",
      "undo": "Atgal",
      "txt-size": "Teksto Dydis",
      "delete": "Ištrinti",
      "dialog-close": "Uždaryti",
      "dialog-title": "Spausdina Puslapį",
      "dialog-text": "Siunčiame į Printerį.",
      "dialog-text-btn": "Persiųsti",
      "pdf-head": "Generuojamas Jūsų PDF",
      "pdf-download": "Your Download PDF",
      "email-title": "Siųsti šį puslapį e",
      "email-to": "Į",
      "email-from": "Nuo",
      "email-message": "Žinutė",
      "email-send": "Siųsti",
      "email-product-sent-message": "Jūsų elektroninio pašto žinutė išsiųsta. Galite uždaryti puslapį",
      "email-sent-message": "Jūsų elektroninio pašto žinutė išsiųsta",
      "page-size": "Puslapio dydis",
      "email-article-sent": "atsiuntė jums straipsnis",
      "read-more": "Plačiau",
      "print-pdf": "Spausdinti ir PDF",
      "get-pro": "Aggiornamento",
      "pro-alert": "Funzionalità di aggiornamento"
    },
    "nl": {
      "print": "Afdrukken",
      "pdf": "PDF",
      "email": "E-mail",
      "remove-images": "Afbeeldingen Verwijderen",
      "images": "Afbeeldingen",
      "margin": "Marge",
      "undo": "Undo",
      "txt-size": "Grootte Tekst",
      "delete": "Klik om te verwijderen.",
      "dialog-close": "Sluiten",
      "dialog-title": "Pagina afdrukken",
      "dialog-text": "Pagina wordt naar printer gezonden. <a onclick='window.print();return false;' href='#' class='btn btn-secondary btn-pf btn-sm re-send'>Opnieuw sturen</a>.",
      "pdf-head": "PDF Downloaden",
      "pdf-download": "Download Uw PDF",
      "email-title": "E-mail deze pagina",
      "email-to": "Naar",
      "email-from": "Van",
      "email-message": "Bericht",
      "email-send": "Sturen",
      "email-product-sent-message": "Uw e-mailbericht is verzonden. U kunt dit venster sluiten.",
      "email-sent-message": "Uw e-mailbericht is verzonden",
      "page-size": "Paginaformaat",
      "email-article-sent": "heeft je een artikel",
      "read-more": "Lees meer",
      "print-pdf": "Print & PDF",
      "get-pro": "Upgrade",
      "pro-alert": "Deze functie vereist een upgrade"
    },
    "no": {
      "print": "Skriv ut",
      "pdf": "PDF",
      "email": "Epost",
      "remove-images": "Fjern bilder",
      "images": "Bilder",
      "margin": "Margin",
      "undo": "Angre",
      "txt-size": "Tekststørrelse",
      "delete": "Klikk for å slette",
      "dialog-close": "Lukk",
      "dialog-title": "Skriver ut",
      "dialog-text": "Sender til skriveren.",
      "dialog-text-btn": "Send på nytt",
      "pdf-head": "Genererer din PDF",
      "pdf-download": "Lagre din PDF",
      "email-title": "Send denne siden på epost",
      "email-to": "Til",
      "email-from": "Fra",
      "email-message": "Beskjed",
      "email-send": "Send",
      "email-product-sent-message": "Din melding har blitt sendt. Du kan lukke vinduet",
      "email-sent-message": "Din melding har blitt sendt",
      "page-size": "Sidestørrelse",
      "email-article-sent": "Sendt deg en artikkel",
      "read-more": "Les mer",
      "print-pdf": "Skriv ut & PDF",
      "get-pro": "Oppgrader",
      "pro-alert": "Denne funksjonen krever oppgradering"
    },
    "pl": {
      "print": "Drukuj",
      "pdf": "PDF",
      "email": "E-mail",
      "remove-images": "Usuń Obrazy",
      "images": "Obrazy",
      "margin": "Margines",
      "undo": "Cofnij",
      "txt-size": "Rozmiar Czcionki",
      "delete": "Usuń",
      "dialog-close": "Zamknij",
      "dialog-title": "Drukowanie strony",
      "dialog-text": "Przesyłanie do drukarki.",
      "dialog-text-btn": "re-send",
      "pdf-head": "Tworzenie dokumentu w formacie PDF",
      "pdf-download": "Pobierz plik PDF",
      "email-title": "Wyślij stronę",
      "email-to": "Do",
      "email-from": "Od",
      "email-message": "Wiadomość",
      "email-send": "Wyślij",
      "email-product-sent-message": "Wiadomość e-mail została wysłana. Można zamknąć stronę",
      "email-sent-message": "Wiadomość e-mail została wysłana",
      "page-size": "Rozmiar strony",
      "email-article-sent": "wysłał artykuł",
      "read-more": "Czytaj więcej",
      "print-pdf": "Drukuj i pobierz PDF",
      "get-pro": "Aktualizacja",
      "pro-alert": "Ta funkcja wymaga aktualizacji"
    },
    "pt": {
      "print": "Imprimir",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Remover Imagens",
      "images": "Imagens",
      "margin": "Margem",
      "undo": "Anular",
      "txt-size": "Tamanho do texto",
      "delete": "Clique para apagar",
      "dialog-close": "Fechar",
      "dialog-title": "A imprimir a pÃ¡gina",
      "dialog-text": "A enviar para a impressora.",
      "dialog-text-btn": "reenviar",
      "pdf-head": "A preparar o PDF",
      "pdf-download": "Descarregue o PDF",
      "email-title": "Enviar por email",
      "email-to": "Para",
      "email-from": "De",
      "email-message": "Mensagem",
      "email-send": "Enviar",
      "email-product-sent-message": "A mensagem foi enviada. Pode fechar esta pÃ¡gina",
      "email-sent-message": "A mensagem foi enviada",
      "page-size": "Tamanho da pÃ¡gina",
      "email-article-sent": "Enviei um artigo",
      "read-more": "Ler mais",
      "print-pdf": "Imprimir & PDF",
      "get-pro": "Atualize",
      "pro-alert": "Este recurso requer atualização"
    },
    "pt-br": {
      "print": "Imprimir",
      "pdf": "PDF",
      "email": "E-mail",
      "remove-images": "Remover Imagens",
      "images": "Imagens",
      "undo": "Desfazer",
      "txt-size": "Tamanho texto",
      "delete": "Clique para Excluir",
      "dialog-close": "Fechar",
      "dialog-title": "Imprimir Sua Página",
      "dialog-text": "Enviando para a impressora.",
      "dialog-text-btn": "Reenviar",
      "pdf-head": "Seu gerando PDF",
      "pdf-download": "Baixe o seu PDF",
      "email-title": "Envie esta página por Email",
      "email-to": "Para",
      "email-from": "Remetente",
      "email-message": "Mensagem",
      "email-send": "Enviar",
      "email-product-sent-message": "Seu e-mail foi enviado. Você pode fechar a página",
      "email-sent-message": "Seu e-mail foi enviado",
      "page-size": "Tamanho da página",
      "email-article-sent": "enviou um artigo",
      "read-more": "Leia mais",
      "print-pdf": "Impressão e PDF",
      "get-pro": "Atualize",
      "pro-alert": "Este recurso requer atualização"
    },
    "ru": {
      "print": "Печать",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Удалить изображения",
      "images": "Изображений",
      "margin": "край",
      "undo": "Отменить",
      "txt-size": "Размер текста",
      "delete": "Нажмите для удаления",
      "dialog-close": "Закрыть",
      "dialog-title": "Распечатать страницу",
      "dialog-text": "Отправка на принтер.",
      "dialog-text-btn": "Отправить заново",
      "pdf-head": "Создание PDF",
      "pdf-download": "Скачать PDF",
      "email-title": "Отправить страницу другу",
      "email-to": "Кому",
      "email-from": "От кого",
      "email-message": "Текст сообщения",
      "email-send": "Отправить",
      "email-product-sent-message": "Ваше письмо было отправлено. Можете закрыть страницу",
      "email-sent-message": "Ваше письмо было отправлено",
      "page-size": "Размер страницы",
      "email-article-sent": "прислал вам страницу",
      "read-more": "Читать далее",
      "print-pdf": "Печать & Сохранение в PDF",
      "get-pro": "Обновить",
      "login": "Войти",
      "pro-alert": "Эта функция требует обновления"
    },
    "sk": {
      "print": "Tlačiť",
      "pdf": "PDF",
      "email": "E-mail",
      "remove-images": "Odstrániť obrázky",
      "images": "Snímky",
      "margin": "Okraj",
      "undo": "Späť",
      "txt-size": "Veľkosť písma",
      "delete": "Zmazanie Kliknutím",
      "dialog-close": "Zatvoriť",
      "dialog-title": "Prebieha tlač stránky",
      "dialog-text": "Odosielanie na tlačiareň.",
      "dialog-text-btn": "preposlať",
      "pdf-head": "Generovanie PDF",
      "pdf-download": "Automaticky Vaša PDF",
      "email-title": "Poslať túto stránku",
      "email-to": "Komu",
      "email-from": "Od",
      "email-message": "Správa",
      "email-send": "Odoslať",
      "email-product-sent-message": "Vaša e-mailová správa bola odoslaná. Môžete zavrieť stránku",
      "email-sent-message": "Vaša e-mailová správa bola odoslaná",
      "page-size": "Veľkosť stránky",
      "email-article-sent": "vám poslal článok",
      "read-more": "Prečítajte si viac",
      "print-pdf": "Tlač & PDF",
      "get-pro": "zvýšiť výkon",
      "pro-alert": "Táto funkcia vyžaduje zvýšiť výkon"
    },
    "sl": {
      "print": "Natisni",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Odstrani slike",
      "images": "Slike",
      "margin": "Marže",
      "undo": "Razveljavi",
      "txt-size": "Velikost teksta",
      "delete": "Klik za Brisanje",
      "dialog-close": "Zapri",
      "dialog-title": "Tiskanje vsebine",
      "dialog-text": "Povezovanje s tiskalnikom.",
      "dialog-text-btn": "Ponovno poveži…",
      "pdf-head": "Eneriram vaš PDF",
      "pdf-download": "Naložite si PDF",
      "email-title": "Pošlji to stran",
      "email-to": "Da",
      "email-from": "Od",
      "email-message": "Sporočilo",
      "email-send": "Pošlji",
      "email-product-sent-message": "Vaš e-poštno sporočilo je bilo poslano. Lahko zaprete stran",
      "email-sent-message": "Vaš e-poštno sporočilo je bilo poslano",
      "page-size": "Velikost strani",
      "email-article-sent": "vam poslali članek",
      "read-more": "Preberi več",
      "print-pdf": "PDF Print &",
      "get-pro": "Nadgradnja",
      "pro-alert": "Ta funkcija zahteva nadgradnjo."
    },
    "sr": {
      "print": "Штампање",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Уклони слике",
      "images": "Имагес",
      "margin": "Маргин",
      "undo": "Назад",
      "txt-size": "Величина текста",
      "delete": "Избриши",
      "dialog-close": "Затвори",
      "dialog-title": "Штампање странице",
      "dialog-text": "Шаље се на штампање.",
      "dialog-text-btn": "пошаљи поново",
      "pdf-head": "Генерисање PDF",
      "pdf-download": "Преузимите PDF",
      "email-title": "Пошаљите ову страницу",
      "email-to": "Коме",
      "email-from": "Од",
      "email-message": "Порука",
      "email-send": "Пошаљи",
      "email-product-sent-message": "Ваша емаил порука је послата. Можете да затворите страницу",
      "email-sent-message": "Ваша емаил порука је послата",
      "page-size": "Величина странице",
      "email-article-sent": "послао чланак",
      "read-more": "Опширније",
      "print-pdf": "Штампање & PDF",
      "get-pro": "Упграде",
      "pro-alert": "Ова функција захтева надоградњу."
    },
    "sv": {
      "print": "Skriv ut",
      "pdf": "PDF",
      "email": "Epost",
      "remove-images": "Ta bort bilder",
      "images": "Bilder",
      "margin": "Marginal",
      "undo": "Ångra",
      "txt-size": "Teckenstorlek",
      "delete": "Klicka för att ta bort",
      "dialog-close": "Stäng",
      "dialog-title": "Skriver ut sidan",
      "dialog-text": "Skickar till din skrivare.",
      "dialog-text-btn": "Skicka igen",
      "pdf-head": "Genererar PDF",
      "pdf-download": "Ladda ner din PDF",
      "email-title": "Mejla den här sidan",
      "email-to": "Till",
      "email-from": "Från",
      "email-message": "Meddelande",
      "email-send": "Skicka",
      "email-product-sent-message": "E-postmeddelandet har skickats. Du kan stänga sidan",
      "email-sent-message": "E-postmeddelandet har skickats",
      "page-size": "Sidstorlek",
      "email-article-sent": "skickat en artikel",
      "read-more": "Läs mer",
      "print-pdf": "Print & PDF",
      "get-pro": "Uppgradering",
      "pro-alert": "Den här funktionen kräver uppgradering."
    },
    "th": {
      "print": "พิมพ์",
      "pdf": "PDF",
      "email": "อีเมล์",
      "remove-images": "ลบภาพ",
      "images": "ภาพ",
      "margin": "ขอบ",
      "undo": "เรียกคืน",
      "txt-size": "ขนาดตัวอักษร",
      "delete": "คลิกเพื่อลบ",
      "dialog-close": "ปิด",
      "dialog-title": "สั่งพิมพ์หน้านี้",
      "dialog-text": "กำลังดำเนินการส่งไปยังเครื่องพิมพ์",
      "dialog-text-btn": "ส่งอีกครั้ง",
      "pdf-head": "สร้างไฟล์ PDF",
      "pdf-download": "ดาวน์โหลดไฟล์ PDF ของคุณ",
      "email-title": "ส่งหน้านี้",
      "email-to": "ไปยัง",
      "email-from": "จาก",
      "email-message": "ข่าวสาร",
      "email-send": "ส่ง",
      "email-product-sent-message": "ข้อความอีเมลของคุณได้ถูกส่ง คุณอาจปิดหน้า",
      "email-sent-message": "ข้อความอีเมลของคุณได้ถูกส่ง",
      "page-size": "ขนาดหน้า",
      "email-article-sent": "ส่งบทความ",
      "read-more": "อ่านเพิ่มเติม",
      "print-pdf": "พิมพ์และ PDF",
      "get-pro": "อัพเกรด",
      "pro-alert": "คุณสมบัตินี้ต้องมีการอัพเกรด"
    },
    "tr": {
      "print": "Yazdır",
      "pdf": "PDF",
      "email": "E-posta",
      "remove-images": "Resimleri Kaldır",
      "images": "Görüntüler",
      "margin": "Kenar",
      "undo": "Geri Al",
      "txt-size": "Yazı Boyutu",
      "delete": "Bu bölümü silmek için tıklayın",
      "dialog-close": "Kapat",
      "dialog-title": "Sayfa Yazdırılıyor",
      "dialog-text": "Yazıcıya gönderiliyor.",
      "dialog-text-btn": "Tekrar Gönder",
      "pdf-head": "PDF oluşturuluyor",
      "pdf-download": "PDF’i İndir",
      "email-title": "Bu Sayfayı E-postala",
      "email-to": "Kime",
      "email-from": "Kimden",
      "email-message": "Mesaj",
      "email-send": "Gönder",
      "email-product-sent-message": "E-posta iletiniz gönderildi. Sayfayı kapatabilirsiniz",
      "email-sent-message": "E-posta iletiniz gönderildi",
      "page-size": "Sayfa Boyutu",
      "email-article-sent": "Size incelemeniz üzere bir konu iletti.",
      "read-more": "Daha fazlası için tıklayın",
      "print-pdf": "Yazdır ve PDF Oluştur"
    },
    "uk": {
      "print": "Друк",
      "pdf": "PDF",
      "email": "Ел.пошта",
      "remove-images": "Вилучити зображення",
      "images": "Зображення",
      "margin": "Маржа",
      "undo": "Відмінити",
      "txt-size": "Розмір тексту",
      "delete": "Видалити",
      "dialog-close": "Закрити",
      "dialog-title": "Друк вашої сторінки",
      "dialog-text": "Надсилається на ваш принтер. <a onclick='window.print();return false;' href='#' class='btn btn-secondary btn-pf btn-sm'>re-send</a>",
      "pdf-head": "Генерується PDF",
      "pdf-download": "Завантажити PDF",
      "email-title": "Надіслати сторінку",
      "email-to": "До",
      "email-from": "Від",
      "email-message": "Повідомлення",
      "email-send": "Надіслати",
      "email-product-sent-message": "Ваше повідомлення було надіслано. Можете закрити цю сторінку",
      "email-sent-message": "Ваше повідомлення було надіслано",
      "page-size": "Розмір сторінки",
      "email-article-sent": "вам надіслана стаття",
      "read-more": "Читати більше",
      "print-pdf": "Друк і PDF",
      "get-pro": "Оновити",
      "pro-alert": "Ця функція потребує оновлення."
    },
    "vi": {
      "print": "In",
      "pdf": "PDF",
      "email": "Email",
      "remove-images": "Loại Bỏ Hình ảnh",
      "images": "Hình ảnh",
      "margin": "Ký quỹ",
      "undo": "Hoàn Tác",
      "txt-size": "Cỡ Chữ",
      "delete": "Click để xóa",
      "dialog-close": "Đóng",
      "dialog-title": "Đang In Trang Của Bạn",
      "dialog-text": "Đang gửi cho máy in của bạn. <a onclick='window.print();return false;' href='#' class='btn btn-secondary btn-pf btn-sm'>Gửi lại</a>",
      "pdf-head": "Đang Tạo Tệp PDF của Bạn",
      "pdf-download": "Tải Tệp PDF của Bạn",
      "email-title": "Gửi Email Trang Này",
      "email-to": "Đến",
      "email-from": "Từ",
      "email-message": "Thông Điệp",
      "email-send": "Gửi",
      "email-product-sent-message": "Email của bạn đã được gửi. Bạn có thể đóng trang này",
      "email-sent-message": "Thông Điệp Email Đã Được Gửi",
      "page-size": "Kích Cỡ Trang",
      "email-article-sent": "gửi bạn một bài viết",
      "read-more": "Đọc thêm",
      "print-pdf": "In & PDF",
      "get-pro": "nâng cấp",
      "pro-alert": "Tính năng này yêu cầu nâng cấp"
    },
    "zh": {
      "print": "打印",
      "pdf": "PDF",
      "email": "电子邮件",
      "remove-images": "删除图像",
      "images": "图片",
      "margin": "页边距",
      "undo": "复原",
      "txt-size": "文字大小",
      "delete": "单击“删除”",
      "dialog-close": "关闭",
      "dialog-title": "打印页面",
      "dialog-text": "发送到您的打印机。",
      "dialog-text-btn": "重发",
      "pdf-head": "生成您的PDF",
      "pdf-download": "下载您的PDF",
      "email-title": "通过电子邮件发送此页",
      "email-to": "对",
      "email-from": "从",
      "email-message": "信息",
      "email-send": "发送",
      "email-product-sent-message": "您的电子邮件已发送。您可以关闭页面",
      "email-sent-message": "您的电子邮件已发送",
      "page-size": "页面大小",
      "email-article-sent": "发送你的文章",
      "read-more": "阅读更多",
      "print-pdf": "打印和PDF",
      "get-pro": "升级",
      "pro-alert": "此功能需要升级"
    },
    "zh-cn": {
      "print": "打印",
      "pdf": "PDF",
      "email": "电子邮件",
      "remove-images": "删除图像",
      "images": "图片",
      "margin": "页边距",
      "undo": "复原",
      "txt-size": "文字大小",
      "delete": "单击“删除”",
      "dialog-close": "关闭",
      "dialog-title": "打印页面",
      "dialog-text": "发送到您的打印机。",
      "dialog-text-btn": "重发",
      "pdf-head": "生成您的PDF",
      "pdf-download": "下载您的PDF",
      "email-title": "通过电子邮件发送此页",
      "email-to": "对",
      "email-from": "从",
      "email-message": "信息",
      "email-send": "发送",
      "email-product-sent-message": "您的电子邮件已发送。您可以关闭页面",
      "email-sent-message": "您的电子邮件已发送",
      "page-size": "页面大小",
      "email-article-sent": "发送你的文章",
      "read-more": "阅读更多",
      "print-pdf": "打印和PDF",
      "get-pro": "升级",
      "pro-alert": "此功能需要升级"
    },
    "zh-sg": {
      "print": "打印",
      "pdf": "PDF",
      "email": "电子邮件",
      "remove-images": "删除图像",
      "images": "图片",
      "margin": "页边距",
      "undo": "复原",
      "txt-size": "文字大小",
      "delete": "单击“删除”",
      "dialog-close": "关闭",
      "dialog-title": "打印页面",
      "dialog-text": "发送到您的打印机。",
      "dialog-text-btn": "重发",
      "pdf-head": "生成您的PDF",
      "pdf-download": "下载您的PDF",
      "email-title": "通过电子邮件发送此页",
      "email-to": "对",
      "email-from": "从",
      "email-message": "信息",
      "email-send": "发送",
      "email-product-sent-message": "您的电子邮件已发送。您可以关闭页面",
      "email-sent-message": "您的电子邮件已发送",
      "page-size": "页面大小",
      "email-article-sent": "发送你的文章",
      "read-more": "阅读更多",
      "print-pdf": "打印和PDF",
      "get-pro": "升级",
      "pro-alert": "此功能需要升级"
    },
    "zh-tw": {
      "print": "列印",
      "pdf": "PDF",
      "email": "電子郵件",
      "remove-images": "刪除圖片",
      "images": "图片",
      "margin": "页边距",
      "undo": "復原",
      "txt-size": "字體大小",
      "delete": "點擊刪除",
      "dialog-close": "關閉",
      "dialog-title": "列印頁面中",
      "dialog-text": "傳送到您的印表機",
      "dialog-text-btn": "重送",
      "pdf-head": "建立PDF中",
      "pdf-download": "下載您的PDF",
      "email-title": "通過電子郵件發送此頁",
      "email-to": "對",
      "email-from": "從",
      "email-message": "信息",
      "email-send": "發送",
      "email-product-sent-message": "您的電子郵件已發送。您可以關閉頁面",
      "email-sent-message": "您的電子郵件已發送",
      "page-size": "頁面大小",
      "email-article-sent": "發送你的文章",
      "read-more": "閱讀更多",
      "print-pdf": "打印和PDF",
      "get-pro": "升级到专业版",
      "pro-alert": "升級"
    },
    "zh-hk": {
      "print": "列印",
      "pdf": "PDF",
      "email": "電子郵件",
      "remove-images": "刪除圖片",
      "images": "图片",
      "margin": "页边距",
      "undo": "復原",
      "txt-size": "字體大小",
      "delete": "點擊刪除",
      "dialog-close": "關閉",
      "dialog-title": "列印頁面中",
      "dialog-text": "傳送到您的印表機",
      "dialog-text-btn": "重送",
      "pdf-head": "建立PDF中",
      "pdf-download": "下載您的PDF",
      "email-title": "通過電子郵件發送此頁",
      "email-to": "對",
      "email-from": "從",
      "email-message": "信息",
      "email-send": "發送",
      "email-product-sent-message": "您的電子郵件已發送。您可以關閉頁面",
      "email-sent-message": "您的電子郵件已發送",
      "page-size": "頁面大小",
      "email-article-sent": "發送你的文章",
      "read-more": "閱讀更多",
      "print-pdf": "打印和PDF",
      "get-pro": "升级到专业版",
      "pro-alert": "升級"
    }
  };

  return function(key) {
    var result = DATA[navigator.language];
    if(result && result[key]) { return result[key]; }

    var prefix = navigator.language.split('-')[0];
    result = DATA[prefix];
    if(result && result[key]) { return result[key]; }

    return DATA.en[key];
  };
})();
var pfRedirect = (function () {
  return function(pfHost, userSettings, url) {
    var components = ['source=cs', 'url=' + encodeURIComponent(url)];

    for(var config in userSettings) {
      var setting = userSettings[config];
      if (typeof setting === 'object' && setting.value) {
        components.push(config + '=' + encodeURIComponent(setting.value));
      } else if (typeof setting !== 'undefined') {
        components.push(config + '=' + encodeURIComponent(setting));
      }
    }
    return pfHost + '/print/?' + components.join('&');
  };
})();









var originalWindow = window.parent;
var pfData = {};
var algoData = {};

// Replace jQuery trim with native trim if existed for better performance
var nativeTrim = ''.trim;
if (typeof nativeTrim === 'function') {
  $.trim = function (value) {
    return value != null ? nativeTrim.call(value) : ''; // jshint ignore:line
  };
}

String.prototype.removeSpaces = function() {
  return this.replace(/&nbsp;/g, '').replace(/\s+/g, '');
};

var PfStartCoreHandler = function(payload) {
  if (payload.dsData) { pfData.dsData = payload.dsData; }
  // NOTE: in case some cases this event fired twice and first one with payload.pfData undefined
  if (payload.pfData) {
    $.extend(pfData, payload.pfData);
    core.start();
  }
};
var pfLoadCoreCalled = false;

// Scripts communication
messageBus.listen('pf-core', {
  PfStartCore: PfStartCoreHandler,
  PfImageToBase64Hook: function(payload) {
    messageBus.postMessage('algo', 'PfImageToBase64Hook', payload);
  },
  PfLaunchCore: function() {
    core.launch();
  },
  PfAlgoLoaded: function() {
    messageBus.postMessage('algo', 'PfStartAlgo', {pfData: pfData});
  },
  PfExtensionAlgoLoaded: function() {
    messageBus.postMessage('algo', 'PfLoadAlgo', {pfData: pfData});
  },
  PfRunPostAlgoProcesses: function(payload) {
    core.contentData = payload.contentData;
    core.runPostAlgoProcesses();
  },
  // pf.js could load DS settings when core.js already loaded, in this case it sends this event with dsData right after loading it
  PfConfigureDSSettings: function(payload) {
    pfData.dsData = payload.dsData;
  },
  PfNSFWChecked: function(payload) {
    core.nsfwResult = {
      state: payload.state,
      matchedPhrase: payload.matchedPhrase
    };
    core.runPostAlgoProcesses();
  },
  PfPdfOkEvent: function() {
    utils.formSubmitted = true;
    if (utils.pdfFailedSubmit != 0) {
      librato.sendPDFResubmitStatus('cs.pdf.resubmit.success');
    }
  },
  PfInitCoreExtension: function(payload) {
    window.extensionRootTabId = parseInt(payload.extensionRootTabId, 10);
    messageBus.postMessage('root', 'PfExtensionCoreLoaded');
  },
  PfLoadCore: function(payload) {
    if(!pfLoadCoreCalled) {
      pfLoadCoreCalled = true;
      PfStartCoreHandler(payload);
    }
  },
  PfOriginalPageFetchResult: function(payload) {
    window.__originalPageFetchResult = payload;
    for(var i = 0; i <  window.__originalPageFetchHandlers.length; i++) {
      var callback = window.__originalPageFetchHandlers[i];
      if(callback) { callback(window.__originalPageFetchResult); }
    }
  }
});

window.__originalPageFetchHandlers = [];
var OriginalPageFetch = function(callback) {
  if (window.__originalPageFetchResult) {
    if (callback) { callback(window.__originalPageFetchResult); }
    return;
  }

  window.__originalPageFetchHandlers.push(callback);
  if(window.__originalPageFetchHandlers.length === 1) { messageBus.postMessage('root', 'PfOriginalPageFetch'); }
}

var BrowserDetect={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS";},searchString:function(a){for(var b=0;b<a.length;b++){var c=a[b].string;var d=a[b].prop;this.versionSearchString=a[b].versionSearch||a[b].identity;if(c){if(c.indexOf(a[b].subString)!=-1)return a[b].identity;}else if(d)return a[b].identity;}},searchVersion:function(a){var b=a.indexOf(this.versionSearchString);if(b==-1)return;return parseFloat(a.substring(b+this.versionSearchString.length+1));},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};
try {BrowserDetect.init();} catch(e) {}

// remove images by default
var imageFreeDomains = ['naturesgarden.co.za', 'cehd.gmu.edu', 'azaleafalls.com', 'americantrails.org'];

// click to delete disabled
var deleteDisabledDomains = ['tourismresearchmt.org', 'equalvoiceforfamilies.org', 'mansmith.net', 'matthewlberg.com', 'qrgtx.com', 'withoutreservation.org', 'knitting-and.com', 'sbdcnet.org', 'inglesonline.com.br', 'courtroomlogic.com', 'rachaelcampbell.com', 'cateringbyanne.com', 'fundschoolhouse.com', 'shulamitgallery.com', 'thekitchencousins.com', 'prouds.com.fj', 'lawnow.org', 'rohanphoto.com', 'kerrygoldusa.com'];

var settings = {
  hideImages: false,
  disableClickToDel: false,
  infoFetchedFromServer: false,
  algoRunFinished: false,
  localizedClickToDelTitle: "click to delete",
  clickToDelElements: 'small, footer, header, aside, details, dialog, figure, nav, summary, twitter-widget, p, img, blockquote, h1, h2, h3, h4, h5, h6, ol, ul, li, a, table, td, pre, span, code, dl, dt, dd, hr, div.pf-caption, video, figcaption, data',
  nonClickToDelElements: '#pf-title, #pf-src, #pf-src-icon, .pf-src-icon, .pf-src-name, .pf-src-url',
  publisherNonClickToDelElements: '#copyright, .copyright, .delete-off, .delete-no',

  setup: function() {
    var _t = this;
    $.each(imageFreeDomains, function(k,domain) {
      if (pfData.config.domains.page.indexOf(domain) != -1) {
        _t.hideImages = true;
        return false;
      }
    });
    $.each(deleteDisabledDomains, function(k,domain) {
      if (pfData.config.domains.page.indexOf(domain) != -1) {
        _t.disableClickToDel = true;
        return false;
      }
    });
    if (parseInt(pfData.userSettings.disableClickToDel) === 1) {
      this.disableClickToDel = true;
    }
    if (pfData.userSettings.imagesSize === 'remove-images') {
      this.hideImages = true;
    }
  },
};

var utils = {
  formSubmitted: false,
  pdfSubmitCheckInterval: 15000,
  pdfFailedSubmit: 0,
  pdfFailedSubmitLimit: 1,

  isPro: function() {
    return !pfData.dsData || pfData.dsData.domain_settings.ad_free;
  },

  checkFormSubmission: function() {
    if (pfData.config.isExtension) { return; }

    if (utils.pdfFailedSubmit >= utils.pdfFailedSubmitLimit) {
      librato.sendPDFResubmitStatus('cs.pdf.resubmit.failed');
      return;
    }

    if (!utils.formSubmitted) {
      utils.pdfFailedSubmit++;
      $("#pf-pdf-form").submit();
      setTimeout(function() { utils.checkFormSubmission(); }, utils.pdfSubmitCheckInterval);
    }
  },
};

var core = {
  deletedNodes: [],
  deletedNodesCss: [],
  waitBodyCounter: 0,
  launched: false,

  init: function() {
    this.waitBodyCounter += 1;
    if (this.waitBodyCounter < 30 && !document.body) {
      return setTimeout(function(){core.init();}, 13 * this.waitBodyCounter);
    }

    messageBus.postMessage('root', 'PfCoreLoaded');
  },

  start: function() {
    this.launch();
  },

  launch: function() {
    if (this.launched) {
      return;
    }

    this.launched = true;
    // NOTE: run original page fetch in none blocking manner
    OriginalPageFetch();

    try {
      logger.init(pfData);
      logger.time('Core.js Time');
      settings.setup();

      if (!pfData.onServer) {
        this.resetStyles();
        this.addViewPortTag();
      }

      ui.setup();
      this.createAlgoIframe();

      logger.timeEnd('Core.js Time');
    } catch(ex) {
      logger.console.error();(ex);
    }
  },

  resetStyles: function() {
    var css = 'body, body * { z-index: 0 !important; }' +
              'html, body {' +
                'overflow: hidden !important;' +
                'height: 100% !important;' +
                'margin: 0 !important;' +
                'position: static !important;' +
                'margin: 0px !important;' +
                'padding: 0px !important;' +
                'overflow: hidden !important;' +
              '}';

    if (pfData.browser.isIE) {
      css += 'body {' +
               'overflow-y: hidden !important;' +
               'background-color: transparent !important;' +
             '}';
    }

    messageBus.postMessage('root', 'PfAddCSS', {css: css});
  },

  restoreStyles: function() {
    messageBus.postMessage('root', 'PfRestoreStyles');
  },

  addViewPortTag: function() {
    messageBus.postMessage('root', 'PfAddViewPortTag');
  },

  showOriginalPage: function() {
    algoData.doc.body.innerHTML = '';
    document.getElementById('algo-iframe').contentWindow.location.replace(pfData.config.urls.page.replace("pfstyle=wp",'').replace(/#(.*)$/,''));
    this.enableOnlyPrint();
  },

  enableOnlyPrint: function() {
    $('.pf-edit, .pf-actions #w-pdf, .pf-actions #w-email').remove();
    toolbar.printOnlySetup();
  },

  createAlgoIframe: function() {
    var originalTitle = pfData.page.title;
    var customCss = '';

    if ($.trim(pfData.userSettings.customCSSURL) !== '') {
      customCss = '<link media="screen,print" type="text/css" rel="stylesheet" href="' + $.trim(pfData.userSettings.customCSSURL) + '">';
    }
    var algoIframe = commonUtils.createIframe(document);

    algoIframe.id = 'algo-iframe';
    algoIframe.name = 'algo';
    commonUtils.addClassTo(algoIframe, 'js-print-area');
    commonUtils.addClassTo(algoIframe, 'flex-auto');

    if (pfData.config.disableUI) {
      algoIframe.height = "500px";
      algoIframe.width = "80%";
      document.body.appendChild(algoIframe);
    } else {
      document.getElementById('insert-content').appendChild(algoIframe);
    }

    if (pfData.config.isExtension) {
      algoIframe.src = pfData.config.extensionPath + '/algo.html';
      // Deprecated Removed by March 10th
      algoIframe.onload = function() {
        messageBus.postMessage('algo', 'PfInitAlgoExtension', {extensionRootTabId: window.extensionRootTabId});
        try {
          algoWindow = algoIframe.contentWindow;
          if (algoWindow && algoWindow.document) {
            algoWindow.document.title = originalTitle;
          }

          messageBus.postMessage(
            'algo', 'PfLoadAlgo', {pfData: pfData},
            function() { messageBus.postMessage('root', 'PfExtensionAlgoLoaded'); }
          );
        } catch(e) {}
        algoIframe.onload = null;
      };
    } else {
      algoWindow = algoIframe.contentWindow;

      algoIframe.src = "/assets/client/algo-7aceaee756bc4cc3dd3c89562109b43176808d53b06adb487e56c041e91aed99.html";
      algoIframe.onload = function() {
        var customCssUrl = $.trim(pfData.userSettings.customCSSURL);
        var doc = algoIframe.contentWindow.document;
        var link = doc.createElement('link');
        link.setAttribute('media', 'screen,print');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', customCssUrl);
        doc.head.appendChild(link);
        var title = doc.createElement('title');
        title.innerText = originalTitle;
        doc.head.appendChild(title)
        algoIframe.onload = null;
      }
    }
  },

  configureTranslations: function() {
    $('.localize').map(function() {
      // We have introduced translationKey attribute to help in cases where the same string might required
      // to be translated and we can't have duplicate ids
      var localized = uiLocales(this.id) || uiLocales(this.getAttribute('translationKey'));
      if(localized) { this.innerText = uiLocales(this.id) || uiLocales(this.getAttribute('translationKey')); }
    });
    settings.localizedClickToDelTitle = uiLocales('delete');
    settings.infoFetchedFromServer = true;
  },

  renderedTweets: function(doc) {
    return $('twitter-widget.twitter-tweet-rendered, iframe.twitter-tweet-rendered, .twitter-tweet-rendered iframe, pf-iframe.twitter-tweet-rendered, .twitter-tweet-rendered pf-iframe', doc);
  },

  refetchTwitterWidgets: function() {
    var tweets = this.renderedTweets(algoData.doc);
    if (!tweets.length) { return; }

    OriginalPageFetch(function(originalResponse) {
      if (originalResponse && originalResponse.status === 'success') {
        var $html = $(originalResponse.responseText);
        $.each(tweets, function(i, tweet) {
          var blockquote = $html.find("blockquote.twitter-tweet a[href*='" + tweet.dataset.tweetId  + "']").closest('blockquote.twitter-tweet');
          if (blockquote.length) {
            $(tweet).closest('.twitter-tweet-rendered').replaceWith(blockquote);
          }
        });
      }
    });
  },

  runPostAlgoProcesses: function() {
    if (!core.contentData || !core.nsfwResult) {
      return;
    }

    contentData = core.contentData;
    contentData.nsfwState = core.nsfwResult.state;
    contentData.nsfwMatchedPhrase = core.nsfwResult.matchedPhrase;

    logger.time('Post Algo Process Time');
    settings.algoRunFinished = true;

    try {
      pfData.page.dir =  (pfData.page.dir.toLowerCase() === "rtl") ? "rtl" : contentData.dir;
      algoData.doc = algoWindow.document;

      if (contentData.hasContent) {
        this.processText();

        if (!pfData.onServer) {
          toolbar.setup();
          if (settings.hideImages) {
            this.hideImages(true);
          }
          this.setupFontSize();
          this.refetchTwitterWidgets();
        }
      } else if (!pfData.onServer) {
        this.showOriginalPage();
      }

      messageBus.postMessage('root', 'PfScrollTop');
      ui.hideLoader();

      messageBus.postMessage('root', 'PfFinished', {hasContent: contentData.hasContent});

      logger.timeEnd('Post Algo Process Time');
      logger.log('Total Time: ' + ((new Date().getTime()) - pfData.startTime) + ' ms');
    } catch(ex) {
      logger.error(ex);
    }
  },

  customPrint: function() {
    var algoIframe = frames.algo;
    algoIframe.focus();
    if (pfData.browser.isIE) {
      // this also solves the HTML5 shim js causing blank print. Codebase - #73
      algoIframe.document.execCommand('print', false, null);
    } else {
      algoIframe.print();
    }
  },

  resizeImages: function(newSize) {
    var sizeCssClass = commonUtils.resizeImageCssClass(newSize);

    $('.flex-width', algoData.doc)
      .removeClass('pf-size-full pf-size-large pf-size-medium pf-size-small pf-size-remove')
      .addClass(sizeCssClass);
  },

  hideImages: function(flag) {
    var contentDiv = '#pf-content';
    $(contentDiv + ' img', algoData.doc).toggleClass('pf-hidden', flag);
    $(contentDiv + ' img.thumbimage', algoData.doc).parents('.thumbinner').toggleClass('pf-hidden', flag);
    $(contentDiv + ' img', algoData.doc).parents('.img-separator').toggleClass('pf-hidden', flag);
  },

  processText: function() {
    $('body', algoData.doc)
      .append('<br style="clear:both">')
      .addClass('direction-' + pfData.page.dir);

    $('body', algoData.doc).append('<br style="clear:both">');
    $('#pf-content, #pf-title',algoData.doc).css({'direction': pfData.page.dir});

    try {
      $('#pf-content a, #pf-content li', algoData.doc).each(function(i) {
        var $this = $(this);
        if (!$this.attr('name') && $this.text().removeSpaces() === '' && $this.find('img,canvas,svg').length === 0) {
          $this.remove();
        }
      });

      $('#pf-content div.separator', algoData.doc).each(function(i) {
        var $this = $(this);
        var $next = $this.next();
        var $prev = $this.prev();
        if($this.children().length == $this.find('a,br').length) {
          $this.addClass('img-separator');
          if($prev.find('img').length === 0 && $prev.text().removeSpaces() === '') {
            $prev.remove();
          }
          if($next.find('img').length === 0 && $next.text().removeSpaces() === '') {
            $next.remove();
          }
        }
        if($this.find('a,img').length === 0 && $this.text().removeSpaces() === '') {
          $this.remove();
        }
      });
    } catch(e) {
      logger.log('processText failed');
    }
  },

  setupFontSize: function() {
    var fontClass = Cookies.get('printfriendly-font-class');
    if(!fontClass){
      fontClass = 'pf-12';
    }
    $('#text-size').val(fontClass).trigger('change');
  }
};

var ui = {
  dialogVisible: false,
  setup: function() {
    this.fillBody();
    core.configureTranslations();
  },

  fillBody: function() {
    document.body.innerHTML += pfData.config.disableUI ? '' : this.bodyHTML();
  },

  bodyHTML: function() {
   return [
    '<form id="pf-pdf-form" method="post" action="' + pfData.config.urls.pdfMake + "?extension=" + pfData.config.isExtension + '" target="pdf_iframe" accept-charset="UTF-8">',
    '<input type="hidden" name="hostname" value="">',
    '<input type="hidden" name="url" value="">',
    '<input type="hidden" name="platform" value="">',
    '<input type="hidden" name="source" value="cs">',
    '<input type="hidden" name="code" value="" >',
    '<input name="iehack" type="hidden" value="&#9760;">',
    '<input type="hidden" name="title" value="" >',
    '<input type="hidden" name="content_css_url" value="" >',
    '<input type="hidden" name="custom_css_url" value="" >',
    '<input type="hidden" name="dir" value="" >',
    '<input type="hidden" name="cs_adfree" value="" >',
    '</form>',
    '<svg style="position: absolute; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>',
    '<symbol id="icon-reply" viewBox="0 0 32 32"><path d="M4.687 11.119l9.287 8.933v-5.412c2.813 0 9.973 0.062 9.973 7.426 0 3.855-2.734 7.072-6.369 7.816 5.842-0.792 10.359-5.747 10.359-11.806 0-11.256-12.026-11.352-13.963-11.352v-4.606l-9.287 9.001z"></path></symbol>',
    '<symbol id="icon-download" viewBox="0 0 26 28"><path d="M20 21c0-0.547-0.453-1-1-1s-1 0.453-1 1 0.453 1 1 1 1-0.453 1-1zM24 21c0-0.547-0.453-1-1-1s-1 0.453-1 1 0.453 1 1 1 1-0.453 1-1zM26 17.5v5c0 0.828-0.672 1.5-1.5 1.5h-23c-0.828 0-1.5-0.672-1.5-1.5v-5c0-0.828 0.672-1.5 1.5-1.5h7.266l2.109 2.125c0.578 0.562 1.328 0.875 2.125 0.875s1.547-0.313 2.125-0.875l2.125-2.125h7.25c0.828 0 1.5 0.672 1.5 1.5zM20.922 8.609c0.156 0.375 0.078 0.812-0.219 1.094l-7 7c-0.187 0.203-0.453 0.297-0.703 0.297s-0.516-0.094-0.703-0.297l-7-7c-0.297-0.281-0.375-0.719-0.219-1.094 0.156-0.359 0.516-0.609 0.922-0.609h4v-7c0-0.547 0.453-1 1-1h4c0.547 0 1 0.453 1 1v7h4c0.406 0 0.766 0.25 0.922 0.609z"></path></symbol>',
    '<symbol id="icon-text-height" viewBox="0 0 28 28"><path d="M27.25 22c0.688 0 0.906 0.438 0.484 0.984l-1.969 2.531c-0.422 0.547-1.109 0.547-1.531 0l-1.969-2.531c-0.422-0.547-0.203-0.984 0.484-0.984h1.25v-16h-1.25c-0.688 0-0.906-0.438-0.484-0.984l1.969-2.531c0.422-0.547 1.109-0.547 1.531 0l1.969 2.531c0.422 0.547 0.203 0.984-0.484 0.984h-1.25v16h1.25zM1.266 2.016l0.844 0.422c0.109 0.047 2.969 0.078 3.297 0.078 1.375 0 2.75-0.063 4.125-0.063 1.125 0 2.234 0.016 3.359 0.016h4.578c0.625 0 0.984 0.141 1.406-0.453l0.656-0.016c0.141 0 0.297 0.016 0.438 0.016 0.031 1.75 0.031 3.5 0.031 5.25 0 0.547 0.016 1.156-0.078 1.703-0.344 0.125-0.703 0.234-1.062 0.281-0.359-0.625-0.609-1.313-0.844-2-0.109-0.313-0.484-2.422-0.516-2.453-0.328-0.406-0.688-0.328-1.172-0.328-1.422 0-2.906-0.063-4.312 0.109-0.078 0.688-0.141 1.422-0.125 2.125 0.016 4.391 0.063 8.781 0.063 13.172 0 1.203-0.187 2.469 0.156 3.625 1.188 0.609 2.594 0.703 3.813 1.25 0.031 0.25 0.078 0.516 0.078 0.781 0 0.141-0.016 0.297-0.047 0.453l-0.531 0.016c-2.219 0.063-4.406-0.281-6.641-0.281-1.578 0-3.156 0.281-4.734 0.281-0.016-0.266-0.047-0.547-0.047-0.812v-0.141c0.594-0.953 2.734-0.969 3.719-1.547 0.344-0.766 0.297-5 0.297-5.984 0-3.156-0.094-6.312-0.094-9.469v-1.828c0-0.281 0.063-1.406-0.125-1.625-0.219-0.234-2.266-0.187-2.531-0.187-0.578 0-2.25 0.266-2.703 0.594-0.75 0.516-0.75 3.641-1.687 3.703-0.281-0.172-0.672-0.422-0.875-0.688v-5.984z"></path></symbol>',
    '<symbol id="icon-image" viewBox="0 0 30 28"><path d="M10 9c0 1.656-1.344 3-3 3s-3-1.344-3-3 1.344-3 3-3 3 1.344 3 3zM26 15v7h-22v-3l5-5 2.5 2.5 8-8zM27.5 4h-25c-0.266 0-0.5 0.234-0.5 0.5v19c0 0.266 0.234 0.5 0.5 0.5h25c0.266 0 0.5-0.234 0.5-0.5v-19c0-0.266-0.234-0.5-0.5-0.5zM30 4.5v19c0 1.375-1.125 2.5-2.5 2.5h-25c-1.375 0-2.5-1.125-2.5-2.5v-19c0-1.375 1.125-2.5 2.5-2.5h25c1.375 0 2.5 1.125 2.5 2.5z"></path></symbol>',
    '</defs></svg>',
// PF-APP Wrapper
    '<div class="pf-app-container d-flex flex-column">',
      '<div id="pf-app" class="container d-flex flex-column pf-app-wrapper">',
        '<div class="pf-header d-none d-sm-flex"></div>',
        '<div class="pf-app-inner d-flex flex-column">',
// Toolbar
          '<div class="pf-toolbar d-flex flex-row">',
            '<div class="pf-actions d-flex flex-row">',
              '<button type="button" class="btn-pf d-flex flex-sm-row flex-column align-items-center justify-content-center px-lg-3 px-xl-4" id="w-print"><span class="pf-sprite"></span><strong id="print" class="localize ml-1">Print</strong></button>',
              '<button type="button" id="w-pdf" class="btn-pf d-flex flex-sm-row flex-column align-items-center justify-content-center px-lg-3 px-xl-4"><span class="pf-sprite"></span><strong id="pdf" class="localize ml-1">PDF</strong></button>',
              '<button type="button" class="btn-pf d-flex flex-sm-row flex-column align-items-center justify-content-center px-lg-3 px-xl-4" id="w-email"><span class="pf-sprite"></span><strong id="email" class="localize ml-1">Email</strong></button>',
              '<div class="b-l-white"></div>',
            '</div>',
            '<div class="pf-edit d-flex flex-row justify-content-center mx-auto">',
              '<div id="w-txtsize" class="pf-text-size d-flex flex-row align-items-center mx-1 mx-sm-2 mx-md-3"><svg class="icon icon-text-height d-none d-sm-inline-block mr-2"><use xlink:href="#icon-text-height"></svg><select class="form-control" id="text-size" name="txtsize"><option value="pf-15">130%</option><option value="pf-14">120%</option><option value="pf-13">110%</option><option value="pf-12">100%</option><option value="pf-11">90%</option><option value="pf-10">80%</option><option value="pf-9">70%</option></select></div>',
              '<div id="w-imagesize" class="pf-image-size d-flex flex-row align-items-center mx-1 mx-md-4"><svg class="icon icon-image d-none d-sm-inline-block mr-2"><use xlink:href="#icon-image"></svg><select class="form-control" id="imagesize" name="imgsize"><option class="small" value="full-size">100%</option><option value="large">75%</option><option value="medium">50%</option><option value="small">25%</option><option value="remove-images">0</option></select></div>',
              '<button type="button" id="w-undo" class="btn-pf js-undo-button d-inline-flex flex-row align-items-center mx-1 mx-sm-2 mx-md-3"><svg class="icon icon-undo"><use xlink:href="#icon-reply"></svg><span id="undo" class="localize d-none d-sm-inline-block ml-1">Undo</span></button>',
            '</div>',
            '<button id="pf-app-close" aria-label="Close" class="d-block close btn-pf align-self-start px-2 py-1" type="button"><span aria-hidden="true">&times;</span></button></div>',
// PF-APP Dialog
          '<div id="pf-dialog-frame" class="pf-dialog-mask js-dialog-container">',
            '<div class="pf-dialog-container p-2 mx-auto my-4">',
              /* Dialog */
          		'<div class="pf-dialog-header px-3 px-sm-5 rounded-top ">',
                '<button aria-label="Close" class="close btn-pf align-self-start p-2 js-dialog-close-button fs-5" id="pf-d-close-wrap" type="button"><span aria-hidden="true" class="fs-5">&times;</span></button>',
                /* Print Header */
                '<div id="pf-dialog-print" class="js-dialog js-dialog-print">',
                  '<div class="pf-sprite float-left mr-3"></div>',
                    '<h2 id="dialog-title" class="localize">Printing Your Page</h2>',
                    '<div><span id="dialog-text" class="localize">We\'ve sent your page to your printer</span> <a class="localize btn btn-secondary btn-pf btn-sm re-send" id="dialog-text-btn">re-send</a></div></div>',
                /* PDF Header */
                '<div id="pf-dialog-pdf" class="js-dialog js-dialog-pdf"><div id="pdf-iframe-container"></div></div>',
              '</div>',/* pf-dialog-header*/
              '<div id="pf-dialog-content" class="pf-dialog-content"></div>',
            '</div>',/* pf-dialog-container*/
          '</div>', /* End pf-dialog-frame*/
// CONTENT

            '<div id="insert-content" class="pf-content-wrapper d-flex pf-content-scroll">',
            /* Start PF Loading Animation */
              '<div id="pf_loading"><div class="pf-loading-mask d-flex align-items-center justify-content-center"><div class="pf-spinner pf-spinner-success pf-spinner-lg"></div></div></div>',/* End PF Loading Animation */
            '</div>',/* End pf-content*/
            '</div>',/* End PF-APP Inner */
          '<div id="pf-ft" class="pf-ft text-center"><a href="https://www.printfriendly.com" class="pf-branding js-pf-branding" title="PrintFriendly & PDF" target="_blank">Powered by PrintFriendly.com</a></div>',
        '</div>', /* End PF-APP Wrapper */
      '</div>', /* End PF-APP Container */
      '<form id="pf-email-form" accept-charset="UTF-8" target="email" method="post" action="' + pfData.config.urls.email + '">',
        '<input type="hidden" name="content" value="" >',
        '<input name="iehack" type="hidden" value="&#9760;">',
        '<input type="hidden" name="title" value="" >',
        '<input type="hidden" name="url" value="" >',
        '<input type="hidden" name="cs_adfree" value="" >',
      '</form>',
    ].join("\n");
  },

  hideLoader: function() {
    $('#pf_loading').fadeOut(500);
  },

  showDialog: function(type) {
    this.dialogVisible = true;

    messageBus.postMessage('algo', 'PfContentMaskAndScrollTop');

    $('.js-dialog-container').show();
    $(".js-dialog").hide();

    if (type === 'print') {
      $(".js-dialog-print").show();
    } else {
      $(".js-dialog-pdf").show();
    }
  },

  hideDialog: function() {
    this.dialogVisible = false;

    messageBus.postMessage('algo', 'PfContentUnMask');

    $('.js-dialog-container').hide();
  }
};

var toolbar = {
  setup: function() {
    this.setupResizeImages();
    this.hideUIElements();
    this.setupClickToDelete();
    this.setupPrint();
    this.setupPdf();
    this.setupEmail();
    this.setupTextSize();
    this.setupUndo();
    this.setupDialogClose();
    this.setupCloseButton();
    this.setupHamburgerMenu();
  },
  setupHamburgerMenu: function() {
    $('#menu-w-undo').click(function() {
      $('#w-undo').trigger('click');
    });

    $('#menu-text-sm').click(function() {
      changeFontSize(-1);
    });

    $('#menu-text-lg').click(function() {
      changeFontSize(1);
    });

    function changeFontSize(step) {
      $textSize = $('#text-size');

      var curFontSize = parseInt($textSize.val().replace('pf-',''));
      var newFontSize = curFontSize + step;

      if(newFontSize >= 9 && newFontSize <= 15) {
        $textSize.val('pf-' + newFontSize).trigger('change');

        $('#menu-text-sm').prop('disabled', newFontSize == 9);
        $('#menu-text-lg').prop('disabled', newFontSize == 15);
      }
    }
  },
  printOnlySetup: function() {
    this.setupPrint();
    this.setupDialogClose();
    this.setupCloseButton();
  },
  setupClickToDelete: function() {
    var nonClickToDelElements;
    if(settings.disableClickToDel) {
      $('#w-undo').hide();
      $('#w-undo').removeClass("d-inline-flex flex-row");
      $('#menu-w-undo').hide();
    } else {
      if (pfData.config.usingBM) {
        nonClickToDelElements = settings.nonClickToDelElements;
      } else {
        nonClickToDelElements = settings.nonClickToDelElements +
                                ', ' +
                                settings.publisherNonClickToDelElements;
      }

      $(nonClickToDelElements, algoData.doc).
        addClass('non-delete').
        find('*').
        addClass('non-delete');

      $('#printfriendly', algoData.doc).on('mouseover mouseout', '*', function (e) {
        var nodeToDelete = commonUtils.getTopWrapper(e.target);
        if (!commonUtils.isDeletableElement(nodeToDelete)) { return; }

        e.stopPropagation();
        var $node = $(nodeToDelete);
        if(!$node.hasClass('non-delete')) {
          if(e.type == 'mouseover') {
            $node.addClass("pf-delete");
          } else {
            $node.removeClass("pf-delete");
            // Mouseover adds class 'highlight' to the element, while mouseout
            // remove that class. If the element does not have any class, then removing highlight
            // class must be followed by removal of class attribute.
            if ($node.attr('class') === "") { $node.removeAttr('class');}
          }
        }
      });
      $('#printfriendly', algoData.doc).on('click', '*', function (e) {
        e.preventDefault();
        var nodeToDelete = commonUtils.getTopWrapper(e.target);

        if (!commonUtils.isDeletableElement(nodeToDelete)) { return; }
        var deleteNodes = [nodeToDelete];

        e.stopPropagation();
        if (nodeToDelete.nextSibling && nodeToDelete.nextSibling.tagName === 'BR') {
          deleteNodes.push(nodeToDelete.nextSibling);
        }
        var $node = $(deleteNodes);
        if(!$node.hasClass('non-delete')) {
          core.deletedNodes.push($node);
          core.deletedNodesCss.push($node.css('display'));

          $node.hide();
        }

      });
    }
    $('body', algoData.doc).on('click', function(e) {
      e.preventDefault();
    });
  },
  setupPrint: function() {
    $('#w-print').on('click', function(e) {
      if (pfData.config.isExtension) {
        document.getElementById("cs-core-print-sandbox-iframe").contentWindow.postMessage(
          { type: 'PfPrintContent', payload: { body: algoWindow.document.body.innerHTML } },
          '*',
        );
      } else {
        OriginalPageFetch(function(originalResponse) {
          if (!ContentSecurityPolicy.isPrintAllowed(originalResponse)) {
            return toolbar.showError(
              '<b>This page has Content Security Policy rules preventing Print. If this is a public page, use <a href="' + pfRedirect(pfData.config.hosts.pf, pfData.userSettings, pfData.page.location.href) + '">printfriendly.com</a> to print this page.</b>'
            );
          }
          ui.showDialog('print');
          // Give some time for ads to load
          window.setTimeout(core.customPrint, 500);
        })
      }

      e.preventDefault();
    });

    $('#pf-dialog-print').on('click', function(e) {
      window.setTimeout(core.customPrint, 500);
    });

    $('body').on('click', '.re-send', function(e) {
      e.preventDefault();
      core.customPrint();
    });
  },
  showError: function(errorHtml) {
    $('#pf-dialog-frame').show();
    $('#pf-dialog-pdf').show();
    $("#pdf-iframe-container").html(errorHtml);
  },
  pdfWindow: null,
  submitPdfForm: function(iframeSrc) {
    var content = algoData.doc.body.innerHTML;
    var contentCss = toCdnUrl(pfData.config.urls.css.content);
    $("#pdf-iframe-container").html('');
    $('<iframe class="pdf-iframe" name="pdf_iframe" src="' + iframeSrc + '" allowtransparency="true" />').appendTo($("#pdf-iframe-container"));
    ui.showDialog('pdf');

    var title = $('h1#pf-title', algoData.doc).html();
    $("#pf-pdf-form input[name=title]").val(title);
    $("#pf-pdf-form input[name=code]").val(content);
    $("#pf-pdf-form input[name=dir]").val(pfData.page.dir);
    $("#pf-pdf-form input[name=hostname]").val(pfData.config.hosts.page);
    $("#pf-pdf-form input[name=url]").val(pfData.config.urls.page);
    $("#pf-pdf-form input[name=platform]").val(pfData.config.platform);
    $("#pf-pdf-form input[name=content_css_url]").val(contentCss);

    var ad_free = !!(pfData.dsData && pfData.dsData.domain_settings.ad_free);
    $("#pf-pdf-form input[name=cs_adfree]").val(ad_free);

    if($.trim(pfData.userSettings.customCSSURL) !== '') {
      $("#pf-pdf-form input[name=custom_css_url]").val($.trim(pfData.userSettings.customCSSURL));
    }

    setTimeout(function() { utils.checkFormSubmission(); }, utils.pdfSubmitCheckInterval);
    $("#pf-pdf-form").submit();
    frames.algo.focus();
  },
  setupPdf: function() {
    $('#w-pdf').on('click', function(e) {
      var largePageThreshold = 1048576; // 1mb
      if(contentData.content.length >= largePageThreshold && !utils.isPro()) {
        return toolbar.showError('<b>Sorry. This page is too big for conversion to PDF</b>');
      }

      if (pfData.config.isExtension) {
        toolbar.submitPdfForm('/print_sandbox_page.html');
      } else {
        OriginalPageFetch(function(originalResponse) {
          if(!ContentSecurityPolicy.isPdfAllowed(originalResponse)) {
            return toolbar.showError(
              '<b>This page has Content Security Policy rules preventing PDF downloads. If this is a public page, use <a href="' + pfRedirect(pfData.config.hosts.pf, pfData.userSettings, pfData.page.location.href) + '">printfriendly.com</a> to download PDF.</b>'
            );
          }

          toolbar.submitPdfForm(pfData.config.hosts.cdn + '/IEneeds/iframe_blank.html');
        });
      }

      e.preventDefault();
    });
  },

  setupEmail: function() {
    $('#w-email').on('click', function(e) {
      $('#pf-menu').removeClass("pf-menu-open");

      var title = $('h1#pf-title', algoData.doc).html();
      var screen = pfData.page.screen;
      var a = screen.x;
      var i = screen.y;
      var g = screen.width;
      var f = screen.height;

      var leftMargin = parseInt(a + ((g - 750) / 2), 10);
      var topMargin = parseInt(i + ((f - 480) / 2.5), 10);

      var attrs = 'chrome=yes,centerscreen=yes,width=750,height=480,top=' + topMargin + ',left=' + leftMargin;

      var emailWindow = window.open(pfData.config.urls.email, 'email', attrs);
      emailWindow.focus();

      try {
        var contentText = pfData.page.emailText;

        if (contentText === '') {
          var content = $('#pf-content', algoData.doc).clone();
          // content.text() returns hidden content normally.
          // so remove the hidden content
          content.find('*').filter(function() {
            return $(this).css('display') == 'none';
          }).remove();
          contentText = content.text();
        }

        var url = encodeURIComponent(pfData.config.urls.page);

        $("#pf-email-form input[name=title]").val(title);
        $("#pf-email-form input[name=url]").val(url);
        $("#pf-email-form input[name=content]").val(contentText);

        var ad_free = !!(pfData.dsData && pfData.dsData.domain_settings.ad_free);
        $("#pf-email-form input[name=cs_adfree]").val(ad_free);

        setTimeout(function() {
          // TODO: figure out why timeout fix empty email window (extension)
          $("#pf-email-form").submit();
        });
      } catch(ex) {
        emailWindow.location.href = pfData.config.urls.email + '?error=1';
        logger.error(ex);
      }

      e.preventDefault();
    });
  },
  setupTextSize: function() {
    $('#text-size').change(function(e) {
      var val = $(this).val();

      Cookies.set('printfriendly-font-class', val, { expires: 365, sameSite: 'None', secure: true });
      $('#printfriendly', algoData.doc).removeClass('pf-9 pf-10 pf-11 pf-12 pf-13 pf-14 pf-15').addClass(val);

      e.preventDefault();
    });
  },
  setupResizeImages: function() {
    if (pfData.userSettings.disableImages) {
      $('.pf-image-size').remove();
      core.hideImages(true)
      return;
    }
    $('#imagesize, #menu-imagesize').change(function() {
      var newSize = $(this).val();

      core.hideImages(newSize === 'remove-images');
      core.resizeImages(newSize);
    });

    $('#imagesize, #menu-imagesize').val(pfData.userSettings.imagesSize).change();
  },
  setupUndo: function() {
    $("#w-undo").on('click', function(e){
      if(core.deletedNodes.length > 0) {
        var nodeToRestore = core.deletedNodes.pop();
        nodeToRestore.show(); // NOTE: IE11 restore
        var displayValueToRestore = core.deletedNodesCss.pop();
        if (nodeToRestore[0].style.setProperty) {
          nodeToRestore[0].style.setProperty('display', displayValueToRestore);
        } else {
          nodeToRestore.css('display', displayValueToRestore);
        }
      }

      e.preventDefault();
    });
  },
  setupDialogClose: function() {
    $('#pf-d-close-wrap').on('click', function(e) {
      ui.hideDialog();
      e.preventDefault();
    });
  },
  setupCloseButton: function() {
    $('#pf-app-close').on('click', function(e) {
      core.restoreStyles();
      messageBus.postMessage('root', 'PfClosePreview');
      e.preventDefault();
    });
  },
  hideUIElements: function() {
    var us = pfData.userSettings;
    if(parseInt(us.disablePDF) === 1) {
      $('#w-pdf').hide();
      $('#w-pdf').removeClass("d-flex flex-sm-row flex-column");
    }
    if(parseInt(us.disableEmail) === 1) {
      $('#w-email').hide();
      $('#w-email').removeClass("d-flex flex-sm-row flex-column");
    }
    if(parseInt(us.disablePrint) === 1) {
      $('#w-print').hide();
      $('#w-print').removeClass("d-flex flex-sm-row flex-column");
    }
  }
};


var librato = {
  sendStats: function() {
    if (pfData.config.environment !== 'production' || pfData.onServer) {
      return;
    }

    events = [];

    if (pfData.config.pfstyle) {
      events.push('cs.pfstyle.' + pfData.config.pfstyle);
    }

    for (var prop in pfData.stats.page) {
      if (pfData.stats.page[prop]) {
        events.push('cs.page.' + prop);
      }
    }

    if (pfData.config.pfstyle === 'nbk' && BrowserDetect.browser) {
      events.push('cs.bm.browser.' + BrowserDetect.browser);
    }

    $.post(pfData.config.hosts.pf + '/stats', {events: events});
  },

  sendPDFResubmitStatus: function(status) {
    $.post(pfData.config.hosts.pf + '/stats', {events: [status]});
  }
};
