(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/dompurify/dist/purify.js
  var require_purify = __commonJS({
    "node_modules/dompurify/dist/purify.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.DOMPurify = factory());
      })(exports, function() {
        "use strict";
        const {
          entries,
          setPrototypeOf,
          isFrozen,
          getPrototypeOf,
          getOwnPropertyDescriptor
        } = Object;
        let {
          freeze,
          seal,
          create
        } = Object;
        let {
          apply,
          construct
        } = typeof Reflect !== "undefined" && Reflect;
        if (!apply) {
          apply = function apply2(fun, thisValue, args) {
            return fun.apply(thisValue, args);
          };
        }
        if (!freeze) {
          freeze = function freeze2(x) {
            return x;
          };
        }
        if (!seal) {
          seal = function seal2(x) {
            return x;
          };
        }
        if (!construct) {
          construct = function construct2(Func, args) {
            return new Func(...args);
          };
        }
        const arrayForEach = unapply(Array.prototype.forEach);
        const arrayPop = unapply(Array.prototype.pop);
        const arrayPush = unapply(Array.prototype.push);
        const stringToLowerCase = unapply(String.prototype.toLowerCase);
        const stringToString = unapply(String.prototype.toString);
        const stringMatch = unapply(String.prototype.match);
        const stringReplace = unapply(String.prototype.replace);
        const stringIndexOf = unapply(String.prototype.indexOf);
        const stringTrim = unapply(String.prototype.trim);
        const regExpTest = unapply(RegExp.prototype.test);
        const typeErrorCreate = unconstruct(TypeError);
        function unapply(func) {
          return function(thisArg) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return apply(func, thisArg, args);
          };
        }
        function unconstruct(func) {
          return function() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            return construct(func, args);
          };
        }
        function addToSet(set, array, transformCaseFunc) {
          var _transformCaseFunc;
          transformCaseFunc = (_transformCaseFunc = transformCaseFunc) !== null && _transformCaseFunc !== void 0 ? _transformCaseFunc : stringToLowerCase;
          if (setPrototypeOf) {
            setPrototypeOf(set, null);
          }
          let l = array.length;
          while (l--) {
            let element = array[l];
            if (typeof element === "string") {
              const lcElement = transformCaseFunc(element);
              if (lcElement !== element) {
                if (!isFrozen(array)) {
                  array[l] = lcElement;
                }
                element = lcElement;
              }
            }
            set[element] = true;
          }
          return set;
        }
        function clone(object) {
          const newObject = create(null);
          for (const [property, value] of entries(object)) {
            newObject[property] = value;
          }
          return newObject;
        }
        function lookupGetter(object, prop) {
          while (object !== null) {
            const desc = getOwnPropertyDescriptor(object, prop);
            if (desc) {
              if (desc.get) {
                return unapply(desc.get);
              }
              if (typeof desc.value === "function") {
                return unapply(desc.value);
              }
            }
            object = getPrototypeOf(object);
          }
          function fallbackValue(element) {
            console.warn("fallback value for", element);
            return null;
          }
          return fallbackValue;
        }
        const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
        const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
        const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
        const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
        const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
        const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
        const text = freeze(["#text"]);
        const html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"]);
        const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
        const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
        const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
        const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
        const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
        const TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
        const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
        const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
        const IS_ALLOWED_URI = seal(
          /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
          // eslint-disable-line no-useless-escape
        );
        const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
        const ATTR_WHITESPACE = seal(
          /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
          // eslint-disable-line no-control-regex
        );
        const DOCTYPE_NAME = seal(/^html$/i);
        var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          MUSTACHE_EXPR,
          ERB_EXPR,
          TMPLIT_EXPR,
          DATA_ATTR,
          ARIA_ATTR,
          IS_ALLOWED_URI,
          IS_SCRIPT_OR_DATA,
          ATTR_WHITESPACE,
          DOCTYPE_NAME
        });
        const getGlobal = () => typeof window === "undefined" ? null : window;
        const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
          if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
            return null;
          }
          let suffix = null;
          const ATTR_NAME = "data-tt-policy-suffix";
          if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
            suffix = purifyHostElement.getAttribute(ATTR_NAME);
          }
          const policyName = "dompurify" + (suffix ? "#" + suffix : "");
          try {
            return trustedTypes.createPolicy(policyName, {
              createHTML(html2) {
                return html2;
              },
              createScriptURL(scriptUrl) {
                return scriptUrl;
              }
            });
          } catch (_) {
            console.warn("TrustedTypes policy " + policyName + " could not be created.");
            return null;
          }
        };
        function createDOMPurify() {
          let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
          const DOMPurify2 = (root2) => createDOMPurify(root2);
          DOMPurify2.version = "3.0.4";
          DOMPurify2.removed = [];
          if (!window2 || !window2.document || window2.document.nodeType !== 9) {
            DOMPurify2.isSupported = false;
            return DOMPurify2;
          }
          const originalDocument = window2.document;
          const currentScript = originalDocument.currentScript;
          let {
            document: document2
          } = window2;
          const {
            DocumentFragment,
            HTMLTemplateElement,
            Node: Node3,
            Element,
            NodeFilter,
            NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
            HTMLFormElement,
            DOMParser,
            trustedTypes
          } = window2;
          const ElementPrototype = Element.prototype;
          const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
          const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
          const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
          const getParentNode = lookupGetter(ElementPrototype, "parentNode");
          if (typeof HTMLTemplateElement === "function") {
            const template = document2.createElement("template");
            if (template.content && template.content.ownerDocument) {
              document2 = template.content.ownerDocument;
            }
          }
          let trustedTypesPolicy;
          let emptyHTML = "";
          const {
            implementation,
            createNodeIterator,
            createDocumentFragment,
            getElementsByTagName
          } = document2;
          const {
            importNode
          } = originalDocument;
          let hooks = {};
          DOMPurify2.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
          const {
            MUSTACHE_EXPR: MUSTACHE_EXPR2,
            ERB_EXPR: ERB_EXPR2,
            TMPLIT_EXPR: TMPLIT_EXPR2,
            DATA_ATTR: DATA_ATTR2,
            ARIA_ATTR: ARIA_ATTR2,
            IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
            ATTR_WHITESPACE: ATTR_WHITESPACE2
          } = EXPRESSIONS;
          let {
            IS_ALLOWED_URI: IS_ALLOWED_URI$1
          } = EXPRESSIONS;
          let ALLOWED_TAGS = null;
          const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
          let ALLOWED_ATTR = null;
          const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
          let CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
            tagNameCheck: {
              writable: true,
              configurable: false,
              enumerable: true,
              value: null
            },
            attributeNameCheck: {
              writable: true,
              configurable: false,
              enumerable: true,
              value: null
            },
            allowCustomizedBuiltInElements: {
              writable: true,
              configurable: false,
              enumerable: true,
              value: false
            }
          }));
          let FORBID_TAGS = null;
          let FORBID_ATTR = null;
          let ALLOW_ARIA_ATTR = true;
          let ALLOW_DATA_ATTR = true;
          let ALLOW_UNKNOWN_PROTOCOLS = false;
          let ALLOW_SELF_CLOSE_IN_ATTR = true;
          let SAFE_FOR_TEMPLATES = false;
          let WHOLE_DOCUMENT = false;
          let SET_CONFIG = false;
          let FORCE_BODY = false;
          let RETURN_DOM = false;
          let RETURN_DOM_FRAGMENT = false;
          let RETURN_TRUSTED_TYPE = false;
          let SANITIZE_DOM = true;
          let SANITIZE_NAMED_PROPS = false;
          const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
          let KEEP_CONTENT = true;
          let IN_PLACE = false;
          let USE_PROFILES = {};
          let FORBID_CONTENTS = null;
          const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
          let DATA_URI_TAGS = null;
          const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
          let URI_SAFE_ATTRIBUTES = null;
          const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
          const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
          const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
          const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
          let NAMESPACE = HTML_NAMESPACE;
          let IS_EMPTY_INPUT = false;
          let ALLOWED_NAMESPACES = null;
          const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
          let PARSER_MEDIA_TYPE;
          const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
          const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
          let transformCaseFunc;
          let CONFIG = null;
          const formElement = document2.createElement("form");
          const isRegexOrFunction = function isRegexOrFunction2(testValue) {
            return testValue instanceof RegExp || testValue instanceof Function;
          };
          const _parseConfig = function _parseConfig2(cfg) {
            if (CONFIG && CONFIG === cfg) {
              return;
            }
            if (!cfg || typeof cfg !== "object") {
              cfg = {};
            }
            cfg = clone(cfg);
            PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
            SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE;
            transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
            ALLOWED_TAGS = "ALLOWED_TAGS" in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
            ALLOWED_ATTR = "ALLOWED_ATTR" in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
            ALLOWED_NAMESPACES = "ALLOWED_NAMESPACES" in cfg ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
            URI_SAFE_ATTRIBUTES = "ADD_URI_SAFE_ATTR" in cfg ? addToSet(
              clone(DEFAULT_URI_SAFE_ATTRIBUTES),
              // eslint-disable-line indent
              cfg.ADD_URI_SAFE_ATTR,
              // eslint-disable-line indent
              transformCaseFunc
              // eslint-disable-line indent
            ) : DEFAULT_URI_SAFE_ATTRIBUTES;
            DATA_URI_TAGS = "ADD_DATA_URI_TAGS" in cfg ? addToSet(
              clone(DEFAULT_DATA_URI_TAGS),
              // eslint-disable-line indent
              cfg.ADD_DATA_URI_TAGS,
              // eslint-disable-line indent
              transformCaseFunc
              // eslint-disable-line indent
            ) : DEFAULT_DATA_URI_TAGS;
            FORBID_CONTENTS = "FORBID_CONTENTS" in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
            FORBID_TAGS = "FORBID_TAGS" in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
            FORBID_ATTR = "FORBID_ATTR" in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
            USE_PROFILES = "USE_PROFILES" in cfg ? cfg.USE_PROFILES : false;
            ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
            ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
            ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
            ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
            SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
            WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
            RETURN_DOM = cfg.RETURN_DOM || false;
            RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
            RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
            FORCE_BODY = cfg.FORCE_BODY || false;
            SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
            SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
            KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
            IN_PLACE = cfg.IN_PLACE || false;
            IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
            NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
            CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
            if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
              CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
            }
            if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
              CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
            }
            if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
              CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
            }
            if (SAFE_FOR_TEMPLATES) {
              ALLOW_DATA_ATTR = false;
            }
            if (RETURN_DOM_FRAGMENT) {
              RETURN_DOM = true;
            }
            if (USE_PROFILES) {
              ALLOWED_TAGS = addToSet({}, [...text]);
              ALLOWED_ATTR = [];
              if (USE_PROFILES.html === true) {
                addToSet(ALLOWED_TAGS, html$1);
                addToSet(ALLOWED_ATTR, html);
              }
              if (USE_PROFILES.svg === true) {
                addToSet(ALLOWED_TAGS, svg$1);
                addToSet(ALLOWED_ATTR, svg);
                addToSet(ALLOWED_ATTR, xml);
              }
              if (USE_PROFILES.svgFilters === true) {
                addToSet(ALLOWED_TAGS, svgFilters);
                addToSet(ALLOWED_ATTR, svg);
                addToSet(ALLOWED_ATTR, xml);
              }
              if (USE_PROFILES.mathMl === true) {
                addToSet(ALLOWED_TAGS, mathMl$1);
                addToSet(ALLOWED_ATTR, mathMl);
                addToSet(ALLOWED_ATTR, xml);
              }
            }
            if (cfg.ADD_TAGS) {
              if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
                ALLOWED_TAGS = clone(ALLOWED_TAGS);
              }
              addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
            }
            if (cfg.ADD_ATTR) {
              if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
                ALLOWED_ATTR = clone(ALLOWED_ATTR);
              }
              addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
            }
            if (cfg.ADD_URI_SAFE_ATTR) {
              addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
            }
            if (cfg.FORBID_CONTENTS) {
              if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
                FORBID_CONTENTS = clone(FORBID_CONTENTS);
              }
              addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
            }
            if (KEEP_CONTENT) {
              ALLOWED_TAGS["#text"] = true;
            }
            if (WHOLE_DOCUMENT) {
              addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
            }
            if (ALLOWED_TAGS.table) {
              addToSet(ALLOWED_TAGS, ["tbody"]);
              delete FORBID_TAGS.tbody;
            }
            if (cfg.TRUSTED_TYPES_POLICY) {
              if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
                throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
              }
              if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
                throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
              }
              trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
              emptyHTML = trustedTypesPolicy.createHTML("");
            } else {
              if (trustedTypesPolicy === void 0) {
                trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
              }
              if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
                emptyHTML = trustedTypesPolicy.createHTML("");
              }
            }
            if (freeze) {
              freeze(cfg);
            }
            CONFIG = cfg;
          };
          const MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
          const HTML_INTEGRATION_POINTS = addToSet({}, ["foreignobject", "desc", "title", "annotation-xml"]);
          const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
          const ALL_SVG_TAGS = addToSet({}, svg$1);
          addToSet(ALL_SVG_TAGS, svgFilters);
          addToSet(ALL_SVG_TAGS, svgDisallowed);
          const ALL_MATHML_TAGS = addToSet({}, mathMl$1);
          addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
          const _checkValidNamespace = function _checkValidNamespace2(element) {
            let parent = getParentNode(element);
            if (!parent || !parent.tagName) {
              parent = {
                namespaceURI: NAMESPACE,
                tagName: "template"
              };
            }
            const tagName = stringToLowerCase(element.tagName);
            const parentTagName = stringToLowerCase(parent.tagName);
            if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
              return false;
            }
            if (element.namespaceURI === SVG_NAMESPACE) {
              if (parent.namespaceURI === HTML_NAMESPACE) {
                return tagName === "svg";
              }
              if (parent.namespaceURI === MATHML_NAMESPACE) {
                return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
              }
              return Boolean(ALL_SVG_TAGS[tagName]);
            }
            if (element.namespaceURI === MATHML_NAMESPACE) {
              if (parent.namespaceURI === HTML_NAMESPACE) {
                return tagName === "math";
              }
              if (parent.namespaceURI === SVG_NAMESPACE) {
                return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
              }
              return Boolean(ALL_MATHML_TAGS[tagName]);
            }
            if (element.namespaceURI === HTML_NAMESPACE) {
              if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
                return false;
              }
              if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
                return false;
              }
              return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
            }
            if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
              return true;
            }
            return false;
          };
          const _forceRemove = function _forceRemove2(node) {
            arrayPush(DOMPurify2.removed, {
              element: node
            });
            try {
              node.parentNode.removeChild(node);
            } catch (_) {
              node.remove();
            }
          };
          const _removeAttribute = function _removeAttribute2(name, node) {
            try {
              arrayPush(DOMPurify2.removed, {
                attribute: node.getAttributeNode(name),
                from: node
              });
            } catch (_) {
              arrayPush(DOMPurify2.removed, {
                attribute: null,
                from: node
              });
            }
            node.removeAttribute(name);
            if (name === "is" && !ALLOWED_ATTR[name]) {
              if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
                try {
                  _forceRemove(node);
                } catch (_) {
                }
              } else {
                try {
                  node.setAttribute(name, "");
                } catch (_) {
                }
              }
            }
          };
          const _initDocument = function _initDocument2(dirty) {
            let doc;
            let leadingWhitespace;
            if (FORCE_BODY) {
              dirty = "<remove></remove>" + dirty;
            } else {
              const matches = stringMatch(dirty, /^[\r\n\t ]+/);
              leadingWhitespace = matches && matches[0];
            }
            if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
              dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
            }
            const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
            if (NAMESPACE === HTML_NAMESPACE) {
              try {
                doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
              } catch (_) {
              }
            }
            if (!doc || !doc.documentElement) {
              doc = implementation.createDocument(NAMESPACE, "template", null);
              try {
                doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
              } catch (_) {
              }
            }
            const body = doc.body || doc.documentElement;
            if (dirty && leadingWhitespace) {
              body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
            }
            if (NAMESPACE === HTML_NAMESPACE) {
              return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
            }
            return WHOLE_DOCUMENT ? doc.documentElement : body;
          };
          const _createIterator = function _createIterator2(root2) {
            return createNodeIterator.call(
              root2.ownerDocument || root2,
              root2,
              // eslint-disable-next-line no-bitwise
              NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT,
              null,
              false
            );
          };
          const _isClobbered = function _isClobbered2(elm) {
            return elm instanceof HTMLFormElement && (typeof elm.nodeName !== "string" || typeof elm.textContent !== "string" || typeof elm.removeChild !== "function" || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== "function" || typeof elm.setAttribute !== "function" || typeof elm.namespaceURI !== "string" || typeof elm.insertBefore !== "function" || typeof elm.hasChildNodes !== "function");
          };
          const _isNode = function _isNode2(object) {
            return typeof Node3 === "object" ? object instanceof Node3 : object && typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
          };
          const _executeHook = function _executeHook2(entryPoint, currentNode, data) {
            if (!hooks[entryPoint]) {
              return;
            }
            arrayForEach(hooks[entryPoint], (hook) => {
              hook.call(DOMPurify2, currentNode, data, CONFIG);
            });
          };
          const _sanitizeElements = function _sanitizeElements2(currentNode) {
            let content;
            _executeHook("beforeSanitizeElements", currentNode, null);
            if (_isClobbered(currentNode)) {
              _forceRemove(currentNode);
              return true;
            }
            const tagName = transformCaseFunc(currentNode.nodeName);
            _executeHook("uponSanitizeElement", currentNode, {
              tagName,
              allowedTags: ALLOWED_TAGS
            });
            if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
              _forceRemove(currentNode);
              return true;
            }
            if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
              if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
                if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName))
                  return false;
                if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName))
                  return false;
              }
              if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
                const parentNode = getParentNode(currentNode) || currentNode.parentNode;
                const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
                if (childNodes && parentNode) {
                  const childCount = childNodes.length;
                  for (let i = childCount - 1; i >= 0; --i) {
                    parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
                  }
                }
              }
              _forceRemove(currentNode);
              return true;
            }
            if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
              _forceRemove(currentNode);
              return true;
            }
            if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
              _forceRemove(currentNode);
              return true;
            }
            if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
              content = currentNode.textContent;
              content = stringReplace(content, MUSTACHE_EXPR2, " ");
              content = stringReplace(content, ERB_EXPR2, " ");
              content = stringReplace(content, TMPLIT_EXPR2, " ");
              if (currentNode.textContent !== content) {
                arrayPush(DOMPurify2.removed, {
                  element: currentNode.cloneNode()
                });
                currentNode.textContent = content;
              }
            }
            _executeHook("afterSanitizeElements", currentNode, null);
            return false;
          };
          const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
            if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
              return false;
            }
            if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName))
              ;
            else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName))
              ;
            else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
              if (
                // First condition does a very basic check if a) it's basically a valid custom element tagname AND
                // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
                // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
                _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
                // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
                lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
              )
                ;
              else {
                return false;
              }
            } else if (URI_SAFE_ATTRIBUTES[lcName])
              ;
            else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, "")))
              ;
            else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag])
              ;
            else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, "")))
              ;
            else if (value) {
              return false;
            } else
              ;
            return true;
          };
          const _basicCustomElementTest = function _basicCustomElementTest2(tagName) {
            return tagName.indexOf("-") > 0;
          };
          const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
            let attr;
            let value;
            let lcName;
            let l;
            _executeHook("beforeSanitizeAttributes", currentNode, null);
            const {
              attributes
            } = currentNode;
            if (!attributes) {
              return;
            }
            const hookEvent = {
              attrName: "",
              attrValue: "",
              keepAttr: true,
              allowedAttributes: ALLOWED_ATTR
            };
            l = attributes.length;
            while (l--) {
              attr = attributes[l];
              const {
                name,
                namespaceURI
              } = attr;
              value = name === "value" ? attr.value : stringTrim(attr.value);
              lcName = transformCaseFunc(name);
              hookEvent.attrName = lcName;
              hookEvent.attrValue = value;
              hookEvent.keepAttr = true;
              hookEvent.forceKeepAttr = void 0;
              _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
              value = hookEvent.attrValue;
              if (hookEvent.forceKeepAttr) {
                continue;
              }
              _removeAttribute(name, currentNode);
              if (!hookEvent.keepAttr) {
                continue;
              }
              if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
                _removeAttribute(name, currentNode);
                continue;
              }
              if (SAFE_FOR_TEMPLATES) {
                value = stringReplace(value, MUSTACHE_EXPR2, " ");
                value = stringReplace(value, ERB_EXPR2, " ");
                value = stringReplace(value, TMPLIT_EXPR2, " ");
              }
              const lcTag = transformCaseFunc(currentNode.nodeName);
              if (!_isValidAttribute(lcTag, lcName, value)) {
                continue;
              }
              if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
                _removeAttribute(name, currentNode);
                value = SANITIZE_NAMED_PROPS_PREFIX + value;
              }
              if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
                if (namespaceURI)
                  ;
                else {
                  switch (trustedTypes.getAttributeType(lcTag, lcName)) {
                    case "TrustedHTML": {
                      value = trustedTypesPolicy.createHTML(value);
                      break;
                    }
                    case "TrustedScriptURL": {
                      value = trustedTypesPolicy.createScriptURL(value);
                      break;
                    }
                  }
                }
              }
              try {
                if (namespaceURI) {
                  currentNode.setAttributeNS(namespaceURI, name, value);
                } else {
                  currentNode.setAttribute(name, value);
                }
                arrayPop(DOMPurify2.removed);
              } catch (_) {
              }
            }
            _executeHook("afterSanitizeAttributes", currentNode, null);
          };
          const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
            let shadowNode;
            const shadowIterator = _createIterator(fragment);
            _executeHook("beforeSanitizeShadowDOM", fragment, null);
            while (shadowNode = shadowIterator.nextNode()) {
              _executeHook("uponSanitizeShadowNode", shadowNode, null);
              if (_sanitizeElements(shadowNode)) {
                continue;
              }
              if (shadowNode.content instanceof DocumentFragment) {
                _sanitizeShadowDOM2(shadowNode.content);
              }
              _sanitizeAttributes(shadowNode);
            }
            _executeHook("afterSanitizeShadowDOM", fragment, null);
          };
          DOMPurify2.sanitize = function(dirty) {
            let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            let body;
            let importedNode;
            let currentNode;
            let returnNode;
            IS_EMPTY_INPUT = !dirty;
            if (IS_EMPTY_INPUT) {
              dirty = "<!-->";
            }
            if (typeof dirty !== "string" && !_isNode(dirty)) {
              if (typeof dirty.toString === "function") {
                dirty = dirty.toString();
                if (typeof dirty !== "string") {
                  throw typeErrorCreate("dirty is not a string, aborting");
                }
              } else {
                throw typeErrorCreate("toString is not a function");
              }
            }
            if (!DOMPurify2.isSupported) {
              return dirty;
            }
            if (!SET_CONFIG) {
              _parseConfig(cfg);
            }
            DOMPurify2.removed = [];
            if (typeof dirty === "string") {
              IN_PLACE = false;
            }
            if (IN_PLACE) {
              if (dirty.nodeName) {
                const tagName = transformCaseFunc(dirty.nodeName);
                if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                  throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
                }
              }
            } else if (dirty instanceof Node3) {
              body = _initDocument("<!---->");
              importedNode = body.ownerDocument.importNode(dirty, true);
              if (importedNode.nodeType === 1 && importedNode.nodeName === "BODY") {
                body = importedNode;
              } else if (importedNode.nodeName === "HTML") {
                body = importedNode;
              } else {
                body.appendChild(importedNode);
              }
            } else {
              if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
              dirty.indexOf("<") === -1) {
                return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
              }
              body = _initDocument(dirty);
              if (!body) {
                return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
              }
            }
            if (body && FORCE_BODY) {
              _forceRemove(body.firstChild);
            }
            const nodeIterator = _createIterator(IN_PLACE ? dirty : body);
            while (currentNode = nodeIterator.nextNode()) {
              if (_sanitizeElements(currentNode)) {
                continue;
              }
              if (currentNode.content instanceof DocumentFragment) {
                _sanitizeShadowDOM(currentNode.content);
              }
              _sanitizeAttributes(currentNode);
            }
            if (IN_PLACE) {
              return dirty;
            }
            if (RETURN_DOM) {
              if (RETURN_DOM_FRAGMENT) {
                returnNode = createDocumentFragment.call(body.ownerDocument);
                while (body.firstChild) {
                  returnNode.appendChild(body.firstChild);
                }
              } else {
                returnNode = body;
              }
              if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
                returnNode = importNode.call(originalDocument, returnNode, true);
              }
              return returnNode;
            }
            let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
            if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
              serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
            }
            if (SAFE_FOR_TEMPLATES) {
              serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR2, " ");
              serializedHTML = stringReplace(serializedHTML, ERB_EXPR2, " ");
              serializedHTML = stringReplace(serializedHTML, TMPLIT_EXPR2, " ");
            }
            return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
          };
          DOMPurify2.setConfig = function(cfg) {
            _parseConfig(cfg);
            SET_CONFIG = true;
          };
          DOMPurify2.clearConfig = function() {
            CONFIG = null;
            SET_CONFIG = false;
          };
          DOMPurify2.isValidAttribute = function(tag, attr, value) {
            if (!CONFIG) {
              _parseConfig({});
            }
            const lcTag = transformCaseFunc(tag);
            const lcName = transformCaseFunc(attr);
            return _isValidAttribute(lcTag, lcName, value);
          };
          DOMPurify2.addHook = function(entryPoint, hookFunction) {
            if (typeof hookFunction !== "function") {
              return;
            }
            hooks[entryPoint] = hooks[entryPoint] || [];
            arrayPush(hooks[entryPoint], hookFunction);
          };
          DOMPurify2.removeHook = function(entryPoint) {
            if (hooks[entryPoint]) {
              return arrayPop(hooks[entryPoint]);
            }
          };
          DOMPurify2.removeHooks = function(entryPoint) {
            if (hooks[entryPoint]) {
              hooks[entryPoint] = [];
            }
          };
          DOMPurify2.removeAllHooks = function() {
            hooks = {};
          };
          return DOMPurify2;
        }
        var purify = createDOMPurify();
        return purify;
      });
    }
  });

  // src/activeTab/utils/webpage/getters.js
  function getUrl() {
    return window.location.href;
  }
  function getHostAndPath() {
    return window.location.host + window.location.pathname;
  }

  // src/activeTab/scraper/checker/domainChecker.js
  async function domainChecker() {
    const domains = {
      "PhindSearch": "www.phind.com/search",
      "PhindAgent": "www.phind.com/agent"
    };
    const hostAndPath = getHostAndPath();
    for (let domainName in domains) {
      const url = domains[domainName];
      if (hostAndPath.startsWith(url)) {
        return { name: domainName, url };
      }
    }
    return null;
  }
  function isHomepageCheck() {
    return window.location.href === "https://www.phind.com" || window.location.href === "https://www.phind.com/";
  }

  // src/common/appInfos.js
  var appInfos = null;
  fetchInfos().then((res) => appInfos = res);
  async function fetchInfos() {
    try {
      const response = await fetch(chrome.runtime.getURL("infos.json"));
      return await response.json();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  function getAppInfos() {
    return new Promise((resolve, reject) => {
      function check() {
        if (appInfos !== null) {
          resolve(appInfos);
        } else {
          setTimeout(check, 1);
        }
      }
      check();
    });
  }

  // src/activeTab/utils/consoleMessages.js
  async function logWelcome() {
    const appInfos2 = await getAppInfos();
    console.log("Tab export with " + appInfos2.APP_SNAME + " v" + appInfos2.APP_VERSION);
  }
  async function logWaitList() {
    const appInfos2 = await getAppInfos();
    console.log(appInfos2.APP_SNAME + ": Waiting for list");
  }

  // src/activeTab/utils/format/formatText.js
  function formatLineBreaks(html, regex) {
    const match = html.match(regex);
    if (match) {
      const lines = match[1].split("\n");
      return lines.map((line) => {
        const spaces = line.match(/^\s*/)[0];
        return (spaces.length > 0 ? "<br>" + "\xA0".repeat(spaces.length) : "<br>") + line.trim();
      }).join("");
    }
    return html;
  }
  function formatDate(format = 0, date = /* @__PURE__ */ new Date()) {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let hh = date.getHours();
    let mn = date.getMinutes();
    let ss = date.getSeconds();
    if (mm < 10)
      mm = "0" + mm;
    if (dd < 10)
      dd = "0" + dd;
    if (hh < 10)
      hh = "0" + hh;
    if (mn < 10)
      mn = "0" + mn;
    if (ss < 10)
      ss = "0" + ss;
    let res;
    switch (format) {
      case 1:
        res = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + mn + ":" + ss;
        break;
      case 2:
        res = dd + "/" + mm + "/" + yyyy;
        break;
      case 0:
        res = yyyy + "-" + mm + "-" + dd + "_" + hh + "-" + mn + "-" + ss;
        break;
    }
    return res;
  }
  function titleShortener(title, titleLength = 100) {
    if (!title)
      return ["", ""];
    title = title.replaceAll("\n", " \n ");
    const words = title.split(" ");
    let res = ["", ""];
    let next2;
    for (let i = 0; i < words.length; i++) {
      if ((res[0] + words[i]).length > titleLength || words[i].match(/\n/g)) {
        res[0] += res[0] === "" ? title.substring(0, titleLength) : "";
        next2 = i;
        break;
      }
      res[0] += (i !== 0 ? " " : "") + words[i];
    }
    for (let i = next2; i < words.length; i++) {
      if (i === next2) {
        res[0] += "...";
        res[1] += "...";
      }
      if (next2 === 0) {
        res[1] += title.substring(titleLength);
        break;
      }
      res[1] += words[i] + " ";
    }
    return res;
  }
  function formatFilename(title, siteName) {
    const filename = titleShortener(formatDate() + "_" + siteName + "_" + title)[0].replace(/[\n\/:*?"<>|]/g, "");
    return filename.match(/\.{3}$/g) ? filename.replace(/\s*\.{3}$/, "...") : filename.replace(/\s*$/, "");
  }
  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // node_modules/turndown/lib/turndown.browser.es.js
  function extend(destination) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (source.hasOwnProperty(key))
          destination[key] = source[key];
      }
    }
    return destination;
  }
  function repeat(character, count) {
    return Array(count + 1).join(character);
  }
  function trimLeadingNewlines(string) {
    return string.replace(/^\n*/, "");
  }
  function trimTrailingNewlines(string) {
    var indexEnd = string.length;
    while (indexEnd > 0 && string[indexEnd - 1] === "\n")
      indexEnd--;
    return string.substring(0, indexEnd);
  }
  var blockElements = [
    "ADDRESS",
    "ARTICLE",
    "ASIDE",
    "AUDIO",
    "BLOCKQUOTE",
    "BODY",
    "CANVAS",
    "CENTER",
    "DD",
    "DIR",
    "DIV",
    "DL",
    "DT",
    "FIELDSET",
    "FIGCAPTION",
    "FIGURE",
    "FOOTER",
    "FORM",
    "FRAMESET",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HEADER",
    "HGROUP",
    "HR",
    "HTML",
    "ISINDEX",
    "LI",
    "MAIN",
    "MENU",
    "NAV",
    "NOFRAMES",
    "NOSCRIPT",
    "OL",
    "OUTPUT",
    "P",
    "PRE",
    "SECTION",
    "TABLE",
    "TBODY",
    "TD",
    "TFOOT",
    "TH",
    "THEAD",
    "TR",
    "UL"
  ];
  function isBlock(node) {
    return is(node, blockElements);
  }
  var voidElements = [
    "AREA",
    "BASE",
    "BR",
    "COL",
    "COMMAND",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "KEYGEN",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ];
  function isVoid(node) {
    return is(node, voidElements);
  }
  function hasVoid(node) {
    return has(node, voidElements);
  }
  var meaningfulWhenBlankElements = [
    "A",
    "TABLE",
    "THEAD",
    "TBODY",
    "TFOOT",
    "TH",
    "TD",
    "IFRAME",
    "SCRIPT",
    "AUDIO",
    "VIDEO"
  ];
  function isMeaningfulWhenBlank(node) {
    return is(node, meaningfulWhenBlankElements);
  }
  function hasMeaningfulWhenBlank(node) {
    return has(node, meaningfulWhenBlankElements);
  }
  function is(node, tagNames) {
    return tagNames.indexOf(node.nodeName) >= 0;
  }
  function has(node, tagNames) {
    return node.getElementsByTagName && tagNames.some(function(tagName) {
      return node.getElementsByTagName(tagName).length;
    });
  }
  var rules = {};
  rules.paragraph = {
    filter: "p",
    replacement: function(content) {
      return "\n\n" + content + "\n\n";
    }
  };
  rules.lineBreak = {
    filter: "br",
    replacement: function(content, node, options) {
      return options.br + "\n";
    }
  };
  rules.heading = {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function(content, node, options) {
      var hLevel = Number(node.nodeName.charAt(1));
      if (options.headingStyle === "setext" && hLevel < 3) {
        var underline = repeat(hLevel === 1 ? "=" : "-", content.length);
        return "\n\n" + content + "\n" + underline + "\n\n";
      } else {
        return "\n\n" + repeat("#", hLevel) + " " + content + "\n\n";
      }
    }
  };
  rules.blockquote = {
    filter: "blockquote",
    replacement: function(content) {
      content = content.replace(/^\n+|\n+$/g, "");
      content = content.replace(/^/gm, "> ");
      return "\n\n" + content + "\n\n";
    }
  };
  rules.list = {
    filter: ["ul", "ol"],
    replacement: function(content, node) {
      var parent = node.parentNode;
      if (parent.nodeName === "LI" && parent.lastElementChild === node) {
        return "\n" + content;
      } else {
        return "\n\n" + content + "\n\n";
      }
    }
  };
  rules.listItem = {
    filter: "li",
    replacement: function(content, node, options) {
      content = content.replace(/^\n+/, "").replace(/\n+$/, "\n").replace(/\n/gm, "\n    ");
      var prefix = options.bulletListMarker + "   ";
      var parent = node.parentNode;
      if (parent.nodeName === "OL") {
        var start = parent.getAttribute("start");
        var index = Array.prototype.indexOf.call(parent.children, node);
        prefix = (start ? Number(start) + index : index + 1) + ".  ";
      }
      return prefix + content + (node.nextSibling && !/\n$/.test(content) ? "\n" : "");
    }
  };
  rules.indentedCodeBlock = {
    filter: function(node, options) {
      return options.codeBlockStyle === "indented" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node, options) {
      return "\n\n    " + node.firstChild.textContent.replace(/\n/g, "\n    ") + "\n\n";
    }
  };
  rules.fencedCodeBlock = {
    filter: function(node, options) {
      return options.codeBlockStyle === "fenced" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node, options) {
      var className = node.firstChild.getAttribute("class") || "";
      var language = (className.match(/language-(\S+)/) || [null, ""])[1];
      var code = node.firstChild.textContent;
      var fenceChar = options.fence.charAt(0);
      var fenceSize = 3;
      var fenceInCodeRegex = new RegExp("^" + fenceChar + "{3,}", "gm");
      var match;
      while (match = fenceInCodeRegex.exec(code)) {
        if (match[0].length >= fenceSize) {
          fenceSize = match[0].length + 1;
        }
      }
      var fence = repeat(fenceChar, fenceSize);
      return "\n\n" + fence + language + "\n" + code.replace(/\n$/, "") + "\n" + fence + "\n\n";
    }
  };
  rules.horizontalRule = {
    filter: "hr",
    replacement: function(content, node, options) {
      return "\n\n" + options.hr + "\n\n";
    }
  };
  rules.inlineLink = {
    filter: function(node, options) {
      return options.linkStyle === "inlined" && node.nodeName === "A" && node.getAttribute("href");
    },
    replacement: function(content, node) {
      var href = node.getAttribute("href");
      var title = cleanAttribute(node.getAttribute("title"));
      if (title)
        title = ' "' + title + '"';
      return "[" + content + "](" + href + title + ")";
    }
  };
  rules.referenceLink = {
    filter: function(node, options) {
      return options.linkStyle === "referenced" && node.nodeName === "A" && node.getAttribute("href");
    },
    replacement: function(content, node, options) {
      var href = node.getAttribute("href");
      var title = cleanAttribute(node.getAttribute("title"));
      if (title)
        title = ' "' + title + '"';
      var replacement;
      var reference;
      switch (options.linkReferenceStyle) {
        case "collapsed":
          replacement = "[" + content + "][]";
          reference = "[" + content + "]: " + href + title;
          break;
        case "shortcut":
          replacement = "[" + content + "]";
          reference = "[" + content + "]: " + href + title;
          break;
        default:
          var id = this.references.length + 1;
          replacement = "[" + content + "][" + id + "]";
          reference = "[" + id + "]: " + href + title;
      }
      this.references.push(reference);
      return replacement;
    },
    references: [],
    append: function(options) {
      var references = "";
      if (this.references.length) {
        references = "\n\n" + this.references.join("\n") + "\n\n";
        this.references = [];
      }
      return references;
    }
  };
  rules.emphasis = {
    filter: ["em", "i"],
    replacement: function(content, node, options) {
      if (!content.trim())
        return "";
      return options.emDelimiter + content + options.emDelimiter;
    }
  };
  rules.strong = {
    filter: ["strong", "b"],
    replacement: function(content, node, options) {
      if (!content.trim())
        return "";
      return options.strongDelimiter + content + options.strongDelimiter;
    }
  };
  rules.code = {
    filter: function(node) {
      var hasSiblings = node.previousSibling || node.nextSibling;
      var isCodeBlock = node.parentNode.nodeName === "PRE" && !hasSiblings;
      return node.nodeName === "CODE" && !isCodeBlock;
    },
    replacement: function(content) {
      if (!content)
        return "";
      content = content.replace(/\r?\n|\r/g, " ");
      var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
      var delimiter = "`";
      var matches = content.match(/`+/gm) || [];
      while (matches.indexOf(delimiter) !== -1)
        delimiter = delimiter + "`";
      return delimiter + extraSpace + content + extraSpace + delimiter;
    }
  };
  rules.image = {
    filter: "img",
    replacement: function(content, node) {
      var alt = cleanAttribute(node.getAttribute("alt"));
      var src = node.getAttribute("src") || "";
      var title = cleanAttribute(node.getAttribute("title"));
      var titlePart = title ? ' "' + title + '"' : "";
      return src ? "![" + alt + "](" + src + titlePart + ")" : "";
    }
  };
  function cleanAttribute(attribute) {
    return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
  }
  function Rules(options) {
    this.options = options;
    this._keep = [];
    this._remove = [];
    this.blankRule = {
      replacement: options.blankReplacement
    };
    this.keepReplacement = options.keepReplacement;
    this.defaultRule = {
      replacement: options.defaultReplacement
    };
    this.array = [];
    for (var key in options.rules)
      this.array.push(options.rules[key]);
  }
  Rules.prototype = {
    add: function(key, rule) {
      this.array.unshift(rule);
    },
    keep: function(filter) {
      this._keep.unshift({
        filter,
        replacement: this.keepReplacement
      });
    },
    remove: function(filter) {
      this._remove.unshift({
        filter,
        replacement: function() {
          return "";
        }
      });
    },
    forNode: function(node) {
      if (node.isBlank)
        return this.blankRule;
      var rule;
      if (rule = findRule(this.array, node, this.options))
        return rule;
      if (rule = findRule(this._keep, node, this.options))
        return rule;
      if (rule = findRule(this._remove, node, this.options))
        return rule;
      return this.defaultRule;
    },
    forEach: function(fn) {
      for (var i = 0; i < this.array.length; i++)
        fn(this.array[i], i);
    }
  };
  function findRule(rules2, node, options) {
    for (var i = 0; i < rules2.length; i++) {
      var rule = rules2[i];
      if (filterValue(rule, node, options))
        return rule;
    }
    return void 0;
  }
  function filterValue(rule, node, options) {
    var filter = rule.filter;
    if (typeof filter === "string") {
      if (filter === node.nodeName.toLowerCase())
        return true;
    } else if (Array.isArray(filter)) {
      if (filter.indexOf(node.nodeName.toLowerCase()) > -1)
        return true;
    } else if (typeof filter === "function") {
      if (filter.call(rule, node, options))
        return true;
    } else {
      throw new TypeError("`filter` needs to be a string, array, or function");
    }
  }
  function collapseWhitespace(options) {
    var element = options.element;
    var isBlock2 = options.isBlock;
    var isVoid2 = options.isVoid;
    var isPre = options.isPre || function(node2) {
      return node2.nodeName === "PRE";
    };
    if (!element.firstChild || isPre(element))
      return;
    var prevText = null;
    var keepLeadingWs = false;
    var prev = null;
    var node = next(prev, element, isPre);
    while (node !== element) {
      if (node.nodeType === 3 || node.nodeType === 4) {
        var text = node.data.replace(/[ \r\n\t]+/g, " ");
        if ((!prevText || / $/.test(prevText.data)) && !keepLeadingWs && text[0] === " ") {
          text = text.substr(1);
        }
        if (!text) {
          node = remove(node);
          continue;
        }
        node.data = text;
        prevText = node;
      } else if (node.nodeType === 1) {
        if (isBlock2(node) || node.nodeName === "BR") {
          if (prevText) {
            prevText.data = prevText.data.replace(/ $/, "");
          }
          prevText = null;
          keepLeadingWs = false;
        } else if (isVoid2(node) || isPre(node)) {
          prevText = null;
          keepLeadingWs = true;
        } else if (prevText) {
          keepLeadingWs = false;
        }
      } else {
        node = remove(node);
        continue;
      }
      var nextNode = next(prev, node, isPre);
      prev = node;
      node = nextNode;
    }
    if (prevText) {
      prevText.data = prevText.data.replace(/ $/, "");
      if (!prevText.data) {
        remove(prevText);
      }
    }
  }
  function remove(node) {
    var next2 = node.nextSibling || node.parentNode;
    node.parentNode.removeChild(node);
    return next2;
  }
  function next(prev, current, isPre) {
    if (prev && prev.parentNode === current || isPre(current)) {
      return current.nextSibling || current.parentNode;
    }
    return current.firstChild || current.nextSibling || current.parentNode;
  }
  var root = typeof window !== "undefined" ? window : {};
  function canParseHTMLNatively() {
    var Parser = root.DOMParser;
    var canParse = false;
    try {
      if (new Parser().parseFromString("", "text/html")) {
        canParse = true;
      }
    } catch (e) {
    }
    return canParse;
  }
  function createHTMLParser() {
    var Parser = function() {
    };
    {
      if (shouldUseActiveX()) {
        Parser.prototype.parseFromString = function(string) {
          var doc = new window.ActiveXObject("htmlfile");
          doc.designMode = "on";
          doc.open();
          doc.write(string);
          doc.close();
          return doc;
        };
      } else {
        Parser.prototype.parseFromString = function(string) {
          var doc = document.implementation.createHTMLDocument("");
          doc.open();
          doc.write(string);
          doc.close();
          return doc;
        };
      }
    }
    return Parser;
  }
  function shouldUseActiveX() {
    var useActiveX = false;
    try {
      document.implementation.createHTMLDocument("").open();
    } catch (e) {
      if (window.ActiveXObject)
        useActiveX = true;
    }
    return useActiveX;
  }
  var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();
  function RootNode(input, options) {
    var root2;
    if (typeof input === "string") {
      var doc = htmlParser().parseFromString(
        // DOM parsers arrange elements in the <head> and <body>.
        // Wrapping in a custom element ensures elements are reliably arranged in
        // a single element.
        '<x-turndown id="turndown-root">' + input + "</x-turndown>",
        "text/html"
      );
      root2 = doc.getElementById("turndown-root");
    } else {
      root2 = input.cloneNode(true);
    }
    collapseWhitespace({
      element: root2,
      isBlock,
      isVoid,
      isPre: options.preformattedCode ? isPreOrCode : null
    });
    return root2;
  }
  var _htmlParser;
  function htmlParser() {
    _htmlParser = _htmlParser || new HTMLParser();
    return _htmlParser;
  }
  function isPreOrCode(node) {
    return node.nodeName === "PRE" || node.nodeName === "CODE";
  }
  function Node2(node, options) {
    node.isBlock = isBlock(node);
    node.isCode = node.nodeName === "CODE" || node.parentNode.isCode;
    node.isBlank = isBlank(node);
    node.flankingWhitespace = flankingWhitespace(node, options);
    return node;
  }
  function isBlank(node) {
    return !isVoid(node) && !isMeaningfulWhenBlank(node) && /^\s*$/i.test(node.textContent) && !hasVoid(node) && !hasMeaningfulWhenBlank(node);
  }
  function flankingWhitespace(node, options) {
    if (node.isBlock || options.preformattedCode && node.isCode) {
      return { leading: "", trailing: "" };
    }
    var edges = edgeWhitespace(node.textContent);
    if (edges.leadingAscii && isFlankedByWhitespace("left", node, options)) {
      edges.leading = edges.leadingNonAscii;
    }
    if (edges.trailingAscii && isFlankedByWhitespace("right", node, options)) {
      edges.trailing = edges.trailingNonAscii;
    }
    return { leading: edges.leading, trailing: edges.trailing };
  }
  function edgeWhitespace(string) {
    var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
    return {
      leading: m[1],
      // whole string for whitespace-only strings
      leadingAscii: m[2],
      leadingNonAscii: m[3],
      trailing: m[4],
      // empty for whitespace-only strings
      trailingNonAscii: m[5],
      trailingAscii: m[6]
    };
  }
  function isFlankedByWhitespace(side, node, options) {
    var sibling;
    var regExp;
    var isFlanked;
    if (side === "left") {
      sibling = node.previousSibling;
      regExp = / $/;
    } else {
      sibling = node.nextSibling;
      regExp = /^ /;
    }
    if (sibling) {
      if (sibling.nodeType === 3) {
        isFlanked = regExp.test(sibling.nodeValue);
      } else if (options.preformattedCode && sibling.nodeName === "CODE") {
        isFlanked = false;
      } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
        isFlanked = regExp.test(sibling.textContent);
      }
    }
    return isFlanked;
  }
  var reduce = Array.prototype.reduce;
  var escapes = [
    [/\\/g, "\\\\"],
    [/\*/g, "\\*"],
    [/^-/g, "\\-"],
    [/^\+ /g, "\\+ "],
    [/^(=+)/g, "\\$1"],
    [/^(#{1,6}) /g, "\\$1 "],
    [/`/g, "\\`"],
    [/^~~~/g, "\\~~~"],
    [/\[/g, "\\["],
    [/\]/g, "\\]"],
    [/^>/g, "\\>"],
    [/_/g, "\\_"],
    [/^(\d+)\. /g, "$1\\. "]
  ];
  function TurndownService(options) {
    if (!(this instanceof TurndownService))
      return new TurndownService(options);
    var defaults = {
      rules,
      headingStyle: "setext",
      hr: "* * *",
      bulletListMarker: "*",
      codeBlockStyle: "indented",
      fence: "```",
      emDelimiter: "_",
      strongDelimiter: "**",
      linkStyle: "inlined",
      linkReferenceStyle: "full",
      br: "  ",
      preformattedCode: false,
      blankReplacement: function(content, node) {
        return node.isBlock ? "\n\n" : "";
      },
      keepReplacement: function(content, node) {
        return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
      },
      defaultReplacement: function(content, node) {
        return node.isBlock ? "\n\n" + content + "\n\n" : content;
      }
    };
    this.options = extend({}, defaults, options);
    this.rules = new Rules(this.options);
  }
  TurndownService.prototype = {
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */
    turndown: function(input) {
      if (!canConvert(input)) {
        throw new TypeError(
          input + " is not a string, or an element/document/fragment node."
        );
      }
      if (input === "")
        return "";
      var output = process.call(this, new RootNode(input, this.options));
      return postProcess.call(this, output);
    },
    /**
     * Add one or more plugins
     * @public
     * @param {Function|Array} plugin The plugin or array of plugins to add
     * @returns The Turndown instance for chaining
     * @type Object
     */
    use: function(plugin) {
      if (Array.isArray(plugin)) {
        for (var i = 0; i < plugin.length; i++)
          this.use(plugin[i]);
      } else if (typeof plugin === "function") {
        plugin(this);
      } else {
        throw new TypeError("plugin must be a Function or an Array of Functions");
      }
      return this;
    },
    /**
     * Adds a rule
     * @public
     * @param {String} key The unique key of the rule
     * @param {Object} rule The rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    addRule: function(key, rule) {
      this.rules.add(key, rule);
      return this;
    },
    /**
     * Keep a node (as HTML) that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    keep: function(filter) {
      this.rules.keep(filter);
      return this;
    },
    /**
     * Remove a node that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    remove: function(filter) {
      this.rules.remove(filter);
      return this;
    },
    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */
    escape: function(string) {
      return escapes.reduce(function(accumulator, escape) {
        return accumulator.replace(escape[0], escape[1]);
      }, string);
    }
  };
  function process(parentNode) {
    var self2 = this;
    return reduce.call(parentNode.childNodes, function(output, node) {
      node = new Node2(node, self2.options);
      var replacement = "";
      if (node.nodeType === 3) {
        replacement = node.isCode ? node.nodeValue : self2.escape(node.nodeValue);
      } else if (node.nodeType === 1) {
        replacement = replacementForNode.call(self2, node);
      }
      return join(output, replacement);
    }, "");
  }
  function postProcess(output) {
    var self2 = this;
    this.rules.forEach(function(rule) {
      if (typeof rule.append === "function") {
        output = join(output, rule.append(self2.options));
      }
    });
    return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
  }
  function replacementForNode(node) {
    var rule = this.rules.forNode(node);
    var content = process.call(this, node);
    var whitespace = node.flankingWhitespace;
    if (whitespace.leading || whitespace.trailing)
      content = content.trim();
    return whitespace.leading + rule.replacement(content, node, this.options) + whitespace.trailing;
  }
  function join(output, replacement) {
    var s1 = trimTrailingNewlines(output);
    var s2 = trimLeadingNewlines(replacement);
    var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
    var separator = "\n\n".substring(0, nls);
    return s1 + separator + s2;
  }
  function canConvert(input) {
    return input != null && (typeof input === "string" || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
  }
  var turndown_browser_es_default = TurndownService;

  // src/activeTab/utils/format/formatMarkdown.js
  var import_dompurify = __toESM(require_purify());
  var formatMarkdown_default = {
    formatMarkdown
  };
  var turndownConverter = new turndown_browser_es_default();
  function formatMarkdown(html) {
    const regex = /(?:<span class="fs-5 mb-3 font-monospace" style="white-space: pre-wrap; overflow-wrap: break-word; cursor: pointer;">([\s\S]*?)<\/span>|<textarea tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="q" class="form-control bg-white darkmode-light searchbox-textarea" rows="1" placeholder="" aria-label="" style="resize: none; height: 512px;">([\s\S]*?)<\/textarea>)/;
    html = formatLineBreaks(html, regex);
    html = import_dompurify.default.sanitize(html);
    if (html !== "" && html !== " ") {
      return turndownConverter.turndown(html).replace(/{{@LT}}/g, "\\<").replace(/{{@GT}}/g, "\\>");
    }
    return "";
  }
  function formatUrl(url, message) {
    return "[" + message + "](" + url.replace(/\)/g, "%29") + ")";
  }
  async function setFileHeader(title, linkSite) {
    try {
      const titles = formatMarkdown(capitalizeFirst(titleShortener(title)[0]));
      const json = await getAppInfos();
      return "# " + titles + "\nExported on " + formatDate(1, /* @__PURE__ */ new Date()) + " " + formatUrl(getUrl(), `from ${linkSite}`) + ` - with ` + formatUrl(`${json.APP_REPO_URL ?? ""}`, `${json.APP_SNAME ?? ""}`) + "\n\n";
    } catch (e) {
      console.error(e);
    }
  }

  // src/activeTab/scraper/ruler/rulesSetter.js
  var rulesSetter_default = {
    setArbitraryPageRules,
    setPhindSearchRules,
    setPhindAgentRules
  };
  function setPhindSearchRules() {
    setPhindRules();
  }
  function setPhindAgentRules() {
    setPhindRules();
  }
  function setPhindRules() {
    turndownConverter.addRule("preserveLineBreaksInPre", {
      filter: function(node) {
        return node.nodeName === "PRE" && node.querySelector("div");
      },
      replacement: function(content, node) {
        const codeBlock = node.querySelector("code");
        const codeContent = codeBlock.textContent.trim();
        const codeLang = codeBlock.className.split("-", 2)[1];
        return "\n```" + codeLang + "\n" + codeContent + "\n```";
      }
    });
    turndownConverter.addRule("formatLinks", {
      filter: "a",
      replacement: function(content, node) {
        const href = node.getAttribute("href");
        const linkText = content.replace(/\\\[/g, "(").replace(/\\\]/g, ")").replace(/</g, "").replace(/>/g, "");
        return "[" + linkText + "](" + href + ")";
      }
    });
    turndownConverter.addRule("backslashAngleBracketsNotInBackticks", {
      filter: function(node) {
        return node.querySelectorAll("p").length > 0;
      },
      replacement: function(content, node) {
        return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, "{{@LT}}").replace(/(?<!`)>(?!`)/g, "{{@GT}}") + "\n\n";
      }
    });
  }
  function setArbitraryPageRules() {
    let superfluousTags, superfluousClassIdOrAttribute;
    superfluousTags = ["header", "footer", "figure", "iframe", "nav", "aside", "style", "script", "link", "meta", "head", "svg", "img", "video", "audio", "canvas", "embed", "object", "param", "source", "track", "map", "area", "picture", "figcaption", "caption", "colgroup", "col", "tbody", "thead", "tfoot", "th", "form", "fieldset", "legend", "label", "input", "button", "select", "datalist", "optgroup", "option", "textarea", "output", "progress", "meter", "summary", "menuitem", "menu"];
    superfluousClassIdOrAttribute = ["sidebar", "nav", "dropdown", "button", "authentication", "navigation", "menu", "read-next", "hamburger", "logo"];
    superfluousTags.forEach((element) => {
      turndownConverter.addRule(`removeTag${element}`, {
        filter: element,
        replacement: function(content) {
          return "";
        }
      });
    });
    superfluousClassIdOrAttribute.forEach((element) => {
      turndownConverter.addRule(`removeId${element}`, {
        filter: function(node) {
          return node.getAttribute && node.getAttribute("id") && node.getAttribute("id").includes(element);
        },
        replacement: function(content) {
          return "";
        }
      });
      turndownConverter.addRule(`removeClass${element}`, {
        filter: function(node) {
          return node.getAttribute && node.getAttribute("class") && node.getAttribute("class").includes(element);
        },
        replacement: function(content) {
          return "";
        }
      });
      turndownConverter.addRule(`removeRole${element}`, {
        filter: function(node) {
          return node.getAttribute && node.getAttribute("role") && node.getAttribute("role").includes(element);
        },
        replacement: function(content) {
          return "";
        }
      });
    });
    turndownConverter.addRule("removeEmptyLinks", {
      filter: function(node) {
        return node.nodeName === "A" && node.textContent.trim() === "";
      },
      replacement: function(content) {
        return "";
      }
    });
    turndownConverter.addRule("removeJsLinks", {
      filter: function(node) {
        return node.nodeName === "A" && node.getAttribute("href") && node.getAttribute("href").startsWith("javascript:");
      },
      replacement: function(content) {
        return "";
      }
    });
    turndownConverter.addRule("reformatLinksContainingTags", {
      filter: function(node) {
        return node.nodeName === "A" && node.getAttribute("href") && node.innerHTML !== node.textContent;
      },
      replacement: function(content, node) {
        let markdown = "";
        for (let i = 0; i < node.childNodes.length; i++) {
          let child = node.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            markdown += turndownConverter.turndown(child.outerHTML);
          } else if (child.nodeType === Node.TEXT_NODE) {
            markdown += child.textContent;
          }
        }
        return markdown;
      }
    });
    turndownConverter.addRule("addHostnameToRelativeLinks", {
      filter: function(node) {
        return node.nodeName === "A" && node.getAttribute("href") && node.getAttribute("href").startsWith("/") && node.innerHTML === node.textContent;
      },
      replacement: function(content, node) {
        return formatUrl(window.location.protocol + "//" + window.location.host + node.getAttribute("href"), content);
      }
    });
  }

  // src/common/utils.js
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function dynamicCall(object, funcToCall, ...args) {
    return typeof object[funcToCall] === "function" ? object[funcToCall](...args) : () => {
      console.error(`Function ${funcToCall} not found`);
      return null;
    };
  }

  // src/activeTab/scraper/ruler/ruler.js
  function setFormatRules(domainName) {
    dynamicCall(rulesSetter_default, `set${domainName}Rules`);
  }

  // src/activeTab/scraper/extractor/extractMetadata.js
  var extractMetadata_default = {
    extractPhindSearchMetadata,
    extractPhindAgentMetadata,
    extractArbitraryPageMetadata
  };
  function getPhindPageTitle() {
    const textarea = document.querySelector("textarea");
    return textarea !== null && textarea.innerHTML !== "" ? textarea.innerHTML : document.querySelector(".card-body p").innerHTML ?? "";
  }
  function extractPhindSearchMetadata() {
    return {
      title: getPhindPageTitle(),
      source: "Phind Search"
    };
  }
  function extractPhindAgentMetadata() {
    return {
      title: getPhindPageTitle(),
      source: "Phind Agent"
    };
  }
  function extractArbitraryPageMetadata() {
    return {
      title: document.title ?? "",
      source: window.location.hostname
    };
  }

  // src/activeTab/utils/webpage/interact.js
  async function clickOnListElt(index) {
    let list = document.querySelectorAll(".table-responsive tr");
    while (list.length === 0) {
      logWaitList();
      await sleep(1e3);
      list = document.querySelectorAll(".table-responsive tr");
    }
    list[index].click();
  }
  async function unfoldQuestions() {
    const possibleElements = document.querySelectorAll('[name^="answer-"] .col-lg-8.col-xl-7 .fe-chevron-down');
    const filteredElements = Array.from(possibleElements).filter((elem) => {
      return !elem.closest(".col-lg-8.col-xl-7").querySelector(".fixed-bottom");
    });
    const chevronDown = filteredElements[0];
    if (chevronDown !== void 0)
      await chevronDown.click();
    return chevronDown !== void 0;
  }
  async function foldQuestions() {
    const possibleElements = document.querySelectorAll('[name^="answer-"] .col-lg-8.col-xl-7 .fe-chevron-up');
    const filteredElements = Array.from(possibleElements).filter((elem) => {
      return !elem.closest(".col-lg-8.col-xl-7").querySelector(".fixed-bottom");
    });
    const chevronUp = filteredElements[0];
    if (chevronUp !== void 0)
      await chevronUp.click();
    return chevronUp !== void 0;
  }

  // src/activeTab/scraper/extractor/extractPages.js
  var extractPages_default = {
    extractArbitraryPage,
    extractPhindSearchPage,
    extractPhindAgentPage
  };
  async function extractArbitraryPage(format) {
    let markdown = await setFileHeader(document.title, window.location.hostname);
    const html = document.querySelector("body").innerHTML;
    markdown += format(html);
    return markdown;
  }
  async function extractPhindSearchPage(format) {
    const unfolded = await unfoldQuestions();
    let sourceQuestion = "";
    const messages = document.querySelectorAll('[name^="answer-"] > div > div');
    let markdown = await setFileHeader(getPhindPageTitle(), "Phind Search");
    messages.forEach((content) => {
      let selectAiAnswer = content.querySelector(".col-lg-8.col-xl-7 > .container-xl > div:not(.button-group)");
      let aiModel = content.querySelector(".col-lg-8.col-xl-7 > div > div > h6");
      let selectUserQuestion = content.querySelector("div > .container-xl > div > span");
      let p3 = Array.from(content.querySelectorAll(".col-lg-4.col-xl-4 > div > div > div > div")).filter((elem) => {
        return !elem.querySelector(".pagination");
      });
      let selectAiCitations = content.querySelector(".col-lg-8.col-xl-7 > .container-xl > div > div > div");
      let selectSources = content.querySelector("div > div > span");
      const isSources = selectSources && selectSources.querySelector("img") === null;
      sourceQuestion = isSources ? format(selectSources.innerHTML) : sourceQuestion;
      const messageText = selectUserQuestion ? `
## User
` + format(selectUserQuestion.innerHTML).replace("  \n", "") : isSources ? "" : p3.length > 0 ? (() => {
        let res = "---\n**Sources:**";
        res += sourceQuestion ? " " + sourceQuestion : "";
        let i = 0;
        p3.forEach((elt) => {
          res += "\n- " + format(elt.querySelector("a").outerHTML).replace("[", `[(${i}) `);
          i++;
        });
        sourceQuestion = "";
        return res;
      })() : selectAiAnswer ? (() => {
        let res = format(selectAiAnswer.innerHTML);
        if (selectAiCitations && selectAiCitations.innerHTML.length > 0)
          res += "\n\n**Citations:**\n" + format(selectAiCitations.innerHTML);
        let aiName;
        if (aiModel !== null)
          aiName = format(aiModel.innerHTML).split(" ")[2];
        const aiIndicator = "## " + capitalizeFirst((aiName ? aiName + " " : "") + "answer") + "\n";
        const index = res.indexOf("\n\n");
        return `
` + aiIndicator + res.substring(index + 2);
      })() : "";
      if (messageText !== "")
        markdown += messageText + "\n\n";
    });
    if (unfolded)
      await foldQuestions();
    return markdown;
  }
  async function extractPhindAgentPage(format) {
    const messages = document.querySelectorAll('[name^="answer-"] > div > div');
    let markdown = await setFileHeader(getPhindPageTitle(), "Phind Agent");
    for (const content of messages) {
      const p1 = content.querySelectorAll(".card-body > p, .card-body > div");
      const p2 = content.querySelectorAll(".card-body > div:nth-of-type(2) a");
      const p3 = content.querySelectorAll(".card-body > span");
      const messageText = p1.length > 0 ? await (async () => {
        let res = "";
        if (p3.length > 0) {
          res += "#### ";
          let putSeparator = true;
          p3.forEach((elt) => {
            res += format(elt.innerHTML);
            if (p3.length > 1 && p3[1].innerHTML !== "" && putSeparator) {
              res += " - ";
              putSeparator = false;
            }
          });
          res += "\n";
        }
        if (p2.length > 0) {
          res += format(p1[0].innerHTML) + "\n";
          res += "___\n**Sources:**";
          const buttonsInCard = p1[1].querySelectorAll("button");
          for (const btn of buttonsInCard) {
            if (btn.textContent.toLowerCase() === "view all search results") {
              btn.click();
              await sleep(0);
              let i = 1;
              let allResults = "**All search results:**";
              const dialogLinks = Array.from(document.querySelectorAll("[role='dialog'] a"));
              const p2Array = Array.from(p2);
              dialogLinks.forEach((link) => {
                if (p2Array.find((elt) => elt.getAttribute("href") === link.getAttribute("href"))) {
                  res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
                }
                allResults += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
                i++;
              });
              res += "\n\n" + allResults;
              document.querySelectorAll("[role='dialog'] [type='button']").forEach((btn2) => {
                if (btn2.textContent.toLowerCase() === "close")
                  btn2.click();
              });
            }
          }
          res += "\n";
        } else
          p1.forEach((elt) => {
            res += format(elt.innerHTML) + "\n";
          });
        return res;
      })() : "";
      if (messageText !== "")
        markdown += messageText + "\n\n";
    }
    return markdown;
  }

  // src/activeTab/scraper/extractor/extractor.js
  async function extract(domain) {
    try {
      const markdownContent = await dynamicCall(extractPages_default, `extract${domain.name}Page`, formatMarkdown_default[`formatMarkdown`]);
      const metadata = dynamicCall(extractMetadata_default, `extract${domain.name}Metadata`);
      const fileName = formatFilename(metadata.title, domain.name.replace(/([a-z])([A-Z])/g, "$1-$2"));
      return { markdownContent, title: metadata.title, fileName };
    } catch (e) {
      console.error(e);
      const appInfos2 = await getAppInfos();
      alert(`Error while exporting page.

Please contact me at ${appInfos2.CONTACT_EMAIL} with these information if the problem persists:
\u226B The steps to reproduce the problem
\u226B The URL of this page
\u226B The app version: ${appInfos2.APP_VERSION}
\u226B Screenshots illustrating the problem

Thank you!`);
      return null;
    }
  }

  // src/activeTab/scraper/exporter/exportMethods.js
  function download(text, filename) {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // src/activeTab/scraper/exporter/exporter.js
  async function exportContent(domain, extracted) {
    const { markdownContent, fileName } = extracted;
    await download(markdownContent, fileName);
  }

  // src/activeTab/scraper/scraper.js
  async function launchExport() {
    const domain = await domainChecker();
    if (domain === null)
      return;
    logWelcome();
    setFormatRules(domain.name);
    const extracted = await extract(domain);
    if (extracted === null)
      return;
    await exportContent(domain, extracted);
    console.log("Export done!");
  }
  function autoScrapOnLoad() {
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
      if (request.message === "executeScript") {
        if (request.index > 0)
          launchExport();
        clickOnListElt(request.index);
        setTimeout(function() {
          sendResponse({ message: "scriptExecuted" });
        }, 1);
      }
      return true;
    });
  }

  // src/activeTab/uiEnhancer/messenger/modalUpdate.js
  async function getUpdates() {
    const response = await fetch(chrome.runtime.getURL("assets/updateNotes.md"));
    const markdown = (await response.text()).replaceAll("\r\n", "\n");
    const sections = markdown.split("\n# ").slice(1);
    const content = sections[0].substring(sections[0].indexOf("\n")).trim();
    return content.split("\n\n");
  }
  async function getUpdatesData() {
    const updates = await getUpdates();
    const updateDetailsList = [];
    for (const update of updates) {
      const [title, ...descriptionParts] = update.split("\n");
      const description = descriptionParts.join("\n");
      updateDetailsList.push({ title, description });
    }
    return updateDetailsList;
  }

  // src/activeTab/uiEnhancer/elements/createElements.js
  async function createSideMenuBtn(title, icon, display = "", txtSize = "fs-5") {
    const appInfos2 = await getAppInfos();
    const table = document.createElement("table");
    table.className = "table darkmode-semi-light table-flush table-hover text-black border border-history-panel mb-0";
    var button = document.createElement("tbody");
    var tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    var td = document.createElement("td");
    var div1 = document.createElement("div");
    div1.classList.add("row");
    var div2 = document.createElement("div");
    div2.classList.add("col-1", "fs-5");
    var div3 = document.createElement("div");
    div3.classList.add("fw-bold", "col-10", txtSize);
    var iElement = document.createElement("i");
    iElement.classList.add("mx-2", "fe", icon);
    div3.innerHTML += title;
    div3.insertBefore(iElement, div3.childNodes[0]);
    div1.appendChild(div2);
    div1.appendChild(div3);
    td.appendChild(div1);
    tr.appendChild(td);
    button.appendChild(tr);
    table.appendChild(button);
    table.setAttribute("extension", appInfos2.APP_SNAME);
    return table;
  }
  async function createTopBtn(title, icon, classElt = "") {
    const appInfos2 = await getAppInfos();
    let buttonElement = document.createElement("button");
    buttonElement.setAttribute("type", "button");
    buttonElement.classList.add("btn", "btn-primary", "btn-sm", "mt-1");
    var iElement = document.createElement("i");
    iElement.classList.add("mx-2", "fe", icon);
    buttonElement.innerHTML = title;
    buttonElement.style.margin = "0 4px 0 0";
    buttonElement.insertBefore(iElement, buttonElement.childNodes[0]);
    if (classElt !== "")
      buttonElement.classList.add(classElt);
    buttonElement.setAttribute("extension", appInfos2.APP_SNAME);
    return buttonElement;
  }
  async function createModalUpdate(modalBackground) {
    const appInfos2 = await getAppInfos();
    const updates = await getUpdatesData();
    var outerDiv = document.createElement("div");
    outerDiv.setAttribute("role", "dialog");
    outerDiv.setAttribute("aria-modal", "true");
    outerDiv.classList.add("fade", "modal", "show");
    outerDiv.style.display = "block";
    var modalDialogDiv = document.createElement("div");
    modalDialogDiv.classList.add("modal-dialog");
    var modalContentDiv = document.createElement("div");
    modalContentDiv.classList.add("modal-content");
    var modalBodyDiv = document.createElement("div");
    modalBodyDiv.classList.add("bg-light", "modal-body");
    var innerDivImage = document.createElement("span");
    innerDivImage.style.marginRight = "10px";
    var innerDivImageImg = document.createElement("img");
    innerDivImageImg.src = chrome.runtime.getURL("assets/icons/icon-48.png");
    innerDivImageImg.alt = `${appInfos2.APP_SNAME} icon`;
    innerDivImageImg.width = "48";
    innerDivImageImg.height = "48";
    innerDivImage.appendChild(innerDivImageImg);
    var modalTitleDiv = document.createElement("div");
    modalTitleDiv.classList.add("mb-5", "modal-title", "h2");
    modalTitleDiv.innerHTML = "Hey, it's an update!";
    modalBodyDiv.appendChild(modalTitleDiv);
    modalTitleDiv.prepend(innerDivImage);
    var modalSubtitleDiv = document.createElement("div");
    modalSubtitleDiv.classList.add("mb-5", "modal-title", "h3");
    modalSubtitleDiv.innerHTML = `What's new in ${appInfos2.APP_NAME} v${appInfos2.APP_VERSION}:`;
    var innerDivLink = document.createElement("a");
    innerDivLink.target = "_blank";
    innerDivLink.classList.add("mb-0");
    const manifest = chrome.runtime.getManifest();
    let storeName = "Chrome Web Store";
    if (manifest.browser_specific_settings !== void 0 && manifest.browser_specific_settings.gecko !== void 0) {
      innerDivLink.href = appInfos2.APP_FIREFOX_STORE_URL + "/reviews";
      storeName = "Firefox Add-ons Store";
    } else {
      innerDivLink.href = appInfos2.APP_WEBSTORE_URL + "/reviews";
      storeName = "Chrome Web Store";
    }
    innerDivLink.innerHTML = `\u2B50 If ${appInfos2.APP_NAME} helps you, please leave it a review on the ${storeName}! \u2B50<br>`;
    let innerDiv4 = createModalTextGroup(`Enjoy!<br>Hugo <small>- ${appInfos2.APP_SNAME} creator</small>`, "I'm not affiliated with the Phind.com developers, I just love this website and I wanted to make it even better.");
    modalBodyDiv.appendChild(innerDivLink);
    modalBodyDiv.appendChild(document.createElement("br"));
    modalBodyDiv.appendChild(modalSubtitleDiv);
    updates.forEach((update) => {
      const innerDiv = createModalTextGroup(update.title, update.description);
      modalBodyDiv.appendChild(innerDiv);
    });
    modalBodyDiv.appendChild(document.createElement("br"));
    modalBodyDiv.appendChild(innerDiv4);
    var closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.classList.add("m-1", "btn", "btn-primary");
    closeButton.innerHTML = "Let's Phind!";
    modalContentDiv.appendChild(modalBodyDiv);
    modalContentDiv.appendChild(closeButton);
    modalDialogDiv.appendChild(modalContentDiv);
    outerDiv.appendChild(modalDialogDiv);
    closeButton.addEventListener("click", function() {
      outerDiv.remove();
      modalBackground.remove();
    });
    outerDiv.setAttribute("extension", appInfos2.APP_SNAME);
    return outerDiv;
  }
  function createModalTextGroup(bigText, smallText) {
    let innerDiv = document.createElement("div");
    innerDiv.classList.add("pb-2");
    innerDiv.style.opacity = "1";
    let p2 = document.createElement("p");
    p2.classList.add("mb-0", "fs-4", "fw-bold");
    p2.innerHTML = bigText;
    let desc2 = document.createElement("p");
    desc2.classList.add("mb-0", "fs-5");
    desc2.innerHTML = smallText;
    innerDiv.appendChild(p2);
    innerDiv.appendChild(desc2);
    return innerDiv;
  }
  function createModalBg() {
    var divElement = document.createElement("div");
    divElement.classList.add("fade", "modal-backdrop", "show");
    return divElement;
  }
  async function createSmallField(placeholder) {
    const appInfos2 = await getAppInfos();
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.classList.add("form-control", "form-control-sm", "mb-1");
    input.setAttribute("extension", appInfos2.APP_SNAME);
    return input;
  }
  async function createButtonGroup(id) {
    const appInfos2 = await getAppInfos();
    const btnsGroup = document.createElement("div");
    btnsGroup.classList.add("button-group", "mb-2");
    btnsGroup.id = id;
    btnsGroup.setAttribute("extension", appInfos2.APP_SNAME);
    btnsGroup.style.display = "inline";
    return btnsGroup;
  }

  // src/activeTab/uiEnhancer/elements/styleCreatedElements.js
  function setBtnsExport(exporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn) {
    if (exporting) {
      exportAllThreadsSideBtn.style.display = "none";
      exportAllThreadsTopBtn.style.display = "none";
      stopExportAllThreadsSideBtn.style.display = "";
      stopExportAllThreadsTopBtn.style.display = window.innerWidth < 1025 ? "inline-block" : "none";
    } else {
      exportAllThreadsSideBtn.style.display = "";
      exportAllThreadsTopBtn.style.display = window.innerWidth < 1025 ? "inline-block" : "none";
      stopExportAllThreadsSideBtn.style.display = "none";
      stopExportAllThreadsTopBtn.style.display = "none";
    }
  }

  // src/activeTab/uiEnhancer/elements/insertElements.js
  async function waitAppears(select, duration = 100, attempts = 100) {
    let i = 1;
    let nester;
    do {
      if (i > attempts)
        return false;
      nester = document.querySelector(select);
      await sleep(duration);
      i++;
    } while (nester === null);
    return nester;
  }
  async function waitAppend(select, htmlTableSectionElements, mode = "append") {
    let nester = null;
    if (typeof select === "string") {
      nester = await waitAppears(select);
      if (!nester)
        return false;
    } else if (typeof select === "object") {
      let res = select.filter((elt) => document.querySelector(elt.selector));
      while (Array.isArray(res) && res.length === 0) {
        await sleep(1e3);
        res = select.filter((selector) => document.querySelector(selector));
      }
      mode = res[0].mode;
      nester = document.querySelector(res[0].selector);
    } else
      return false;
    if (mode === "insertBefore") {
      for (let button of htmlTableSectionElements) {
        nester.parentNode.insertBefore(button, nester);
      }
      return true;
    }
    for (let button of htmlTableSectionElements) {
      nester[mode](button);
    }
    return true;
  }

  // src/activeTab/listFilter/filter.js
  async function addListFilter() {
    const input = await createSmallField("Search previous threads...");
    await waitAppend(".container.p-0 > .row", [input], "insertBefore");
    input.addEventListener("input", () => {
      filterList(input, ".container.p-0 > .row tbody > tr", ".fs-6");
    });
  }
  function filterList(input, rowsSelector, textSelector) {
    const filterText = input.value.toLowerCase();
    const rows = document.querySelectorAll(rowsSelector);
    rows.forEach((row) => {
      const text = row.querySelector(textSelector).textContent.toLowerCase();
      row.style.display = text.includes(filterText) ? "" : "none";
    });
  }

  // src/activeTab/uiEnhancer/elements/changeElements.js
  function btnBarAllInline(topBtnsGroup) {
    if (topBtnsGroup.nextElementSibling === null)
      return;
    const btns = topBtnsGroup.nextElementSibling.querySelectorAll("button");
    if (btns.length !== 0) {
      const nextElt = topBtnsGroup.nextElementSibling;
      nextElt.style.display = "inline";
      nextElt.style.marginRight = "0.5rem";
      btns.forEach((elt) => {
        elt.classList.remove("mb-4", "mb-3");
        elt.classList.add("mt-1");
      });
    }
  }

  // src/activeTab/uiEnhancer/uiEnhancer.js
  function improveUI() {
    window.addEventListener("load", function() {
      if (window.location.href.includes("phind.com")) {
        chrome.runtime.sendMessage({ message: "LOAD_COMPLETE" }, async function(response) {
          if (response.message === "exportAllThreads finished")
            window.location.href = "https://www.phind.com";
          else if (response.message === "LOAD_COMPLETE processed" || response.message === "exportAllThreads in progress") {
            let isExporting = response.message === "exportAllThreads in progress";
            const topBtnsGroup = await createButtonGroup("top-buttons-group");
            const isStopGenBasic = document.querySelector('[name="answer-0"] > div > .container-xl > button') !== null;
            const isHomepage = isHomepageCheck();
            isStopGenBasic ? (
              // Adds the top button bar on Basic search
              await waitAppend('[name="answer-0"] > div > .container-xl', [topBtnsGroup], "prepend").then(() => {
                waitAppears('[name="answer-0"] > div > .container-xl > button:not([style="visibility: hidden;"])', 5, 2e4).then(() => {
                  waitAppears('[name="answer-0"] > div > .container-xl > [style="visibility: hidden;"]', 5, 2e4).then(async (elt) => {
                    await waitAppend('[name="answer-0"] > div > .container-xl', [topBtnsGroup], "prepend");
                  });
                });
              })
            ) : await waitAppend("div > div > .container-xl", [topBtnsGroup], isHomepage ? "append" : "prepend").then(async () => {
            });
            btnBarAllInline(topBtnsGroup);
            document.querySelector(".row > .col-lg-2 > div").style.minWidth = "11em";
            const thread = document.querySelector(".row > .col-lg-8.mt-8");
            if (thread !== null) {
              thread.classList.add("mx-3");
              const bar = document.querySelector(".col-lg-8.col-md-12");
              if (bar !== null)
                bar.classList.add("mx-3");
            }
            waitAppears(".col-lg-2 > div > div > table").then((elt) => {
              document.querySelectorAll(".col-lg-2 > div > div > table").forEach((elt2) => {
                elt2.classList.add("mb-0");
              });
            });
            waitAppears(".col-lg-2 > div > div > table.mb-7").then((elt) => {
              if (!elt)
                return;
              elt.classList.remove("mb-7");
            });
            let exportAllThreadsSideBtn = await createSideMenuBtn("Export All Threads", "fe-share", "", "fs-6");
            let stopExportAllThreadsSideBtn = await createSideMenuBtn("Stop Exporting Threads", "fe-x", "none", "fs-6");
            let exportAllThreadsTopBtn = await createTopBtn("Export All Threads", "fe-share", "smallScreens");
            let stopExportAllThreadsTopBtn = await createTopBtn("Stop Exporting Threads", "fe-x", "smallScreens");
            let exportThreadTopBtn = await createTopBtn("Save This Thread", "fe-save");
            exportThreadTopBtn.addEventListener("click", function() {
              launchExport();
            });
            exportAllThreadsSideBtn.addEventListener("click", function() {
              let redirect = false;
              if (window.location.href !== "https://www.phind.com/" && window.location.href !== "https://www.phind.com") {
                window.location.href = "https://www.phind.com";
                redirect = true;
              }
              chrome.runtime.sendMessage({
                message: "exportAllThreads",
                length: document.querySelectorAll(".table-responsive tr").length,
                redirect
              }, function(response2) {
                console.log(response2.message);
              });
              setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
            });
            stopExportAllThreadsSideBtn.addEventListener("click", function() {
              chrome.runtime.sendMessage({ message: "stopExportingThreads" }, function(response2) {
                console.log(response2.message);
              });
              setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
              window.location.href = "https://www.phind.com";
            });
            exportAllThreadsTopBtn.addEventListener("click", function() {
              let redirect = false;
              if (window.location.href !== "https://www.phind.com/" && window.location.href !== "https://www.phind.com") {
                window.location.href = "https://www.phind.com";
                redirect = true;
              }
              chrome.runtime.sendMessage({
                message: "exportAllThreads",
                length: document.querySelectorAll(".table-responsive tr").length,
                redirect
              }, function(response2) {
                console.log(response2.message);
              });
              setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
            });
            stopExportAllThreadsTopBtn.addEventListener("click", function() {
              chrome.runtime.sendMessage({ message: "stopExportingThreads" }, function(response2) {
                console.log(response2.message);
              });
              setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
              window.location.href = "https://www.phind.com";
            });
            if (!isHomepage)
              topBtnsGroup.append(exportThreadTopBtn);
            if (response.message === "exportAllThreads in progress") {
              setBtnsExport(true, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
            } else {
              setBtnsExport(false, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
            }
            waitAppend(".col-lg-2 > div > div > table:nth-of-type(1)", [exportAllThreadsSideBtn, stopExportAllThreadsSideBtn], "after");
            topBtnsGroup.append(exportAllThreadsTopBtn, stopExportAllThreadsTopBtn);
            waitAppears(".container.p-0 > .row tbody > tr", 100).then(async (threadsList) => {
              if (!threadsList)
                return;
              document.querySelector(".row > .table-responsive").classList.add("p-0");
              document.querySelector(".container.p-0 > .row").style.width = "108%";
              const listGlobal = document.querySelector(".container.p-0");
              listGlobal.classList.remove("mt-6");
              listGlobal.classList.add("mt-3");
              const logoPhind = document.querySelector(".d-lg-block.container");
              logoPhind.classList.remove("mb-5", "mt-8");
              logoPhind.classList.add("mb-4", "mt-7");
              await addListFilter();
            });
            chrome.storage.sync.get(["displayModalUpdate"], async function(result) {
              if (result.displayModalUpdate) {
                let modalbg = createModalBg();
                let modalUpdateLogs = await createModalUpdate(modalbg);
                waitAppend("body", [modalbg, modalUpdateLogs], "appendChild");
                chrome.storage.sync.set({ displayModalUpdate: false }, function() {
                  console.log("Last update modal will not be displayed until the next update");
                });
              }
            });
            window.addEventListener("resize", function() {
              setBtnsExport(isExporting, exportAllThreadsSideBtn, exportAllThreadsTopBtn, stopExportAllThreadsSideBtn, stopExportAllThreadsTopBtn);
              btnBarAllInline(topBtnsGroup);
            });
          }
        });
      }
    });
  }

  // src/main.js
  if (window.isInjecting) {
    launchExport();
  } else {
    autoScrapOnLoad();
    improveUI();
  }
})();
/*! Bundled license information:

dompurify/dist/purify.js:
  (*! @license DOMPurify 3.0.4 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.0.4/LICENSE *)
*/
