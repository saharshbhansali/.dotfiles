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
var advertisementClassifier = (function () {
  function behavior(el) {
    var commonScoreWords = el.scores.common.words;
    if(commonScoreWords.size === 1 && (commonScoreWords.get('advertisement') || commonScoreWords.get('ad'))) {
      el.remove();
    }
  }

  return function setup(scorer) {
    scorer.registerBehaviorFunction(behavior);
  };
})();
// TODO: replace with Map once phantomjs deprecated

function MySimpleMap() {
  this.size = 0;
  this.store = {};
}

MySimpleMap.prototype.get = function (key) {
  return this.store[key];
};

MySimpleMap.prototype.set = function (key, val) {
  if (this.store[key] === undefined) { this.size++; }
  this.store[key] = val;
};

/**
 * Calculates score shared over multiple classifiers
 */
var commonScore = (function() {
  var SCORE_KEY = 'common';
  var URL_HOST_REGEXP = /^https?:\/\/([^\.?]+\.)*([^\.?]+\.[^\.\/?]+)\//;
  var LIKELY_CONTENT_REGEXP = /article|main|body|content/i;
  var H_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

  function buildScore(attrs) {
    attrs = attrs || {};
    var words = attrs.words || new MySimpleMap();
    var links = attrs.links || new MySimpleMap();

    return {
      words: words,
      links: links,
      uniqWordsCount: words.size,
      uniqLinksCount: links.size,
      tagsCount: attrs.tagsCount || 0,
      hTagsCount: attrs.hTagsCount || 0,
      hasContentTag: attrs.hasContentTag || false,
      hasImage: attrs.hasImage || false,
      hasTable: attrs.hasTable || false
    };
  }

  function scoreForText(str) {
    var words = new MySimpleMap();
    var wordsArray = sliceWordsService(str);
    for(var i = 0, length = wordsArray.length; i < length; i++) {
      var word = wordsArray[i];
      words.set(word, (words.get(word) || 0) + 1);
    }

    return buildScore({ words: words });
  }

  function scoreForLink(str) {
    var urlMatch = str.match(URL_HOST_REGEXP);
    var links = new MySimpleMap();

    if (urlMatch) { links.set(urlMatch[2].toLowerCase(), 1); }

    return buildScore({ links: links });
  }

  function mergeMapsScore(score1, score2, key) {
    var result = new MySimpleMap();
    var sc1 = score1[key].store;
    var sc2 = score2[key].store;

    for (var elem1 in sc1) { result.set(elem1, sc1[elem1]); }
    for (var elem2 in sc2) {
      result.set(elem2, (result.get(elem2) || 0) + sc2[elem2]);
    }
    return result;
  }

  function mergeScore(score1, score2) {
    score1.words = mergeMapsScore(score1, score2, 'words');
    score1.links = mergeMapsScore(score1, score2, 'links');
    score1.uniqLinksCount = score1.links.size;
    score1.uniqWordsCount = score1.words.size;
    score1.hasContentTag = score1.hasContentTag || score2.hasContentTag;
    score1.hasImage = score1.hasImage || score2.hasImage;
    score1.hasTable = score1.hasTable || score2.hasTable;
    score1.tagsCount += score2.tagsCount;
    score1.hTagsCount += score2.hTagsCount;
  }

  function calcScore(el) {
    if (el.node.nodeType === Node.TEXT_NODE && el.node.parentNode && isContentNodeHelperService(el.node.parentNode)) {
      return scoreForText(el.node.textContent);
    }

    var result = mergeChildrenScoreHelperService(
      el,
      SCORE_KEY,
      buildScore(),
      mergeScore
    );

    result.hasContentTag = result.hasContentTag || el.nameMatches(LIKELY_CONTENT_REGEXP);
    result.hasTable = result.hasTable || el.hasTagName('table');
    result.tagsCount++;
    if(H_TAGS.indexOf(el.node.tagName) >= 0) { result.hTagsCount++; }

    switch(el.node.nodeName) {
      case "IMG":
        var alt = el.node.getAttribute('alt');
        var src = el.node.getAttribute('src');
        result.hasImage = true;
        if (alt) { mergeScore(result, scoreForText(alt)); }
        if (src) { mergeScore(result, scoreForLink(src)); }
        break;
      case "A":
        var title = el.node.getAttribute('title');
        var href = el.node.getAttribute('href');
        if (title) { mergeScore(result, scoreForText(title)); }
        if (href) { mergeScore(result, scoreForLink(href)); }
        break;
    }

    return result;
  }

  return function setup(scorer) {
    scorer.registerScoreFunction(SCORE_KEY, calcScore);
  };
})();
var doubleBrClassifier = (function () {
  var BR = 'BR';
  var P_CLASS_NAME = 'pf-br-replacement';

  function isBreak(el) {
    if (el.node.tagName === BR) { return true; }
    var isEmpty = !el.scores.common.hasImage && el.scores.common.words.size === 0;
    if (isEmpty && el.isElement() && el.node.querySelector('br')) { return true; }
    return false;
  }

  function behavior(el) {
    if (el.nameMatches(P_CLASS_NAME)) { return; }

    var brsClusters = [];
    var start = null;
    var brsInRowCount = 0;
    // NOTE: we need to copy this value as we are modifying tree in cycle
    var elChildren = [];
    el.forEachChild(function(child, i) {
      elChildren.push(child);

      if (isBreak(child)) {
        if (brsInRowCount === 0) { start = i; }
        brsInRowCount++;
      } else if(brsInRowCount >= 2) {
        brsClusters.push([start, i]);
        brsInRowCount = 0;
      } else {
        brsInRowCount = 0;
      }
    }, true);
    if (brsInRowCount >= 2) { brsClusters.push([start, elChildren.length - 1]); }

    var filteredClusters = [];
    for (var fi = 0, f_length = brsClusters.length; fi < f_length; fi++) {
      var filteredCluster = brsClusters[fi];
      if(filteredCluster[0] !== filteredCluster[1]) { filteredClusters.push(filteredCluster); }
    }

    var wrapStart = 0;
    for(var i = 0, length = filteredClusters.length; i < length; i++) {
      var cluster = filteredClusters[i];
      var wrapperP = el.tree.createElement('p');
      wrapperP.node.setAttribute('class', P_CLASS_NAME);
      for(var j = wrapStart; j < cluster[0]; j++) {
        var child = elChildren[j];
        // NOTE: check that child still have node and it's attached to DOM
        if (!child.node || !child.node.parentNode) { continue; }
        // NOTE: put wrapper on first element place
        if (!wrapperP.parent) { child.parent.replaceChild(wrapperP, child); }
        wrapperP.appendChild(child);
      }

      for(var brI = cluster[0]; brI < cluster[1]; brI++) {
        if(isBreak(elChildren[brI])) {
          elChildren[brI].remove();
        }
      }

      wrapStart = cluster[1];
    }
  }

  return function setup(scorer) {
    scorer.registerBehaviorFunction(behavior);
  };
})();
var emptyTagsClassifier = (function() {
  var SCORE_KEY = 'empty_tags';

  var SKIP_TAGS_WITH_CHILDREN = {
    AREA: true,
    BASE: true,
    COL: true,
    COMMAND: true,
    EMBED: true,
    HR: true,
    IMG: true,
    INPUT: true,
    KEYGEN: true,
    LINK: true,
    META: true,
    PARAM: true,
    SOURCE: true,
    TRACK: true,
    WBR: true,
    BR: true,
    'TWITTER-WIDGET': true,
    IFRAME: true,
    PRE: true,
    SVG: true
  };

  // We skip these tags but not their children
  var SKIP_TAGS = {
    I: true,
    SPAN: true,
    TD: true,
    TH: true
  };

  function getScore(el) {
    return el.scores[SCORE_KEY];
  }

  function buildScore(args) {
    args = args || {};
    return {
      skipTag: args.skipTag || false,
      parentSkipTag: args.parentSkipTag || false
    };
  }

  function calcScore(el) {
    if(el.node.nodeType !== Node.ELEMENT_NODE) { return buildScore(); }

    // NOTE: some SVG tags has lowercase names
    var tagName = el.node.tagName.toUpperCase();
    return buildScore({
      parentSkipTag: (SKIP_TAGS_WITH_CHILDREN[tagName] || el.parent && getScore(el.parent).parentSkipTag),
      skipTag: SKIP_TAGS[tagName],
    });
  }

  function behavior(el) {
    var score = calcScore(el);
    el.scores[SCORE_KEY] = score;

    if (
      !el.scores.common.hasImage &&
      el.children.length === 0 &&
      !(score.skipTag || score.parentSkipTag) &&
      $.trim(el.node.textContent) === '' &&
      !(el.node.nodeType === Node.ELEMENT_NODE && el.node.getAttribute('data-pf-allow-empty'))
    ) {
      el.remove();
    }
  }

  return function setup(scorer) {
    scorer.registerBehaviorFunction(behavior);
  };
})();
var headerFooterClassifier = (function() {
  var SCORE_KEY = 'header_footer';
  var HEADER_REGEXP  = /head/i;
  var HEADER = 'header';
  var FOOTER = 'footer';
  var FOOTER_REGEXP = /foot/i;
  var BIG_POINTS = 1000000;
  var TAGS_BOTTOM_THRESHOLD = 3;
  var HEADER_TABLE_TAGS = ['TABLE', 'THEAD', 'TBODY', 'TR', 'TH'];
  var IGNORE_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  var MIN_CONTENT_SCORE = 10;

  var Scores = {
    TAG_MATCH: 4,
    ID_MATCH: 3,
    CLASS_MATCH: 2,
    PARTIAL_REGEXP_MATCH: 1,
  };

  function buildScore(args) {
    args = args || {};
    return {
      contentPoints: args.contentPoints || 0,
      headerPoints: args.headerPoints || 0,
      footerPoints: args.footerPoints || 0,
    };
  }

  function getScore(el) {
    return el.scores[SCORE_KEY];
  }
  /**
   * Calculates likely contented based on words count and common.hasContentTag
   * NOTE: common.hasContentTag is propagated from children
   *
   * @param {Element} el
   */
  function calcContentPoints(el) {
    var res = el.scores.common.uniqWordsCount;
    if (el.scores.common.hasContentTag) { res += BIG_POINTS; }
    return res;
  }

  function calcPointsFor(el, tagName, regexp) {
    var headerPoints = 0;

    if (el.hasTagName(tagName)) { headerPoints = Scores.TAG_MATCH; }
    else if (el.hasId(tagName)) { headerPoints = Scores.ID_MATCH; }
    else if (el.hasClass(tagName)) { headerPoints = Scores.CLASS_MATCH; }
    else if (el.nameMatches(regexp)) { headerPoints = Scores.PARTIAL_REGEXP_MATCH; }

    return headerPoints;
  }

  /**
   * Searches likely footer candidates in siblings(in el.children)
   *
   * @param {Element} el
   */
  function findLikelyContent(el) {
    var result = null;
    var resultPoints = MIN_CONTENT_SCORE;

    el.forEachChild(function(child) {
      var score = getScore(child);
      var points = score.contentPoints - score.footerPoints - score.headerPoints;
      if (resultPoints <= points) {
        result = child;
        resultPoints = points;
      }
    });

    return result;
  }

  /**
   * Searches candidate in siblings(in el.children) for header or for footer
   *
   * @param {Element} el
   * @param {'headerPoints' | 'footerPoints'} pointsKey
   */
  function findCandidateBy(el, pointsKey) {
    var candidate = null;
    for(var i = 0, length = el.children.length; i < length; i++) {
      var child = el.children[i];
      var score = getScore(child);
      if (score[pointsKey] <= 0) { continue; }
      // NOTE: return null as we found more than 1 candidate
      if (candidate) { return null; }
      candidate = child;
    }

    return candidate;
  }

  function findHeaderCandidate(el) {
    return findCandidateBy(el, 'headerPoints');
  }

  function findFooterCandidate(el) {
    return findCandidateBy(el, 'footerPoints');
  }

  function calcScore(el) {
    return buildScore({
      headerPoints: calcPointsFor(el, HEADER, HEADER_REGEXP),
      footerPoints: calcPointsFor(el, FOOTER, FOOTER_REGEXP),
      contentPoints: calcContentPoints(el),
    });
  }

  function isPartOfTable(el) {
    var tagName = el.node.tagName;
    return el.scores.common.hasTable || HEADER_TABLE_TAGS.indexOf(tagName) >= 0;
  }

  function isHTagWrapper(el) {
    return el.scores.common.hTagsCount === 1 && el.scores.common.tagsCount < 50;
  }

  function behavior(el) {
    if (el.node.tagName && IGNORE_TAGS.indexOf(el.node.tagName) >= 0) { return; }

    var scores = getScore(el);
    var parentScores = (el.parent && getScore(el.parent)) || {};
    scores.inArticle = parentScores.inArticle || el.hasTagName('article') || false;

    if (scores.inArticle) { return; }

    var mostLikelyContent = findLikelyContent(el);
    var headerCandidate = findHeaderCandidate(el);
    var footerCandidate = findFooterCandidate(el);
    // NOTE: check if nested nodes doesn't contain table
    // as it is often a case when table head is wrapped into separate table
    if (headerCandidate && mostLikelyContent !== headerCandidate && headerCandidate.scores.common.tagsCount > TAGS_BOTTOM_THRESHOLD && !isPartOfTable(headerCandidate) && !isHTagWrapper(headerCandidate)) {
      headerCandidate.remove();
    }
    if (footerCandidate && mostLikelyContent !== footerCandidate && footerCandidate.scores.common.tagsCount > TAGS_BOTTOM_THRESHOLD) { footerCandidate.remove(); }
  }

  return function setup(scorer) {
    scorer.registerScoreFunction(SCORE_KEY, calcScore);
    scorer.registerBehaviorFunction(behavior);
  };
})();
var mustKeepClassifier = (function() {
  var MUST_KEEP_REGEXP = /copyright|delete-no|delete-off|pf-author|print-content|pf-date|pf-title|pf-footer|print-header|print-footer|print-only|print-yes|pf-content/i;

  function mustKeepMark(el, options) {
    if ((el.hasTagName('A') && el.node.getAttribute('name')) || el.nameMatches(MUST_KEEP_REGEXP) || options.mustKeepSelectors && el.node.matches && el.node.matches(options.mustKeepSelectors.value)) {
      el.keep();
      return;
    }
  }

  return function setup(scorer, options) {
    scorer.registerMarkFunction(mustKeepMark, options);
  };
}());
var relatedArticlesClassifier = (function() {
  var DATA_TAGS = { 'TABLE': true, 'TR': true, 'TD': true };
  var SCORE_KEY = 'relatedArticle';
  var LINK_DENSITY_THRESHOLD = 0.4;
  var RECIPE_DENSITY_THRESHOLD = 0.15;
  var RELATED_TAGS_DENSITY_THRESHOLD = 0.5;
  var LONG_TEXT_THRESHOLD = 25;
  var MANY_TAGS_THRESHOLD = 175;
  var MANY_UNIQ_WORDS = 200;
  var IMG_A_TAGS_MISMATCH_RATIO = 2.5;
  var MANY_CONTENT_TAGS_THRESHOLD = 25;
  var IGNORE_CLASSES = /gallery/i;
  var PREVIEW_TEXT_END_REGEXP = /(\.{3,}|…)$/;
  var EDGE_PERCENT = 0.3;

  function buildScore(args) {
    args = args || {};
    return {
      wordsCount: args.wordsCount || 0,
      recipeWordsCount: args.recipeWordsCount || 0,
      insideLinkWordsCount: args.insideLinkWordsCount || 0,
      contentTagsCount: args.contentTagsCount || 0,
      imgTagsCount: args.imgTagsCount || 0,
      aTagsCount: args.aTagsCount || 0,
      hasLongTextNode: args.hasLongTextNode || false,
      isDataTag: args.isDataTag || false,
      hasIgnoreClasses: args.hasIgnoreClasses || false,
      hasInlineLink: args.hasInlineLink || false,
      isInlineLink: args.isInlineLink || false,
    };
  }

  function mergeScore(score1, score2) {
    score1.wordsCount += score2.wordsCount;
    score1.recipeWordsCount += score2.recipeWordsCount;
    score1.insideLinkWordsCount += score2.insideLinkWordsCount;
    score1.contentTagsCount += score2.contentTagsCount;
    score1.aTagsCount += score2.aTagsCount;
    score1.imgTagsCount += score2.imgTagsCount;
    score1.hasLongTextNode = score1.hasLongTextNode || score2.hasLongTextNode;
    score1.hasIgnoreClasses = score1.hasIgnoreClasses || score2.hasIgnoreClasses;
    score1.hasInlineLink = score1.hasInlineLink || score2.hasInlineLink;
  }

  function isNonLinkInlineContent(el) {
    var score = el.scores[SCORE_KEY];
    return score.wordsCount !== score.insideLinkWordsCount && (
      el.parent.node.getAttribute('data-pf_style_display') !== 'none' && (
        el.node.nodeType === Node.TEXT_NODE ||
        el.node.getAttribute('data-pf_style_display') === 'inline'
      )
    );
  }

  function hasInlineLink(el) {
    var result = false;
    el.forEachChild(function(child) {
      if (child.scores[SCORE_KEY].isInlineLink) {
        result = true;
        return DomScorerModifier.Intents.BREAK;
      }
    });
    return result && !isShortDescription(el);
  }

  /** Checks if element is a short summary */
  function isShortDescription(el) {
    var text = el.node.textContent;
    return !!$.trim(text).match(PREVIEW_TEXT_END_REGEXP);
  }

  function isInlineLink(el) {
    var prevContentEl = null;
    var prevChild = el.prev;

    while(prevChild) {
      if($.trim(prevChild.node.textContent)) {
        prevContentEl = prevChild;
        break;
      }
      prevChild = prevChild.prev;
    }

    if (prevContentEl && isNonLinkInlineContent(prevContentEl)) { return true; }

    return false;
  }
  /**
   * Checks whenever element one of top or bottom elements of candidate
   * @param {HTMLElement} candidate
   * @param {Element} el
   */
  function isOnEdgeOf(candidate, el) {
    var layerLength = el.depthLayer.length;
    var index = el.depthLayerIndex;

    var topEdge = Math.ceil(layerLength * EDGE_PERCENT);
    var bottomEdge = Math.floor(layerLength - layerLength * EDGE_PERCENT);
    return index <= topEdge || index >= bottomEdge;
  }

  function buildTextScore(el, contentTagsCount) {
    contentTagsCount = contentTagsCount || 0;

    if (isShortDescription(el)) { return buildScore(); }

    var text = el.node.textContent;
    var words = sliceWordsService(text);
    var wordsCount = words.length;
    var recipeWordsCount = 0;
    for (var i = 0; i < wordsCount; i++) {
      if (helper.isRecipeIngredient(words[i])) { recipeWordsCount++; }
    }

    return buildScore({
      wordsCount: wordsCount,
      recipeWordsCount: recipeWordsCount,
      hasLongTextNode: wordsCount >= LONG_TEXT_THRESHOLD,
      contentTagsCount: contentTagsCount
    });
  }

  function calcScore(el) {
    if (el.node.nodeType === Node.TEXT_NODE) { return buildTextScore(el); }
    if (el.node.nodeName === 'P' && el.node.parentNode && isContentNodeHelperService(el.node.parentNode)) { return buildTextScore(el, 1); }

    var result = mergeChildrenScoreHelperService(el, SCORE_KEY, buildScore(), mergeScore);

    var nodeName = el.node.nodeName;
    switch(nodeName) {
      case "A":
        if (el.node.getAttribute('href') && el.node.getAttribute('rel') !== 'author') {
          result.aTagsCount++;
          result.insideLinkWordsCount = result.wordsCount;
          // NOTE: ignore long text inside A tags
          result.hasLongTextNode = false;
          result.isInlineLink = isInlineLink(el);
        }
        break;
      case "IMG":
        result.imgTagsCount++;
        break;
    }
    // NOTE: calculating tags count which are not just link wrappers but content holders
    if (
      result.wordsCount > 0 &&
      result.wordsCount > result.insideLinkWordsCount &&
      isContentNodeHelperService(el.node) &&
      !el.isWrapper()
    ) {
      result.contentTagsCount++;
    }

    if (DATA_TAGS[nodeName]) {
      result.isDataTag = true;
      result.insideLinkWordsCount = 0;
      result.aTagsCount = 0;
      result.imgTagsCount = 0;
    }
    if (el.nameMatches(IGNORE_CLASSES)) { result.hasIgnoreClasses = true; }
    result.hasInlineLink = result.hasInlineLink || hasInlineLink(el);
    return result;
  }

  function relatedBehavior(el, options) {
    var commonScore = el.scores.common;

    if (
      options.skipRelatedArticlesClassifier ||
      commonScore.hasContentTag && commonScore.uniqWordsCount > MANY_UNIQ_WORDS ||
      (options.candidate && options.candidate.contains(el.node) && !isOnEdgeOf(options.candidate, el))
    ) {
      return;
    }

    var score = el.scores[SCORE_KEY];

    if (score.isDataTag) {
      return DomScorerModifier.Intents.BREAK_TRAVERSAL;
    }

    if (
      score.hasInlineLink ||
      score.hasIgnoreClasses ||
      (score.contentTagsCount > MANY_CONTENT_TAGS_THRESHOLD && commonScore.uniqWordsCount > MANY_UNIQ_WORDS) ||
      score.wordsCount < 5 ||
      score.aTagsCount < 2 ||
      score.imgTagsCount === 1 ||
      score.hasLongTextNode ||
      (score.recipeWordsCount / score.wordsCount) >= RECIPE_DENSITY_THRESHOLD
    ) { return; }

    // NOTE: we ignore cases when difference between images and a tags is too big
    var aTagsCountMatchImgTagsCount = (score.imgTagsCount / score.aTagsCount) < IMG_A_TAGS_MISMATCH_RATIO;
    if (!aTagsCountMatchImgTagsCount) { return; }

    var linkDensity = (score.insideLinkWordsCount / score.wordsCount) || 0;

    if (linkDensity >= LINK_DENSITY_THRESHOLD) {
      el.remove();
      return DomScorerModifier.Intents.BREAK_TRAVERSAL;
    }

    var relatedTagsDensity = (score.aTagsCount + score.imgTagsCount) / (score.contentTagsCount + score.aTagsCount + score.imgTagsCount);
    if (relatedTagsDensity >= RELATED_TAGS_DENSITY_THRESHOLD) {
      el.remove();
      return DomScorerModifier.Intents.BREAK_TRAVERSAL;
    }
  }

  return function setup(scorer) {
    scorer.registerScoreFunction(SCORE_KEY, calcScore);
    scorer.registerBehaviorFunction(relatedBehavior, 'after');
  };
})();

var socialShareClassifier = (function() {
  var SHARE_CLASSES_REGEXP = /fb-like|daftplugPublicFacebookReactionsNotification|daftplugPublicFacebookReactionsNotification_container|daftplugPublicFacebookReactionsNotification_postTitle|daftplugPublicFacebookReactionsNotification_postTitle|socializer-share-bar|PIN_\d+/;
  var SHARE_TERMS = [
    'facebook',
    'google',
    'stumbleupon',
    'reddit',
    'pinterest',
    'printfriendly',
    'yum',
    'twitter',
    'tweet',
    'linkedin',
    'share',
    'shares',
    'print',
    'tumblr',
    'rss',
    'youtube',
    'social'
  ];
  var SHARE_HOSTS = [
    'twitter.com',
    'facebook.com',
    'reddit.com',
    'myspace.com',
    'stumbleupon.com',
    'mix.com',
    'mixx.com',
    'viadeo.com',
    'yummly.com',
    'addthis.com',
    'google.com',
    'pinterest.com',
    'printfriendly.com',
    'mailto:',
    'tumblr.com',
    'linkedin.co',
    'digg.com',
    'whatsapp.com',
    'vk.com',
    'weibo.com',
    'ok.ru',
    'odnoklassniki.ru',
    'xing.com',
    'blogger.com',
    'flipboard.com',
    'meneame.net',
    'mail.ru',
    'icio.us',
    'livejournal.com',
    'delicious.com',
    'youtube.com'
  ];

  var SHARE_SCORE_THRESHOLD = 0.3;
  var UNIQ_WORDS_THRESHOLD = 25;

  var SCORE_KEY = 'shareScore';
  var URL_HOST_REGEXP = /^https?:\/\/([^\.]+\.)*([^\.]+\.[^\.\/]+)\//;

  function buildScore(attrs) {
    attrs = attrs || {};
    return {
      imgsCount: attrs.imgsCount || 0,
      aCount: attrs.aCount || 0,
      hasShareClass: attrs.hasShareClass || false,
      hasShareImage: attrs.hasShareImage || false
    };
  }

  function mergeScore(score1, score2) {
    score1.imgsCount += score2.imgsCount;
    score1.aCount += score2.aCount;
    score1.hasShareImage = score1.hasShareImage || score2.hasShareImage;
  }

  function hasShareClass(el) {
    var classAttr = el.className();
    return !!(classAttr &&  SHARE_CLASSES_REGEXP.test(classAttr));
  }

  function isShareImage(el) {
    if (el.node.tagName !== "IMG") { return false; }

    // NOTE: checks if next sibling contains group of A tags
    var currentSibling = el.node.nextElementSibling;
    /* jshint -W084 */
    while (currentSibling) {
      if ($(currentSibling).find('a').length > 1) { return true; }
      currentSibling = currentSibling.nextElementSibling;
    }
    return false;
  }

  function calcShareScore(el) {
    var initialScore = buildScore({
      hasShareClass: hasShareClass(el),
      hasShareImage: isShareImage(el)
    });
    var result = mergeChildrenScoreHelperService(el, SCORE_KEY, initialScore, mergeScore);

    switch(el.node.nodeName) {
      case "IMG":
        result.imgsCount++;
        break;
      case "A":
        result.aCount++;
        break;
    }

    result.hasShareClass = hasShareClass(el);
    return result;
  }

  function sumAccObject(acc) {
    var totalCount = 0;
    for(var key in acc) {
      if (typeof acc[key] === 'number') {
        totalCount += acc[key];
      }
    }
    return totalCount;
  }

  function calcOccurrencesAndTotalFor(shareRelatedArray, acc) {
    var relatedCount = 0;
    var relatedUniqCount = 0;

    for (var i = 0, length = shareRelatedArray.length; i < length; i++) {
      var related = shareRelatedArray[i];
      var accCount = acc.get(related);
      if (accCount) {
        relatedUniqCount++;
        relatedCount += accCount;
      }
    }

    var totalCount = sumAccObject(acc.store);
    var totalUniqCount = acc.size;

    return {
      relatedCount: relatedCount,
      totalCount: totalCount,
      relatedUniqCount: relatedUniqCount,
      totalUniqCount: totalUniqCount,
      ratio: (relatedCount / totalCount) || 0
    };
  }

  function calcPoints(el) {
    var score = el.scores[SCORE_KEY];

    if (score.hasShareImage) { return 0; }

    if (score.hasShareClass) { return 1; }

    var wordsOccurrences = calcOccurrencesAndTotalFor(SHARE_TERMS, el.scores.common.words);

    if (wordsOccurrences.totalUniqCount > UNIQ_WORDS_THRESHOLD) { return 0; }

    var linksOccurrences = calcOccurrencesAndTotalFor(SHARE_HOSTS, el.scores.common.links);

    var wordsRatio = wordsOccurrences.relatedUniqCount > 1 ? wordsOccurrences.ratio : 0;
    var linksRation = linksOccurrences.relatedUniqCount > 1 ? linksOccurrences.ratio : 0;

    return wordsRatio * 2 + linksRation;
  }

  function shareBehavior(el) {
    if (!el.children.length) { return DomScorerModifier.Intents.DO_NOTHING; }
    var classAttr = el.className();
    var tagName = el.node.tagName;
    // NOTE: keep blockquote.twitter-tweet in order to prevent twitter widgets removal
    if (
      tagName === 'TWITTER-WIDGET' ||
      tagName === "BLOCKQUOTE" && classAttr.indexOf('twitter-tweet') >= 0
    ) {
      el.keep();
      return DomScorerModifier.Intents.BREAK_TRAVERSAL;
    }

    if (calcPoints(el) > SHARE_SCORE_THRESHOLD) {
      el.remove();
      return DomScorerModifier.Intents.BREAK_TRAVERSAL;
    }
  }

  return function setup(scorer) {
    scorer.registerScoreFunction(SCORE_KEY, calcShareScore);
    scorer.registerBehaviorFunction(shareBehavior);
  };
})();
/** Returns the DomScorerModifier prototype */
var DomScorerModifier = (function() {
  var NODE_KEY = '__DOM_SCORER_ELEMENT__';

  var Intents = {
    DO_NOTHING: 'DO_NOTHING',
    BREAK_TRAVERSAL: 'BREAK_TRAVERSAL',
    BREAK: 'BREAK'
  };

  function isEmptyTextNode(node) {
    return node.nodeType === Node.TEXT_NODE && !$.trim(node.nodeValue);
  }

  /**
   * @returns {Element}
  */
  function toElem(node) {
    return (node instanceof Element) ? node : node[NODE_KEY];
  }

  /**
   * Element represents a node in DOM with calculated scores
   * Also it gives some utils methods for fast tree traversal
   * @param {DOMNode} args.node - real {DOMNode}
   * @param {Element} args.parent - parent {Element}
   * @param {Tree} args.tree
   * @param {Number} args.depth - depth inside a {Tree}
   * @param {Element} args.prev - previous element in the same layer
   */
  function Element(args) {
    this.node = args.node;
    this.node[NODE_KEY] = this;
    this.parent = args.parent;
    this.tree = args.tree;
    this.depth = args.depth || 0;
    this.scores = {};
    this.skipped = false;
    this.hasScore = false;
    this.keptChildren = [];
    this.children = [];
    this.prev = args.prev || null;
    this.next = null;
    this.depthLayer = [];
    this.depthLayerIndex = -1;
  }
  /**
   * Marks element as skip during traversal
   * useful if we don't want to run `behaviorFunctions` on element
   */
  function markSkip(el) {
    if (!el.parent) { return; }
    el.skipped = true;
  }
  /**
   * Marks element as keep during traversal
   * useful if we don't want to remove element and its parents
   */
  function markKept(el, child) {
    var currentEl = el;
    while(currentEl) {
      currentEl.keptChildren.push(child);
      currentEl = currentEl.parent;
    }
  }

   /**
   * Checks if element has some additional content or it's just a wrapper
   * @returns {Boolean}
   */
  Element.prototype.isWrapper = function() {
    if (this.children.length === 0) { return false; }

    var childrenText = this.children.reduce((acc, c) => acc + c.scores.common.words.size, 0)
    return childrenText === this.scores.common.words.size;
  };

  /**
   * Checks whenever Element#node has an `id`
   */
  Element.prototype.hasId = function(idVal) {
    if (!this.isElement()) { return false; }

    var idAttr = this.node.getAttribute('id') || '';
    return idAttr.split(/\s/).indexOf(idVal) >= 0;
  };

  /**
   * Checks whenever Element#node has a `class`
   */
  Element.prototype.hasClass = function(classVal) {
    if (!this.isElement()) { return false; }

    var classAttr = this.node.getAttribute('class') || '';
    return classAttr.split(/\s/).indexOf(classVal) >= 0;
  };

  /**
   * Checks whenever Element#node has a `tagName`
   */
  Element.prototype.hasTagName = function(tagNameValue) {
    if (!this.isElement()) { return false; }

    return this.node.tagName.toLowerCase() === tagNameValue.toLowerCase();
  };

  /**
   * Checks whenever Element#node has match `class`, `id` or `tagName`
   */
  Element.prototype.nameMatches = function(match) {
    if (!this.isElement()) { return false; }

    var idAttr = this.node.getAttribute('id') || '';
    var classAttr = this.node.getAttribute('class') || '';
    var tagName = this.node.tagName;

    return !![tagName, idAttr, classAttr].join(' ').match(match);
  };

  /**
   * Returns class name of element
   */
  Element.prototype.className = function() {
    if (this.isElement()) { return (this.node.getAttribute('class') || ''); }
    return '';
  };

  /**
   * Checks whenever Element#node has a `tagName`
   */

  Element.prototype.isElement = function () {
    return this.node.nodeType === Node.ELEMENT_NODE;
  };

  /**
   * Iterates through all element child
   */
  Element.prototype.forEachChild = function(callback, includeSkipped) {
    for(var i = 0, length = this.children.length; i < length; i++) {
      if (includeSkipped === true || !this.children[i].skipped) {
        if (callback(this.children[i], i) === Intents.BREAK) { break; }
      }
    }
  };
  /**
   * Keeps element and its' children in DOM Tree
   */
  Element.prototype.keep = function() {
    markSkip(this);
    if(this.parent) { markKept(this.parent, this); }
  };

  /**
   * Marks element to skip during traversal
   */
  Element.prototype.skip = function() {
    markSkip(this);
  };

  /**
   * Remove element from parent children and remove DOMNode from DOM
   */
  Element.prototype.remove = function remove() {
    if(this.skipped) { return; }

    markSkip(this);
    if (!this.node.parentNode || this.node === this.tree.root.node || this.node.nodeName === 'BODY') { return; }
    if (this.keptChildren.length) {
      var wrapper = this.tree.createElement('DIV');
      this.parent.replaceChild(wrapper, this);
      for(var i = 0, length = this.keptChildren.length; i < length; i++) {
        wrapper.appendChild(this.keptChildren[i]);
      }
    } else {
      this.node.parentNode.removeChild(this.node);
    }
  };

   Element.prototype.setDepthLayer = function(layer) {
    this.depthLayer = layer;
    this.depthLayerIndex = layer.length - 1;
  };

  Element.prototype.lastChild = function() {
    return this.children[this.children.length - 1];
  };

  Element.prototype.appendChild = function(node) {
    if (node instanceof Node && node.nodeType !== Node.ELEMENT_NODE) {
      this.node.appendChild(node);
      return;
    }
    var elem = toElem(node);
    var lastChild = this.lastChild();
    if (lastChild) {
      lastChild.next = elem;
      elem.prev = lastChild;
    }
    elem.depth = this.depth + 1;
    if (elem.parent && elem.parent.children.length) {
      elem.parent.children.splice(elem.parent.children.indexOf(elem), 1);
    }
    elem.parent = this;
    this.children.push(elem);
    this.node.appendChild(elem.node);
  };

  /**
   * Analog of `replaceChild` for {DOMNode} but also transfers all related {Element} information
   * @param {DOMNode|Element} newNode
   * @param {DOMNode|Element} oldNode
   */
  Element.prototype.replaceChild = function(newNode, oldNode) {
    var newElement = toElem(newNode);
    var oldElement = toElem(oldNode);

    newElement.parent = this;
    newElement.depth = this.depth + 1;

    newElement.scores = oldElement.scores;
    newElement.skipped = oldElement.skipped;
    newElement.keptChildren = oldElement.keptChildren;
    newElement.children = oldElement.children;
    newElement.prev = oldElement.prev;
    newElement.next = oldElement.next;

    oldElement.parent = null;
    oldElement.depth = 0;
    oldElement.prev = null;
    oldElement.next = null;
    oldElement.children = [];

    var index = this.children.indexOf(oldElement);
    if (index >= 0) {
      this.children[index] = newElement;
    } else {
      this.children.push(newElement);
    }

    this.node.replaceChild(newElement.node, oldElement.node);
  };

  /**
   * Its a tree structure for DOM traversal purposes
   * @param {*} rootNode - Node(usually it's a `document.body`)
   */
  function Tree(rootNode, scorer) {
    this.root = new Element({ tree: this, node: rootNode });
    this.scorer = scorer;
    this.depthLayers = [[this.root]];
    this.depthLayersIndex = {};
    this.root.setDepthLayer(this.depthLayers[0]);

    var queue = [this.root];
    var self = null;

    /* jshint -W084 */
    while(self = queue.shift()) {
      var prevLayerChild = null;

      for (var i = 0, length = self.node.childNodes.length; i < length; i++) {
        var cNode = self.node.childNodes[i];
        if (isEmptyTextNode(cNode) || cNode.nodeType === Node.COMMENT_NODE || cNode.tagName === 'SCRIPT') { continue; }
        var newChild = new Element({
          tree: self.tree,
          parent: self,
          node: cNode,
          depth: self.depth + 1,
          prev: prevLayerChild
        });
        this.depthLayers[newChild.depth] = this.depthLayers[newChild.depth] || [];
        this.depthLayers[newChild.depth].push(newChild);
        newChild.setDepthLayer(this.depthLayers[newChild.depth]);
        if(prevLayerChild) { prevLayerChild.next = newChild; }
        prevLayerChild = newChild;
        self.children.push(newChild);
        queue.push(newChild);
      }
    }
  }

  /**
   * Creates an Element inside a tree
   * @param {String} tagName
   * @returns {Element}
   */
  Tree.prototype.createElement = function(tagName) {
    return new Element({ node: document.createElement(tagName), tree: this });
  };

  /**
   * Creates an TextNode inside a tree
   * @param {String} tagName
   * @returns {Element}
   */

  Tree.prototype.createTextNode = function(text) {
    return new Element({ node: document.createTextNode(text), tree: this });
  };

  /**
   * Tree traversal in Breadth-first
   * https://en.wikipedia.org/wiki/Tree_traversal#Breadth-first_search_2
   */
  Tree.prototype.breadthFirstTraversal = function(callback) {
    var queue = [];
    queue.push(this.root);
    var element = null;
    /* jshint -W084 */
    while (element = queue.shift()) {
      if (callback(element) === Intents.BREAK_TRAVERSAL) { break; }
      for (var i = 0, length = element.children.length; i < length; i++) {
        var childElement = element.children[i];
        queue.push(childElement);
      }
    }
  };

  /**
   * Tree traversal in pre-order
   * https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR)
   */
  Tree.prototype.preOrderTraversalWithElementSkip = function(callback, el) {
    el = el || this.root;

    var queue = [el];
    var currentEl = null;
    /* jshint -W084 */
    while (currentEl = queue.shift()) {
      if (currentEl.skipped || callback(currentEl) === Intents.BREAK_TRAVERSAL) { continue; }

      for(var i = 0, length = currentEl.children.length; i < length; i++) { queue.push(currentEl.children[i]); }
    }
  };

  /**
   * Tree traversal in post-order
   * https://en.wikipedia.org/wiki/Tree_traversal#Post-order_(LRN)
   */
  Tree.prototype.postOrderTraversal = function(callback, el) {
    el = el || this.root;
    var postOrderNodes = [];
    var stack = [el];
    var currentEl = null;
    /* jshint -W084 */
    while (currentEl = stack.pop()) {
      if (currentEl.skipped) { continue; }
      postOrderNodes.push(currentEl);
      for(var i = 0, length = currentEl.children.length; i < length; i++) { stack.push(currentEl.children[i]); }
    }
    var j = postOrderNodes.length;
    while(j--) { callback(postOrderNodes[j]); }
  };

  /**
  * Represents a TreeWalkerService.
  * 1. This service initialize `Tree` with `document.body` and registers `scoreFunctions` and `behaviorFunctions`
  * 2. `scoreFunctions` are calculated for each `Element` during `Tree` post-order  traversal
  * 3. `behaviorFunctions` are triggered for each `Element` during `Tree` pre-order traversal
  *
  * @constructor
  */

  function DomScorerModifier() {
    this.tree = new Tree(document.body, this);
    this.scoreFunctions = {};
    this.markFunctions = [];
    this.behaviorFunctions = { before: [], after: [] };
  }

  DomScorerModifier.toElem = toElem;
  DomScorerModifier.Intents = Intents;
  DomScorerModifier.elementFor = function(node) {
    while(node) {
      if(node[NODE_KEY]) { return node[NODE_KEY]; }
      if(node.childElementCount > 1) { return; }
      node = node.firstElementChild;
    }
  };

  function markAndCalcScoreElement(domScorer, element) {
    for(var i = 0, length = domScorer.markFunctions.length; i < length; i++) {
      var tuple = domScorer.markFunctions[i];
      tuple[0](element, tuple[1]);
    }

    for(var scoreName in domScorer.scoreFunctions) {
      var func = domScorer.scoreFunctions[scoreName];
      element.scores[scoreName] = func(element);
    }
    element.hasScore = true;
  }

  /**
   * Registers score function which will assign the score result
   * to each `Element` during post-order traversal
   *
   * `element.scores[scoreName] = callback(el)`
   */
  DomScorerModifier.prototype.registerScoreFunction = function(scoreName, callback) {
    this.scoreFunctions[scoreName] = callback;
  };

  /**
   * Registers mark function which will mark with skip or remove
   * each `Element` during post-order traversal
   */
  DomScorerModifier.prototype.registerMarkFunction = function(callback, options) {
    this.markFunctions.push([callback, options]);
  };

  function traverseElements(domScorer, type, options) {
    domScorer.tree.postOrderTraversal(function(el){ if (!el.hasScore) { markAndCalcScoreElement(el.tree.scorer, el); } });
    domScorer.tree.preOrderTraversalWithElementSkip(function (el) {
      for(var i = 0, length = domScorer.behaviorFunctions[type].length; i < length; i++) {
        var behaviorCallback = domScorer.behaviorFunctions[type][i];
        if (behaviorCallback(el, options) === Intents.BREAK_TRAVERSAL) {
          return Intents.BREAK_TRAVERSAL;
        }
      }
    });
  }

  /**
   * Registers remove function which will remove `Element` from the `Tree` during pre-order traversal
   * in case callback returns `true`
   *
   * ```
   * if (callback(element) === true) { element.remove() }
   * ```
   * @param {*} callback - behavior callback
   * @param {string} [type=before] - one of 'before' or 'after'
   */
  DomScorerModifier.prototype.registerBehaviorFunction = function(callback, type) {
    if (!type) { type = 'before'; }
    this.behaviorFunctions[type].push(callback);
  };

  /**
   * Starts the `TreeWalkerService` with registered functions
   */
  DomScorerModifier.prototype.markAndCalcScore =  function() {
    var self = this;
    this.tree.postOrderTraversal(function (el) { markAndCalcScoreElement(self, el); });
  };

  DomScorerModifier.prototype.rebuildTree = function() {
    this.tree = new Tree(document.body, this);
    this.markAndCalcScore();
  };

  /**
   * Launches registered before behaviour functions
   */
  DomScorerModifier.prototype.beforeRunner = function() {
    traverseElements(this, 'before');
  };

  /**
   * Launches registered after behaviour functions
   */
  DomScorerModifier.prototype.afterRunner = function(options) {
    this.tree.root = toElem(options.candidate);
    traverseElements(this, 'after', options);
  };

  return DomScorerModifier;
})();
var isContentNodeHelperService = (function() {
  var NON_CONTENT_NODE_NAMES = [
    'SCRIPT',
    'STYLE',
    'NOSCRIPT',
    'APPLET',
    'EMBED',
    'OBJECT',
    'PARAM',
    'IFRAME',
  ];

  return function (node) {
    return NON_CONTENT_NODE_NAMES.indexOf(node.nodeName) < 0;
  };
})();
var mergeChildrenScoreHelperService = (function() {
  return function(el, key, startScore, mergeFunc) {
    for (var i = 0, length = el.children.length; i < length; i++) {
      var child = el.children[i];
      mergeFunc(startScore, child.scores[key]);
    }
    return startScore;
  };
}());
var sliceWordsService = (function() {
  var WORDS_SEPARATOR_REGEXP = /[^\^|\s|\$|\.|,|!|\?|\)|\(|"|\')]{2,}/g;

  return function(text, callback) {
    return $.trim(text).toLowerCase().match(WORDS_SEPARATOR_REGEXP) || [];
  };
}());


/**
 * Setups DomScorerModifier with all cleaners services and runs it
 */
var runDomScorerModifier = function (options) {
  var scorer = new DomScorerModifier();
  commonScore(scorer);

  mustKeepClassifier(scorer, options);
  headerFooterClassifier(scorer);
  socialShareClassifier(scorer);
  relatedArticlesClassifier(scorer);
  doubleBrClassifier(scorer);
  emptyTagsClassifier(scorer);
  advertisementClassifier(scorer);
  scorer.markAndCalcScore();
  return scorer;
};
var printYesUtils = (function() {
  var CLASS_NAME = '.print-yes';
  var DEFAULT_POSITION = "after-main";
  var DEFAULT_ORDER_START = 100000;
  function sortByPrintOrder(nodesArray) {
    return nodesArray.sort(function(a, b) {
      var orderA = parseInt(a.dataset.pfPrintOrder, 10);
      var orderB = parseInt(b.dataset.pfPrintOrder, 10);
      return orderA - orderB;
    });
  }

  function filterInsideElements(printYesIds, elements) {
    var result = [];
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (printYesIds.indexOf(element.dataset.pfPrintYesId) < 0) {
        result.push(element);
      }
    }

    return result;
  }

  function cleanPFStyleAttrs(array) {
    array.map(function(el) {
      $(el).find('[data-pf_style_display], [data-pf_style_visibility]').removeAttr('data-pf_style_display').removeAttr('data-pf_style_visibility')
    });
  }

  return {
    extract: function (root) {
      var result = { "after-main": [], "before-main": []};
      var defaultOrder = DEFAULT_ORDER_START;
      var id = 1;
      $(root).find(CLASS_NAME).each(function() {
        var position = this.dataset.pfPrintPosition || DEFAULT_POSITION;
        if (!this.dataset.pfPrintOrder) {
          this.dataset.pfPrintOrder = defaultOrder;
          defaultOrder++;
        }
        this.dataset.pfPrintYesId = id;
        id++;
        result[position].push(this);
      });

      result["after-main"] = sortByPrintOrder(result["after-main"]);
      result["before-main"] = sortByPrintOrder(result["before-main"]);
      return result;
    },
    apply: function (root, printYesResult) {
      var $root = $(root);
      var printYesIds = [];
      $root.find("[data-pf-print-yes-id]").each(function() { printYesIds.push(this.dataset.pfPrintYesId); });
      $root.prepend(filterInsideElements(printYesIds, printYesResult["before-main"]));
      $root.append(filterInsideElements(printYesIds, printYesResult["after-main"]));
      cleanPFStyleAttrs(printYesResult['before-main'])
      cleanPFStyleAttrs(printYesResult['after-main'])
    }
  };
})();
var userSettingsSelectorService = (function() {
  function metaContentFor(settingsEntry){
    return helper.metaContentAttr(settingsEntry.attributeName, settingsEntry.attributeValue);
  }

  function showError() {
    return pfData.userSettings.fallbackStrategy === 'error-message';
  }

  function isValidUrl(urlString) {
    try {
      return Boolean(new URL(urlString));
    }
    catch(e){
      return false;
    }
  }

  return {
    keepStyleResult: function() {
      return {type: 'boolean', value: pfData.userSettings.keepStyle};
    },
    authorSelectorResult: function() {
      if (!pfData.userSettings.authorSelector) { return; }

      if (pfData.userSettings.authorSelector.type === 'selector') {
        var $authorNode = $(pfData.userSettings.authorSelector.value);
        if ($authorNode.length) { return {type: 'node', value: $authorNode}; }
      } else if (pfData.userSettings.authorSelector.type === 'meta') {
        var metaContent = metaContentFor(pfData.userSettings.authorSelector);

        if (metaContent && metaContent.length) {
          return {type: 'text', value: metaContentFor(pfData.userSettings.authorSelector)};
        }
      }

      if (showError()) {
        return {
          type: 'text',
          value: 'Unable to find author specified by the selectors "' + pfData.userSettings.authorSelector.value + '"'
        };
      }
    },

    dateSelectorResult: function() {
      if (!pfData.userSettings.dateSelector) { return; }

      if(pfData.userSettings.dateSelector.type === 'selector') {
        if ($(pfData.userSettings.dateSelector.value).length === 1) { return { type: 'selector', value: pfData.userSettings.dateSelector.value }; }
      } else if (pfData.userSettings.dateSelector.type === 'meta') {
        return { type: 'text', value: metaContentFor(pfData.userSettings.dateSelector) };
      }

      if (showError()) {
        return { type: 'text', value: 'Unable to find date specified by the selectors "' + pfData.userSettings.dateSelector.value + '"' };
      }
    },

    removeSelectorResult: function() {
      if (
        pfData.userSettings.removeSelectors &&
        pfData.userSettings.removeSelectors.type === 'selector' &&
        pfData.userSettings.removeSelectors.value.length
      ) {
        return {type: 'selector', value: pfData.userSettings.removeSelectors.value};
      }
    },

    titleSelectorResult: function() {
      if(!pfData.userSettings.titleSelector) { return; }

      if (pfData.userSettings.titleSelector.type === 'selector') {
        var $node = $(pfData.userSettings.titleSelector.value);
        if ($node.length) {
          logger.log("Picking title using userSettings.titleSelector");
          return {type: 'node', value: $node};
        }
      } else if (pfData.userSettings.titleSelector.type === 'meta') {
        var metaContent = metaContentFor(pfData.userSettings.titleSelector);
        if (metaContent && metaContent.length) {
          logger.log("Picking title using userSettings.titleSelector");
          return {type: 'node', value: $('<div>' + metaContent + '</div>')};
        }
      }

      if (showError()) {
        return {
          type: 'node',
          value: $('<div>Unable to find title specified by the selectors "' + pfData.userSettings.titleSelector.value + '"</div>')
        };
      }
    },

    contentSelectorResult: function() {
      if (!pfData.userSettings.contentSelectors || pfData.userSettings.contentSelectors.type !== 'selector') { return; }
      var $node = $(pfData.userSettings.contentSelectors.value);
      if ($node.length) { return {type: 'node', value: $node}; }

      if (showError()) {
        return {type: 'text', value: 'Unable to find content specified by the selectors "' + pfData.userSettings.contentSelectors.value + '"' };
      }
    },

    primaryImageSelectorResult: function() {
      if (pfData.userSettings.primaryImage && pfData.userSettings.primaryImage.value) {
        if (isValidUrl(pfData.userSettings.primaryImage.value)) {
          return { type: 'url', value: pfData.userSettings.primaryImage.value };
        }
      }

      if (!pfData.userSettings.primaryImageSelector) { return; }

      if (pfData.userSettings.primaryImageSelector.type === 'selector') {
        var $primaryImg = $(pfData.userSettings.primaryImageSelector.value);
        if ($primaryImg.length) { return {type: 'node', value: $primaryImg[0]}; }
      } else if (pfData.userSettings.primaryImageSelector.type === 'meta') {
        var metaContent = metaContentFor(pfData.userSettings.primaryImageSelector);
        var metaImg = document.createElement('IMG');

        if (pfData.onServer) {
          var url = toAbsoluteUrl(metaContent, pfData.page.location);
          metaImg.setAttribute('pf-restore-src', url);
          metaImg.setAttribute('pf-orig-src', url);
        } else {
          metaImg.src = metaContent;
        }
        return {type: 'node', value: metaImg};
      }

      if (showError()) {
        var img = document.createElement('IMG');
        img.setAttribute('alt', 'Unable to find primary image specified by the selectors "' + pfData.userSettings.primaryImageSelector.value + '"');
        return {type: 'node', value: img};
      }
    }
  };
})();
var persistComputedStylesAndRect = (function() {
  var STYLES_TO_SAVE = ['display', 'visibility'];
  var RECT_TO_SAVE = ['width', 'height'];
  var PREFIX = 'pf';

  function persistObject(node, object, propsToSave, objPrefix) {
    for(var i = 0, length = propsToSave.length; i < length; i++) {
      var prop = propsToSave[i];
      var key = [PREFIX, objPrefix, prop].join('_');
      node.dataset[key] = object[prop];
    }
  }

  function parentIsNotVisible(node) {
    var parent = node.parentElement;
    if (!parent) { return false; }
    return parent.getAttribute('data-pf_style_display') === 'none' || parent.getAttribute('data-pf_style_visibility') === 'hidden';
  }

  return function persistComputedStylesAndRect(node) {
    if(parentIsNotVisible(node)) {
      node.dataset.pf_style_display = 'none';
      node.dataset.pf_style_visibility = 'hidden';
      return;
    }

    var style = node.currentStyle || window.getComputedStyle(node);
    if (style) { persistObject(node, style, STYLES_TO_SAVE, 'style'); }
    var rect = node.getBoundingClientRect && node.getBoundingClientRect();
    var nodeName = node.nodeName.toUpperCase();
    if (nodeName === 'IMG' || nodeName === 'SVG' || nodeName === 'IFRAME') {
      if (rect) { persistObject(node, rect, RECT_TO_SAVE, 'rect'); }
    }
  };
})();
function copyDataset(destination, source) {
  for (var key in source.dataset) { destination.dataset[key] = source.dataset[key]; }
};
/**
 * Converts NodeList to array to be able to iterate over it even if it's dynamically changes(ex. removing, adding etc.)
 * and pass each element to callback
 * @param {Node} node
 * @param {Function} callback
 */
function forEachNodeChild(node, callback) {
  if (!node) { return; }
  var arr = Array.prototype.slice.call(node.childNodes);
  for(var i = 0, length = arr.length; i < length; i++) {
    callback(arr[i]);
  }
};
var toAbsoluteUrl = (function() {
  var absoluteUrlRegexp = /^https?:\/\//i;
  return function(src, pfConfigLocation) {
    if(!src) { return src; }
    var js = ['javascript', ':'].join('');

    if (src.startsWith(js)) {
      return src;
    } else if (src.startsWith('#')) {
      return src;
    } else if (absoluteUrlRegexp.test(src)) {
      return src;
    } else if (src.startsWith('//')) {
      return pfConfigLocation.protocol + src;
    } else {
      var imageDomain = pfConfigLocation.protocol + '//' + pfConfigLocation.host;
      if (!src.startsWith('/')) { src = '/' + src; }
      return imageDomain + src;
    }
  };
})();
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
  
var applicationLd = (function() {
  return {
    extractTitle: function(applicationLdJson) {
      if (applicationLdJson) {
        if (applicationLdJson.headline) {
          return applicationLdJson.headline.trim();
        } else if (applicationLdJson.name) {
          return applicationLdJson.name.trim();
        }
      }
    },
    extractAuthor: function(applicationLdJson) {
      if (applicationLdJson && applicationLdJson.author) {
        if (applicationLdJson.author.name && typeof applicationLdJson.author.name === "string") {
          return applicationLdJson.author.name;
        } else if (Array.isArray(applicationLdJson.author) && applicationLdJson.author[0] && typeof applicationLdJson.author[0].name === "string") {
          var result = [];
          $.each(applicationLdJson.author, function(i, author) {
            if (author && typeof author.name === 'string') {
              result.push(author.name.trim());
            }
          });
          if(result.length) {
            return result.join(', ');
          }
        }

        if (applicationLdJson['@graph'] && Array.isArray(applicationLdJson['@graph'])) {
          var personNode;
          $.each(applicationLdJson['@graph'], function(i, node) {
            if (node['@type'] === 'Person') {
              personNode = node;
              return false;
            }
          });
          if (personNode && personNode.name && typeof personNode.name === 'string') {
            return personNode.name;
          }
        }
      }
    }
  };
})();
// https://github.com/gustf/js-levenshtein/blob/master/index.js
var levenshteinDistance = (function () {
  function _min(d0, d1, d2, bx, ay) {
    return d0 < d1 || d2 < d1 ? d0 > d2 ? d2 + 1 : d0 + 1 : bx === ay ? d1 : d1 + 1;
  }

  return function (a, b) {
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    var len = vector.length - 1;

    for (; x < lb - 3; ) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = x += 4;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb; ) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
  };
})();

var cleanImgFromPatterns = (function () {
  var QUERY_STRING_PARAMETERS_TO_CLEAN = ['height', 'h', 'width', 'w', 'q', 'fill', 'bg', 'bgmode', 'quality', 'size', 'crop', 'c', 'scale', 'ih', 'iw', 'thumb', 'fit', 'pad', 'face'];
  var URL_PATTERN_TO_CLEAN = /(width|height|bound|webp|jpg|jpeg|png|lossy|q\d+|\d+x\d+)/gi;

  function cleanQuery(query) {
    if (!query) { return query; }

    var parts = query.split('&');
    var resultParts = [];
    for(var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var key = part.split('=')[0];
      if (QUERY_STRING_PARAMETERS_TO_CLEAN.indexOf(key) >= 0) { continue; }
      resultParts.push(part);
    }

    if(!resultParts.length) { return ''; }
    return '?' + resultParts.join('&');
  }

  function cleanUrl(url) {
    return url.replace(URL_PATTERN_TO_CLEAN, '');
  }

  return function (urlOrPath) {
    var queryPlacement = urlOrPath.indexOf('?');
    var url = urlOrPath
    var query = '';

    if (queryPlacement >= 0) {
      url = urlOrPath.slice(0, queryPlacement);
      query = urlOrPath.slice(queryPlacement + 1);
    }
    return cleanUrl(url) + cleanQuery(query);
  };
})();

if (typeof module !== 'undefined') { module.exports = cleanImgFromPatterns; };
function UUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};















var $doc = $(document);

var pfData = {};
var coreData = {};

var PfAlgoStartHandler = function(payload) {
  $.extend(pfData, payload.pfData);
  setup.start();
};
var pfLoadAlgoCalled = false;
// Scripts communication
messageBus.listen('algo', {
  PfStartAlgo: PfAlgoStartHandler,
  PfContentMaskAndScrollTop: function(payload) {
    $('body').addClass('content-mask').removeClass('content-unmask');
    window.scrollTo(0,0);
  },
  PfContentUnMask: function(payload) {
    $('body').removeClass('content-mask').addClass('content-unmask');
  },
  PfInitAlgoExtension: function(payload) {
    window.extensionRootTabId = parseInt(payload.extensionRootTabId, 10);
    messageBus.postMessage('root', 'PfExtensionAlgoLoaded');
  },
  PfImageToBase64Hook: function(payload) {
    var callback = window.__pfImageToBase64Hooks && window.__pfImageToBase64Hooks[payload.id];
    if(callback) { callback(payload); }
    delete window.__pfImageToBase64Hooks[payload.id];
  },
  PfLoadAlgo: function(payload) {
    if (!pfLoadAlgoCalled) {
      pfLoadAlgoCalled = true;
      var pfData = payload.pfData;
      var urls = pfData.config.urls;

      PfAlgoStartHandler(payload);
    }
  }
});

var setup = {
  counter: 0,
  defaultHtml: "",
  init: function() {
    this.counter += 1;
    if ( this.counter < 30 && !document.body ) {
      return setTimeout(function(){setup.init();}, 13 * this.counter);
    }

    messageBus.postMessage('core', 'PfAlgoLoaded');
  },

  start: function() {
    try {
      logger.init(pfData);
      logger.time('algo.js Time');
      this.defaultHtml = document.body.innerHTML;
      document.body.innerHTML = this.defaultHtml + '<div id="pf-root">' + pfData.page.body + '</div>';
      if(pfData.page.bodyClassList && pfData.page.bodyClassList.length) {
        document.body.setAttribute('class', document.body.getAttribute('class') + ' ' + pfData.page.bodyClassList.join(' '));
      }
      if (!pfData.onServer) {
        // If running on client NSFW check is not needed
        messageBus.postMessage('core', 'PfNSFWChecked', {state:"notNeededForCS", matchedPhrase: ''});
      }

      var scorer = runDomScorerModifier({mustKeepSelectors: pfData.userSettings.contentSelectors});
      setup.detectPlatforms();

      htmlPreProcessor.run(scorer).always(function() {
        setup.removeHiddenContent();
        setup.removePrintNo();
        setup.addAppropriateClasses();
        setup.replaceBackgroundImages();
        readability.extractAuthors();
        readability.extractPubDate();
        primaryImage.find();
        if (pfData.page.enablePrintOnly) {
          readability.extractCopyright();
          readability.extractCustomHeaderFooter();
        }
        setup.cleanHTML(scorer);
        readability.init(scorer);
      });
    } catch(e) {
      helper.runPostAlgoProcesses(contentData);
      logger.log(e);
    }
  },

  hasDomain: function(expectedDomain) {
    return (
      pfData.config.domains.page === expectedDomain ||
      (pfData.config.ssLocation && pfData.config.ssLocation.indexOf(expectedDomain) !== -1)
    );
  },

  detectPlatforms: function() {
    var wpStyleUrl      = /wp-content/i;
    var bloggerStyleUrl = /blogger.com/i;
    var squareSpaceUrl  = /squarespace.com/i;
    var wikihowUrl      = /wikihow.com/i;
    var weeblyUrl       = /weebly.com/i;
    var i;

    var styleSheetHrefs = pfData.config.ssStyleSheetHrefs || pfData.page.csStyleSheetHrefs;

    if (wikihowUrl.test(pfData.config.domains.page) || this.hasDomain('wikihow.com')) {
      pfData.config.platform = 'wikihow';
    } else if (this.hasDomain('nytimes.com')) {
      pfData.config.platform = 'nytimes';
    } else if (this.hasDomain('washingtonpost.com')) {
      pfData.config.platform = 'washingtonpost';
    } else if ($.inArray('mediawiki', pfData.page.bodyClassList) !== -1) {
      pfData.config.platform = 'mediawiki';
    } else {
      var metas = pfData.page.metas;
      for(i = 0; i < metas.length; i++) {
        var meta = metas[i];
        if (meta.name === 'generator' && meta.content === 'blogger') {
          pfData.config.platform = 'blogger';
        } else if (meta.name === 'blogger-template' && meta.content === 'dynamic') {
          pfData.config.platform = 'blogger-dynamic';
        } else if (meta.property === 'al:ios:app_name' && meta.content === 'Medium') {
          pfData.config.platform = 'medium';
        }
      }

      if (pfData.config.platform === 'unknown') {
        for(i = 0; i < styleSheetHrefs.length; i++) {
          var href = styleSheetHrefs[i];

          if (wpStyleUrl.test(href)) {
            pfData.config.platform = 'wordpress';
            break;
          } else if (bloggerStyleUrl.test(href)) {
            pfData.config.platform = 'blogger';
            break;
          } else if (squareSpaceUrl.test(href)) {
            pfData.config.platform = 'squarespace';
            break;
          } else if (weeblyUrl.test(href)) {
            pfData.config.platform = 'weebly';
            break;
          }
        }
      }
    }

    contentData.platform = pfData.config.platform;
  },

  selectorsToRemove: function() {
    var alwaysResult = [
      '.pf-init-iframe',
      '.sociable',
      '#sociable',
      '.addthis',
      '#addthis',
      '.printfriendly',
      '.pf-print',
      '#pf-print',
      '.wp-socializer',
      '.editsection',
      '.a2a_dd',
      '.addtoany_share_save',
      '.addtoany_share_save_container',
      '.simply-social-wrapper',
      '#pf-mask',
      '.social_button',
      '#socialbookmarks',
      '.articleFeedback',
      '.print-no',
      '.no-print',
      '.ftwit',
      '.famos-toolbar',
      '.famos-fstar',
      '.ftwit-drawer'
    ];

    var notPrintOnlyResult = [
      'aside.sidebar',
      '.cufon img.canvas-png',
      '.yarpp-related',
      '#wdsb-share-box',
      '#printfriendly',
      '#print',
      '.linkwithin_outer',
      '#lws_0',
      '#nrelate_related_0',
      '.ccc-widget',
      '#cccwr',
      '.widget-cb',
      '.doncaprio-share-buttons',
      '.st_twitter_hcount',
      '.st_pinterest_hcount',
      '.st_digg_hcount',
      '.st_stumbleupon_hcount',
      '.st_fblike_hcount',
      '.addthis_toolbox',
      '#goog-gt-tt',
      '.skiptranslate',
      '.really_simple_share',
      '.robots-nocontent',
      '#sharebar',
      '.sharebar',
      '.articleExtras',
      '.embed-mod',
      '.pd-rating',
      '.itxtrstimg',
      '.itxthookicon',
      '.w2bPinitButton',
      '#twitter_h',
      '.instaemail',
      '#instaemail-button',
      '.emailbutton',
      '#share_print',
      '.pinit-overlay',
      '.pinit-button',
      '.ngg_images',
      '.mr_social_sharing_wrapper',
      '.mapp-layout',
      '.realtidbits-comments',
      '#newsletter-promo',
      '.newsletter-promo',
      '.sharify-container',
      '.sw-pinit-button',
      '.jetpack-likes-widget-wrapper',
      '.crunchify-social',
      '.post-tags',
      '.postmeta',
      '.hreview-aggregate',
      '.ratingblock',
      '.nc_socialPanel',
      '.outbrain',
      '.related_post',
      '.article-comments-post-wrapper',
      '.articleComments',
      '.modal-dialog',
      '.load-screen',
      'div.article-info img.squared-base',
      '.rev_slider',
      '.social-widget',
      '.jw-player',
      '.xnetvidplayer',
      '.RelatedCoverage-relatedcoverage--LmkKX',
      '.powerinbox',
      '.email-sign-up',
      '.article-prev-next',
      '.related-posts',
      '.related-cne-video-component',
      '#Subscribe',
      '.ColCMostViewed',
      '#ColCFacebook',
      '.amzn-native-container',
      '.hidden-print',
      'div[aria-label="cookieconsent"]',
      "[class*='relatedposts']",
      "[class*='zergnet-widget']",
      // Remove spot.im widgets (comments / share / relative content)
      '[data-spot-id]',
      // Remove Google maps. This class is added by the google maps API. No guarantee
      // that it will remain so. Fragile :(
      '.gm-style',
      // Remove these elements unless the form is specifically marked to be printed using "pf-" directives
      'select', 'textarea', 'label', 'button:not(.lightbox)', 'input',
    ];

    if (pfData.config.platform === 'mediawiki') {
      notPrintOnlyResult.push([
        '.noprint',
        'div#jump-to-nav',
        '.mw-jump',
        'div.top',
        'div#column-one',
        '#colophon',
        '.editsection',
        '.toctoggle',
        '.tochidden',
        'div#f-poweredbyico',
        'div#f-copyrightico',
        'li#viewcount',
        'li#about',
        'li#disclaimer',
        'li#mobileview',
        'li#privacy',
        '#footer-places',
        '.mw-hidden-catlinks',
        'tr.mw-metadata-show-hide-extended',
        'span.mw-filepage-other-resolutions',
        '#filetoc',
        '.usermessage',
        '#ca-delete',
        'span.brokenref',
        '.compact-ambox table .mbox-image',
        '.compact-ambox table .mbox-imageright',
        '.compact-ambox table .mbox-empty-cell',
        '.compact-ambox .hide-when-compact',
        '.check-icon a.new',
        '.geo-nondefault',
        '.geo-multi-punct',
        '.nonumtoc .tocnumber',
        '.toclimit-2 .toclevel-1 ul',
        '.toclimit-3 .toclevel-2 ul',
        '.toclimit-4 .toclevel-3 ul',
        '.toclimit-5 .toclevel-4 ul',
        '.toclimit-6 .toclevel-5 ul',
        '.toclimit-7 .toclevel-6 ul',
        '.mw-special-Watchlist #mw-watchlist-resetbutton',
        '.wpb .wpb-header',
        '.wpbs-inner .wpb-outside',
        '.sysop-show',
        '.accountcreator-show',
        '.inputbox-hidecheckboxes form .inputbox-element',
        '#editpage-specialchars',
        '.wikipedia .ambox',
        '.wikipedia .navbox',
        '.wikipedia .vertical-navbox',
        '.wikipedia .infobox.sisterproject',
        '.wikipedia .dablink',
        '.wikipedia .metadata',
        '.editlink',
        'a.NavToggle',
        'span.collapseButton',
        'span.mw-collapsible-toggle',
        '#content cite a.external.text:after',
        '.nourlexpansion a.external.text:after',
        '.nourlexpansion a.external.autonumber:after',
        '.skin-simple div#column-one',
        '.skin-simple div#f-poweredbyico',
        '.skin-simple div#f-copyrightico',
        '.skin-simple .editsection',
        '#siteNotice',
        'div.magnify',
        '.togglelink',
        '.mw-editsection',
        '.toctitle'
      ]);
    }
    return {
      alwaysRemove: alwaysResult.join(','),
      removeIfNotPrintOnly: notPrintOnlyResult.join(',')
    };
  },

  cleanHTML: function(scorer) {
    $('font').each(function () {
      var span = scorer.tree.createElement('span');
      forEachNodeChild(this, function(child) { span.appendChild(child); });
      DomScorerModifier.toElem(this.parentNode).replaceChild(span, this);
    });

    // find if the article contains password field, we will consider it as signup/signin form
    // Make this check before we remove any elements
    if($doc.find("input[type=password]").length > 0){
      contentData.hasPasswordField = true;
    }
    var toRemove = this.selectorsToRemove();
    $doc.find(toRemove.removeIfNotPrintOnly).filter(':not(body)').addClass('to-remove');

    // Remove AddThis with preceding header
    var $addThis = $doc.find("[class^='addthis_']");
    var $addThisPrev = $addThis.prev();
    if ($addThisPrev.length) {
      var prevText = $addThisPrev.text();
      if (prevText.length < 50 && prevText.toLowerCase().match(/share this|follow us/) !== -1) {
        $addThisPrev.addClass('to-remove');
      }
    }
    $addThis.addClass('to-remove');

    // Keep print-only
    if (pfData.page.enablePrintOnly) {
      var $printOnly = $doc.find('.print-only, #print-only');
      $printOnly.find('.to-remove').addBack().removeClass('to-remove');
    }

    // Remove all marked elements
    $doc.find('.to-remove').remove();
    $doc.find(toRemove.alwaysRemove).remove();

    try {
      $doc.find('#pf-content a').each(function(i) {
        var $this = $(this);

        var content = $.trim($this.html().replace('&nbsp;', ' ', 'g'));
        if (!$this.attr('name') && content === '') {
          $this.remove();
        }
      });

      // Blogger wraps images in a div.separator. Takes up space
      // even after image is hidden
      $doc.find('#pf-content div.separator').each(function(i) {
        var $this = $(this);
        if ($this.children().length == $this.find('a,br').length) {
          $this.addClass('img-separator');
        }
      });

      $doc.find('.pf-caption img, .wp-caption img, .caption img, .tr-caption-container img, .thumbinner img.thumbimage').each(function() {
        $(this).addClass('caption-img');
      });

      $doc.find('.embed-responsive').removeClass('embed-responsive');
    } catch (e) {}
  },

  removePrintNo: function() {
    if (pfData.page.enablePrintOnly) {
      $doc.find('.print-no, .pf-remove').remove();
    }
  },

  hiddenImagesSelectors: ["img[data-ct-lazy]", "img[data-ezsrc]", "img[data-flickity-lazyload]", "img[data-hi-res-src]", "img[data-href]", "img[data-layzr]", "img[data-lazy-src]", "img[data-low-res-src]", "img[data-mediaviewer-src]", "img[data-native-src]", "img[data-opt-src]", "img[data-orig-src]", "img[data-original]", "img[data-original-src]", "img[data-pagespeed-lazy-src]", "img[data-pin-media]", "img[data-raw-src]", "img[data-runner-src]", "img[data-src]", "img[data-tf-src]", "img[data-wpfc-original-src]", "img[datasrc]", "img[nitro-lazy-src]", "img[original]", "img.lazyload", "img.lazyloaded", "img[itemprop=\"url\"]", "img[loading=\"lazy\"]", "img[data-load=\"false\"]", "img.js-progressiveMedia-image", "a[data-replace-image]", "amp-img"],
  removeHiddenContent: function() {
    if (pfData.userSettings.showHiddenContent) { return; }

    if (pfData.page.enablePrintOnly) {
      commonUtils.selectorsNotToBeRemoved.push('.print-only', '#print-only');
    }
    var nodesNotToBeRemoved = $doc.find(commonUtils.selectorsNotToBeRemoved.join(','));
    var hiddenClasses = '';
    nodesNotToBeRemoved.find('.hidden-originally').removeClass('hidden-originally');
    nodesNotToBeRemoved.removeClass('hidden-originally');
    nodesNotToBeRemoved.parents().removeClass('hidden-originally');

    $doc.find(this.hiddenImagesSelectors.join(',')).removeClass('hidden-originally');;

    hiddenClasses += $doc.find(readability.wpContentParentTags.join(', ')).find(readability.wpContentTags.join('.hidden-originally, ') + '.hidden-originally').map( function() { return $(this).attr('class'); } ).get().join(' ');
    hiddenClasses += $doc.find(readability.wpContentParentTags.join('.hidden-originally, ') + '.hidden-originally').map( function() { return $(this).attr('class'); } ).get().join(' ');
    hiddenClasses = hiddenClasses.replace(/hidden-originally/g,'');

    readability.wpContentParentTags = $.grep(readability.wpContentParentTags, function(el, i) { return hiddenClasses.indexOf(el.replace('.','')) === -1; });
    readability.wpContentTags = $.grep(readability.wpContentTags, function(el, i) { return hiddenClasses.indexOf(el.replace('.','')) === -1; });

    $doc.find('.hidden-originally').remove();

    // Remove hidden class which was there in the page originally and which inadvertently
    // cause the page content to be hidden.
    $doc.find('.hidden').removeClass('hidden');
  },

  addAppropriateClasses: function() {
    $('figcaption').parent('figure').addClass('pf-caption');
  },

  replaceBackgroundImages: function() {
    if (pfData.userSettings.bgImageUrlSupport !== 'on') { return; }

    $('[data-pf-style-background-image]').each(function() {
      var $this = $(this);
      var $img = $('<img>').attr('src', $this.attr('data-pf-style-background-image'));

      var attributes = $this.prop("attributes");

      $.each(attributes, function() {
        $img.attr(this.name, this.value);
      });

      $this.replaceWith($img);
    })
  }
};

var logElIdClass = function(el) {
  try {
    var id = el.id ? '#' + el.id : '';
    var className = el.className ? '.' + el.className : '';
    return el.tagName.toLowerCase() + id + className;
  } catch(e) {
    return '';
  }
};

var logEl = function(el) {
  var score = el.readability ? el.readability.contentScore.toFixed(2) : 'undefined';
  return logElIdClass(el) + ' :: Score - ' + score;
};

var contentData = {
  hasContent: false,
  title: "",
  description: "",
  author: "",
  dir: "ltr",
  customHeader: "",
  pubDate: "",
  customFooter: "",
  copyright: "",
  platform: 'unknown',
  content: '',
  contentTextWithTitleAndUrl: '',
  contentTextLength: 0,
  hasPasswordField: false,
  nsfwState: 'unknown',
  nsfwMatchedPhrase: null
};

var config = {
  negativeKeyWords: ['archive', 'bookmark', 'share', 'login', 'aside', 'combx',
    'comment', 'contact', 'foot', 'footer', 'footnote', 'form', 'masthead',
    'meta', 'outbrain', 'related', 'scroll', 'shoutbox', 'sidebar', 'sponsor',
    'shopping', 'tags', 'menu', 'authorp', 'breadcrumb', 'replies',
    'reply'],
  positiveKeyWords: ['article', 'body', 'content', 'entry', 'hentry', 'main',
    'page', 'pagination', 'post', 'blog', 'story', 'ERSIngredientsHeader',
    'ERSHeading', 'ERSSectionHead', 'ingredient', 'ingredients', 'dataTable',
    'wsite-content', 'recipe-list', 'ico-ingridients', 'recipe-info', 'rcps-table-ingredients', 'product',
    'footnote', 'recipe', 'wpurp-recipe-ingredients', 'learn-press-content-item']
};

var COOKING_WORDS_REGEXP = /geraspte|kaas|gekruid|kookboeken|shoarmavlees|kiphaasjes|plakjes|bladerdeeg|oventijd|bereidingstijd|hoofdgerecht|ingredient|ingredients|recipe|salt|egg|eggs|honey|cream|organic|tablespoon|baking|chopped|cup|sugar|flour|rice|oil|salt|garlic|chili|egg|tsp|mozzarella|parmesan|paprika|garlic|tbsp|spoon|cocoa|butter|milk|waniliowy|cytrynowego|jajka|OUNCE|BONELESS|Preheat|oven|ONIONS|pizzico|Mascarpone|Formaggio|Parmigiano|Riso|Sale|pepe|Formaggio|Barbabietole|provola|Parmigiano|grattuggiato|Latte|affumicato|Scalogno|Cannella|Limone|Olio|noce/i;

var readability = {
  version:                '1.7.1',
  flags:                   0x1 | 0x2 | 0x4,   /* Start with all flags set. */
  hasContent: true,
  titleText: null,
  titleTags: ['h1', 'h2', 'h3'],
  wpContentParentTags: ['.single-post article.hentry', '.hentry', '.single-post', '.type-post', 'article'],
  wpContentTags: ['.post-content .fusion-fullwidth', '.article', '.entry-content', '.entry_content',
    '.entry', '.format_text', '.entrytext', '.post-body', '.post-content', '.post-entry',
    '.post_body', '.post_content', '.post_entry', '.post_page-content', '.primary-entry-content'],
  wpPostImageSelectors: ['.hentry .wp-post-image', 'header img.featured-image',
    '.entry-thumb img', '.hentry .featured-thumbnail.large img', '.pinit-overlay img',
    '.post-content .post-img img'],
  // WooCommerce, extract product summary, gallery images and description
  wpWooCommerceSelectors: ['.main .product', '.woocommerce-cart-form', '.cart-collaterals', '.wc-product-table',
    '.product .summary', '#tab-description', '.woocommerce-product-gallery__image', '.woocommerce-product-gallery__image.flex-active-slide .zoomImg',
     '.woocommerce-tabs .woocommerce-Tabs-panel', '[data-widget_type*="woocommerce-product"]'],
  run: 0,
  debugLevel: 1,
  textLimit: 250,
  positiveTags:          ['article'],
  negativeTags:          ['aside', 'nav', 'footer'],

  /* constants */
  FLAG_STRIP_UNLIKELYS:     0x1,
  FLAG_WEIGHT_CLASSES:      0x2,
  FLAG_CLEAN_CONDITIONALLY: 0x4,

  parsedPages: {}, /* The list of pages we've parsed in this call of readability, for autopaging. As a key store for easier searching. */

  unlikelyTags: ['FOOTER'],
  /**
   * All of the regular expressions in use within readability.
   * Defined up here so we don't instantiate them repeatedly in loops.
   **/
  regexps: {
    unlikelyCandidates:    /combx|disqus|rss|shoutbox|ad-break|agegate|logo|header/i,
    unlikelyCandidatesNavigation: /menu|sidebar|pagination|related-posts/i,
    primaryImageUnlikelyParents: /secondary|boxzilla/i,
    okMaybeItsACandidate:  /content|and|article|body|column|main|extra|shadow|rightmen|header|content-sidebar-wrap|content-with-sidebar-wrp|pk_left_sidebar|artpag|has-sidebar|node-blog-entry|with-sidebar|widget-content|sp_sidebar|nd-no-sidebars|onecol-sidebar|page|financity-sidebar-wrap/i,
    negativePartialWord: new RegExp(config.negativeKeyWords.join('|'),'i'),
    negativeWholeWord: new RegExp('\\b' + config.negativeKeyWords.join('\\b|\\b'), 'i'),
    positivePartialWord: new RegExp(config.positiveKeyWords.join('|'),'i'),
    positiveWholeWord: new RegExp('\\b' + config.positiveKeyWords.join('\\b|\\b'), 'i'),
    extraneous:            /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single/i,
    divToPElements:        /<(a|blockquote|dl|div|img|ol|p|pre|table|ul)/i,
    replaceBrs:            /(<br[^>]*>[ \n\r\t]*){2,}/gi,
    replaceFonts:          /<(\/?)font[^>]*>/gi,
    normalize:             /\s\s+/g,
    videos:                /http:\/\/(www\.)?(youtube|vimeo)\.com/i,
    period:                /\.( |$)/,
    captions:              /caption|figure/i,
    weight:                /[\s\d]+(gram|gr|gm|ml|kg|cup|pound|lb|spoon|tbsp)[s]?\s*/i,
    fractions:             /[0-9]+\/[0-9]+/i,
    cookingWords:          COOKING_WORDS_REGEXP,
    cookingWordsGlobal:    new RegExp(COOKING_WORDS_REGEXP.toString(), 'ig'),
    wpPostImage:           /wp-post-image/i
  },
  /* Wrap text nodes inside non click-to-delete elements (like div) in a span
   * so that they can be deleted */
  wrapTextNodes: function(node, scorer) {
    if (node.tagName && $.inArray(node.tagName.toUpperCase(), ['PRE', 'CODE', 'SVG']) !== -1) {
      return;
    }

    if(node.nodeType === Node.TEXT_NODE) {
      var text = $.trim(node.textContent);
      if (text === 'null') { DomScorerModifier.toElem(node).remove(); }
      else if (text) {
        var s = scorer.tree.createElement('span');
        s.node.className = 'text-node';
        var pEl = DomScorerModifier.toElem(node.parentNode);
        if (pEl){
          pEl.replaceChild(s, node);
        } else {
          node.parentNode.replaceChild(s.node, node);
        }
        s.appendChild(node);
      }
    } else if(node.childNodes.length > 0) {
      forEachNodeChild(node, function(child) { readability.wrapTextNodes(child, scorer); });
    }
  },

  extractAuthors: function() {
    var saveAuthor = function(author) {
      contentData.author = author;
      readability.author = '<span id="pf-author">' + author + '</span>';
    }

    var userSettingsAuthor = userSettingsSelectorService.authorSelectorResult()
    if (userSettingsAuthor) {
      switch(userSettingsAuthor.type) {
        case 'node':
          userSettingsAuthor.value.addClass('algo-author');
          return saveAuthor(userSettingsAuthor.value.text());
        case 'text':
          return saveAuthor(userSettingsAuthor.value);
      }
    }

    var applicationLdAuthor = applicationLd.extractAuthor(pfData.page.applicationLd);
    if (applicationLdAuthor) { return saveAuthor(applicationLdAuthor); }

    var authorParts = [], authorNode, authorsNodes, authorParent, authorParentNodes = [];
    var byRegex = /(^|\W)(by)(\W|$)/i;
    var authorSelectors = [
      '.pf-author', '.hentry a[rel=author]', 'a[rel=author]', '.author.vcard .fn',
      '[itemprop~=author] [itemprop~=name]', '[itemprop~=author]', '.byline', '#author',
      'header a[rel=author]', '.hentry .post-author'
    ];
    var joinedAuthorSelectors = authorSelectors.join(', ');
    $.each(authorSelectors, function(i, authorSelector) {
      authorParts = [];
      authorParentNodes = [];
      authorsNodes = $doc.find(authorSelector).not('.widget *').not('.sidebar *');
      if(authorsNodes.length >= 1 && authorsNodes[0].className.search(/combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter|tags|postmetadata/i) === -1 && $.inArray(this.nodeName, ["INPUT"]) === -1) {
        authorNode = authorsNodes.first();
        // Account for multiple authors. Find parent element containing multiple authors
        var parent = authorNode.parent();
        var grandParent = parent.parent();
        var matchedAncestor = null;
        if (parent.find(joinedAuthorSelectors).length > 1) { matchedAncestor = parent; }
        else if (grandParent.find(joinedAuthorSelectors).length > 1) { matchedAncestor = grandParent; }
        if (matchedAncestor) { authorNode = matchedAncestor; }

        // Mark author node to delete later
        authorNode.addClass('algo-author');

        // Some websites like nature.com has additional data in <sup> which is not relevant
        authorNode.find('sup').remove();

        // When using parent element of multiple authors, use the authorSelector again to
        // find exact matches and avoid junk
        if(matchedAncestor) {
          matchedAncestor.find(authorSelector).each(function(){
            helper.extractText(authorParts, this);
          });
          if(!authorParts.join(' ').match(/,/)) {
            authorParts = [authorParts.join(', ')];
          }
        } else {
          helper.extractText(authorParts, authorNode[0]);
        }

        if(authorNode.text().search(byRegex) === -1) {
          try {
            authorParent = authorNode.parent();
            authorParentNodes.push(authorParent);
            if(authorParent.prev().children().length === 0) authorParentNodes.push(authorParent.prev());

            $.each(authorParentNodes, function(i, node) {
              var nodeText = node.text();
              // If length > 60, then we are matching too much
              if(nodeText.search(byRegex) !== -1 && nodeText.length < 60 ) {
                authorParts.unshift('By');
                // abort the each loop
                return false;
              }
            });
          } catch(e) {}
        }

        saveAuthor(authorParts.join(' '))

        // abort the each loop
        return false;
      }
    });

    if (!readability.author) {
      var authorMeta = $.grep(pfData.page.metas, function(elm) { return elm.property === 'author'; });
      if (authorMeta.length === 1 && authorMeta[0].content) {
        contentData.author = authorMeta[0].content;
        readability.author = '<span id="pf-author">' + authorMeta[0].content + '</span>';
      }
    }
  },

  extractPubDate: function() {
    var userSettingsDate = userSettingsSelectorService.dateSelectorResult()
    if (userSettingsDate) {
      if (userSettingsDate.type === 'text') { readability.pubDate = userSettingsDate.value }
      else if (userSettingsDate.type === 'selector') {
        this.extractDateBySelectors([pfData.userSettings.dateSelector.value]);
      }

      return;
    }

    this.extractDateBySelectors([
      // Check pf-date and Square Space date
      '.pf-date', '#pf-date', '.Blog-meta-item--date',
      // These selectors are visible unlike meta selectors and more likely to contain the correct info.
      // So give them higher priority
      '.hentry .entry-date', '.hentry .post-date time[itemprop="datePublished"]', '.article-content--main time[itemprop="datePublished"]',
      'time.published-date '
    ]);

    // Check Open Graph meta ie <meta property="article:published" content="2016-07-03T20:18:18-04:00" />
    //                           <meta property="article:published_time" content="2016-07-03T20:18:18-04:00" />
    this.extractDateFromMeta('property', 'article:published');
    this.extractDateFromMeta('property', 'article:published_time');

    // Check Shareholic meta ie <meta name='shareaholic:article_published_time' content='2014-08-05T17:53:26+00:00' />
    this.extractDateFromMeta('name', 'shareaholic:article_published_time');

    // Check Schema.org meta ie <meta itemprop="datePublished" content="2016-07-03T20:18:18-04:00" />
    this.extractDateFromMeta('itemprop', 'datePublished');
  },

  extractDateFromMeta: function(attr, value) {
    if (typeof(readability.pubDate) !== 'undefined')
      return;

    var pubDateEl = helper.findMeta(pfData.page.metas, attr, value);
    var localeEl = helper.findMeta(pfData.page.metas, 'property', 'og:locale');
    var locale;

    if (localeEl.length == 1 && typeof(localeEl[0].content) !== 'undefined') {
      locale = localeEl[0].content.replace('_', '-');
    }

    if(pubDateEl.length == 1 && typeof(pubDateEl[0].content) !== 'undefined') {
      try {
        // NOTE: sometimes the TZ suffix is unparsable by phantomjs
        // as we don't care about time we parse only the date part
        var dateStr = pubDateEl[0].content.split('T')[0];
        // This date will be in UTC since we don't have timezone info
        var pubDate = new Date(dateStr);

        if (!isNaN(pubDate.getTime())) {
          try {
            readability.pubDate = pubDate.toLocaleDateString(
              locale,
              {month: 'long', year: 'numeric', day: 'numeric', timeZone: 'UTC'}
            );
          } catch(e) {
            readability.pubDate = pubDate.toLocaleDateString(
              'en-US',
              {month: 'long', year: 'numeric', day: 'numeric', timeZone: 'UTC'}
            );
          }
        }
      } catch(e) {
        // if not parsable go to next check
      }
    }
  },

  extractDateBySelectors: function(selectors) {
    if (typeof(readability.pubDate) !== 'undefined')
      return;

    $.each(selectors, function(i, selector) {
      var pubDateEl = $doc.find(selector).not('.widget *').not('.sidebar *');

      if(pubDateEl.length === 1) {
        readability.pubDate = pubDateEl.text();
        pubDateEl.remove();
        return false;
      }
    });
  },

  extractCopyright: function() {
    var $copyright = $doc.find('.copyright, #copyright');
    if ($copyright.length > 0) {
      readability.copyright = $copyright.clone().removeAttr('style');
      $copyright.remove();
    }
  },

  extractCustomHeaderFooter: function() {
    var $header = $doc.find('.print-header');
    if($header.length == 1) {
      readability.customHeader = $('<div />', document)
        .append($header.clone().removeAttr('style'))
        .html();
      $header.remove();
    }
    var $footer = $doc.find('.pf-footer, .print-footer');
    if ($footer.length > 0) {
      readability.customFooter = $('<div />', document)
        .append($footer.clone().removeAttr('style'))
        .html();
      $footer.remove();
    }
  },

  /**
   * Runs readability.
   *
   * Workflow:
   *  1. Prep the document by removing script tags, css, etc.
   *  2. Build readability's DOM tree.
   *  3. Grab the article content from the current dom tree.
   *  4. Replace the current DOM tree with the new one.
   *  5. Read peacefully.
   *
   * @return void
   **/
  init: function(scorer) {
    readability.prepDocument(scorer);
    /* Build readability's DOM tree */
    var overlay        = scorer.tree.createElement("DIV");
    var innerDiv       = scorer.tree.createElement("DIV");
    helper.pickTitleFromContent();
    // The order is important. We have to call getArticleTitle first
    // because grabArticle will change the content and the correct
    // title may not be picked
    var articleTitle   = readability.getArticleTitle(scorer);
    var fallbackHTML = '<div id="pf-root">' + document.body.innerHTML + '</div>';
    var printYesResult = printYesUtils.extract(document.body);
    scorer.beforeRunner();
    var articleContent = readability.grabArticle(scorer);

    // NOTE: in case DomScorerModifier removes eliminates content
    // we run only grabArticle using fallbackHTML
    if(!articleContent) {
      readability.addFlag(readability.FLAG_STRIP_UNLIKELYS);
      readability.addFlag(readability.FLAG_WEIGHT_CLASSES);
      readability.addFlag(readability.FLAG_CLEAN_CONDITIONALLY);

      document.body.innerHTML = fallbackHTML;
      scorer.rebuildTree();
      readability.textLimit = 250;
      readability.run = 0;
      articleContent = readability.grabArticle(scorer);

      if(!articleContent) {
        articleContent    = scorer.tree.createElement("DIV").node;
        articleContent.id = "pf-content";
        readability.hasContent = false;
      } else {
        logger.error(new Error('runDomScorerModifier removes main content'));
      }
    }

    readability.articleTitle = articleTitle.node;
    readability.articleContent = articleContent;

    scorer.afterRunner({
      candidate: articleContent,
      skipRelatedArticlesClassifier: !!pfData.userSettings.contentSelectors
    });
    if(readability.titleText) {
      // when title is picked up by WP/blogger selectors or from content
      readability.articleTitle.innerHTML = readability.titleText;
    } else {
      // WHen title was picked up by old readability code
      readability.titleText = $.trim($(readability.articleTitle).text());
    }

    $(articleContent).find(readability.titleTags.join(',')).each(function() {
      if(readability.titleText == $.trim($(this).text())) {
        $(this).remove();
      }
    });

    overlay.node.id              = "printfriendly";
    innerDiv.node.id             = "pf-print-area";
    articleTitle.node.id         = "pf-title";

    if (!pfData.onServer) {
      /* Glue the structure of our document together. */
      innerDiv.appendChild(articleTitle);
      innerDiv.appendChild(articleContent);
      overlay.appendChild(innerDiv);

      /* Clear the old HTML, insert the new content. */
      document.body.innerHTML = setup.defaultHtml;
      DomScorerModifier.toElem(document.body).appendChild(overlay);
      document.body.removeAttribute('style');
    }
    var userSettingsRemove = userSettingsSelectorService.removeSelectorResult();
    if (userSettingsRemove && userSettingsRemove.type === 'selector') {
      $(articleContent).find(userSettingsRemove.value).remove();
    }

    // Prepend Primary Image to article content. The image was found earlier by using "find" method
    primaryImage.prependTo(articleContent);
    if (readability.hasContent) {
      readability.wrapTextNodes(articleContent, scorer);
      printYesUtils.apply(articleContent, printYesResult);
    }

    contentData.hasContent = readability.hasContent;
    contentData.title = readability.getInnerText(articleTitle.node);
    descriptions = $.grep(pfData.page.metas, function(elm) { return elm.name === 'description'; });
    if (descriptions.length) {
      contentData.description = descriptions[0].content;
    }
    contentData.dir = readability.getSuggestedDirection(articleContent.textContent);
    contentData.content = articleContent.innerHTML;
    var pageUrl = pfData.config.ssLocation || '';
    contentData.contentTextWithTitleAndUrl = pageUrl + articleContent.textContent + contentData.title;
    contentData.contentTextLength = articleContent.textContent.length;
    contentData.lang = pfData.page.language;

    logger.timeEnd('algo.js Time');
    helper.runPostAlgoProcesses(articleContent, contentData);
  },

  /**
   * retuns the suggested direction of the string
   *
   * @return "rtl" || "ltr"
   **/
  getSuggestedDirection: function(text) {
    function sanitizeText() {
      return text.replace(/@\w+/, "");
    }

    function countMatches(match) {
      var matches = text.match(new RegExp(match, "g"));
      return matches !== null ? matches.length : 0;
    }

    function isRTL() {
      var count_heb = countMatches("[\\u05B0-\\u05F4\\uFB1D-\\uFBF4]");
      var count_arb = countMatches("[\\u060C-\\u06FE\\uFB50-\\uFEFC]");

      // if 20% of chars are Hebrew or Arbic then direction is rtl
      return  (count_heb + count_arb) * 100 / text.length > 20;
    }
    text = sanitizeText(text);
    return isRTL() ? "rtl" : "ltr";
  },

  /**
   * Get the article title as an H1.
   *
   * @return void
   **/
  getArticleTitle: function (scorer) {
    var createArticleTitleNode = function(title) {
      var result = scorer.tree.createElement("H1");
      result.node.innerText = title;

      return result;
    }

    var htags, selectors, css_selectors, $possibleTtitleEl, $post, $header;
    var $titleEl = null;
    htags = ['h1', 'h2', 'h3'];

    var userSettingsTitle = userSettingsSelectorService.titleSelectorResult();
    if (userSettingsTitle && userSettingsTitle.type === 'node') {
      $titleEl = userSettingsTitle.value;
      $possibleTtitleEl = userSettingsTitle.value;
    }

    if(!$titleEl) {
      $possibleTtitleEl = $doc.find('.pf-title');
      if($possibleTtitleEl.length === 1) {
        logger.log("Picking title using .pf-title");
        $titleEl = $possibleTtitleEl;
      }
    }

    if(!$titleEl) {
      $possibleTtitleEl = $doc.find('header [itemprop~="headline"]');
      if($possibleTtitleEl.length == 1 &&
         $.trim($possibleTtitleEl.text()) !== '') {
        logger.log("Picking title using header itemprop~=headline");
        $titleEl = $possibleTtitleEl;
      }
    }

    /*
     * Using blogger/wordpress tags is more reliable than testing for substring
     * of <title>. So try that first (We had demoted this in favour of the substring
     * approach but that proved to be a mistake)
     */
    if(!$titleEl && (pfData.config.platform === 'blogger' || pfData.config.platform === 'wordpress')) {
      selectors = ['.post-title', '.entry-title'];
      if (pfData.config.platform === 'wordpress') {
        selectors.push('.post_title', '.posttitle', '#page-title', '#pagetitle', '#title', '.title', '.entry-header');
      }
      css_selectors = [];
      $.each(['.single-post', '.post', '#post', '.hentry'],function(i,postTag) {
      // remove situations where above classes are applied to body tag.
        if($doc.find('.pf-body-cache' + postTag).length === 0) {
          $.each(htags, function(j, tag) {
            $.each(selectors, function(k, selector) {
              css_selectors.push(postTag + ' ' + selector + ' ' + tag);
              css_selectors.push(postTag + ' ' + tag + selector);
            });
          });
        }
      });
      $.each(css_selectors, function(i, selector) {
        $possibleTtitleEl = $doc.find(selector);
        if($possibleTtitleEl.length === 1 &&
           $.trim($possibleTtitleEl.text()) !== '') {
          logger.log("Picking title using WP/blogger classes");
          $titleEl = $possibleTtitleEl;
          return false;
        }
      });
    }
    if(!$titleEl && pfData.config.platform === 'squarespace') {
      selectors = ['article .BlogItem-title'];
      $.each(selectors, function(i, selector) {
        $possibleTtitleEl = $doc.find(selector);
        if($possibleTtitleEl.length === 1 &&
           $.trim($possibleTtitleEl.text()) !== '') {
          logger.log("Picking title using squarespace classes");
          $titleEl = $possibleTtitleEl;
          return false;
        }
      });
    }

    if(!$titleEl && $.trim($('title', document).text()) !== '') {
      var normalizeTitle = function(title) {
        return $.trim(title).toLowerCase().replace(/\W+/g,'')
      }
      var documentTitleText = normalizeTitle($('title', document).text());
      var previousMatchLength = 0;
      $.each(htags, function(i, tag) {
        $doc.find(tag).each(function(j, el) {
          var match = documentTitleText.match(normalizeTitle($(el).text()));
          // 15 is an arbitrary length chosen to prevent cases when a single word matches
          // title text.
          if(match && match[0].length > 15 && match[0].length > previousMatchLength) {
            logger.log("Using title element which had a substring of document title");
            previousMatchLength = match[0].length;
            $titleEl = $(el);
          }
        });
      });
    }

    if(!$titleEl) {
      $header = $doc.find('article header');
      if($header.length > 0) {
        $.each(htags, function(i, tag) {
          $possibleTtitleEl = $header.find(tag);
          if($possibleTtitleEl.length > 1) {
            /**
             * Abort the loop if we find more than one match. If there are
             * multiple H tags then we should not pick a lower H tag even if it
             * appears only once because it is clearly not intended as a title
             * (i.e if there a re multiple H1 tags, a single H2 tag is unlikely
             * to be the title tag)
             **/
            return false;
          } else if($possibleTtitleEl.length == 1) {
            logger.log("Picking title using article header, header h-tags");
            $titleEl = $possibleTtitleEl;
            return false;
          }
        });
      }
    }

    if ($titleEl) {
      readability.titleText = $.trim($titleEl.text());
      readability.titleTags.push($titleEl[0].nodeName);

      return createArticleTitleNode(readability.titleText);
    }

    var curTitle = "",
    origTitle = "";

    try {
      curTitle = origTitle = document.title;

      if(typeof curTitle !== "string") { /* If they had an element with id "title" in their HTML */
        curTitle = origTitle = readability.getInnerText(document.getElementsByTagName('title')[0]);
      }
    } catch(e) {}

    if(curTitle.match(/ [\|\-] /)) {
      curTitle = origTitle.replace(/(.*)[\|\-] .*/gi,'$1');

      if(curTitle.split(' ').length < 3) {
        curTitle = origTitle.replace(/[^\|\-]*[\|\-](.*)/gi,'$1');
      }
    } else if(curTitle.indexOf(': ') !== -1) {
      curTitle = origTitle.replace(/.*:(.*)/gi, '$1');

      if(curTitle.split(' ').length < 3) {
        curTitle = origTitle.replace(/[^:]*[:](.*)/gi,'$1');
      }
    } else if(curTitle.length > 150 || curTitle.length < 15) {
      var hOnes = document.getElementsByTagName('h1');
      if(hOnes.length === 1) {
        curTitle = readability.getInnerText(hOnes[0]);
      }
    }

    curTitle = $.trim(curTitle);

    if(curTitle.split(' ').length <= 4) {
      curTitle = origTitle;
    }
    if(curTitle.length > 0) {
      readability.titleText = curTitle;
    }

    return createArticleTitleNode(curTitle);
  },

  /**
   * Prepare the HTML document for readability to scrape it.
   * This includes things like stripping javascript, CSS, and handling terrible markup.
   *
   * @return void
   **/
  prepDocument: function (scorer) {
    /**
     * In some cases a body element can't be found (if the HTML is totally hosed for example)
     * so we create a new body node and append it to the document.
     */
    if(document.body === null) {
      var body = scorer.tree.createElement("body");
      try {
        document.body = body.node;
      } catch(e) {
        document.documentElement.appendChild(body.node);
        logger.log(e);
      }
      document.body.innerHTML = pfData.page.body;
    }

    document.body.id = "pf-body";
  },

  /**
   * Prepare the article node for display. Clean out any inline styles,
   * iframes, forms, strip extraneous <p> tags, etc.
   *
   * @param Element
   * @return void
   **/
  prepArticle: function (articleContent) {
    readability.cleanStyles(articleContent);

    /* Clean out junk from the article content */
    readability.clean(articleContent, "object");
  },

  /**
   * Initialize a node with the readability object. Also checks the
   * className/id for special names to add to its score.
   *
   * @param Element
   * @return void
   **/
  initializeNode: function (node) {
    node.readability = {contentScore: 0};

    switch(node.tagName) {
      case 'ARTICLE':
        node.readability.contentScore += 15;
      break;

      case 'ASIDE':
        case 'NAV':
        node.readability.contentScore -= 15;
      break;

      case 'DIV':
        node.readability.contentScore += 5;
      break;

      case 'PRE':
        case 'TD':
        case 'BLOCKQUOTE':
        node.readability.contentScore += 3;
      break;

      case 'ADDRESS':
        case 'OL':
        case 'UL':
        case 'DL':
        case 'DD':
        case 'DT':
        case 'LI':
        case 'FORM':
        node.readability.contentScore -= 3;
      break;

      case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
        case 'TH':
        node.readability.contentScore -= 5;
      break;
    }

    node.readability.contentScore += readability.getClassWeight(node);
  },

  getTextScore: function(text) {
    var textScore = 0;

    /* Add points for any commas within this paragraph */
    textScore += text.split(',').length;

    /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
    textScore += Math.min(Math.floor(text.length / 100), 3);

    if (text) {
      /* Calculate number of cookingWords occurences/all text to prevent deletion of recipes */
      textScore += (text.match(readability.regexps.cookingWordsGlobal) || []).length / text.length * 50;
    }

    return textScore;
  },

  isUnlikelyCandidate: function(node, nodeType) {
    if (readability.unlikelyTags.indexOf(node.tagName) >= 0) { return true; }

    var unlikelyMatchString = node.className + ' ' + node.id + ' ' + node.nodeName;

    if (nodeType === 'image') {
      return readability.regexps.unlikelyCandidates.test(unlikelyMatchString) ||
             readability.regexps.primaryImageUnlikelyParents.test(unlikelyMatchString);
    } else {
      return (
        (
          readability.regexps.unlikelyCandidates.test(unlikelyMatchString) ||
          (readability.regexps.unlikelyCandidatesNavigation.test(unlikelyMatchString) && node.querySelector('a'))
        ) &&
        !readability.regexps.okMaybeItsACandidate.test(unlikelyMatchString) &&
        !node.querySelector(readability.positiveTags.join(',')) &&
        node.tagName !== 'BODY' && $.inArray(node.tagName.toLowerCase(), readability.positiveTags) === -1
      );
    }
  },

  hasUnlikelyParent: function(node) {
    return $(node).parents().is(function() {
      return readability.isUnlikelyCandidate(this, 'image');
    });
  },

  skipSchemaSelectorsDomain: function() {
    var skipDomains = ['reuters.com'];
    var config = pfData.config;

    for(var i = 0, length = skipDomains.length; i < length; i++) {
      var domain = skipDomains[i];
      if (config.domains.page.indexOf(domain) >= 0 || (config.ssLocation && config.ssLocation.indexOf(domain) >= 0)) {
        return true;
      }
    }

    return false;
  },

  isWooCommerce: function() {
    var bodyClasses = '|' + pfData.page.bodyClassList.join('|') + '|';
    var hasWooCommerceClass = /\|[^|]*?woocommerce.*?\|/i.test(bodyClasses);
    var hasHomeClass = /\|home\|/i.test(bodyClasses);
    var hasSingleProductClass = /\|single-product\|/i.test(bodyClasses);

    return hasWooCommerceClass && (hasSingleProductClass || !hasHomeClass);
  },

  /***
   * grabArticle - Using a variety of metrics (content score, classname, element types), find the content that is
   *               most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
   *
   * @param page a document to run upon. Needs to be a full document, complete with body.
   * @return Element
   **/
  grabArticle: function (scorer, page) {
    readability.run += 1;
    var listClass = 'added-to-list' + readability.run;
    var post, parentNode, innerText, grandParentNode, isParentSameAsTheNode;
    var candidates = $();
    var contentSelectors = [];
    if (pfData.page.enablePrintOnly) {
      contentSelectors.push('.print-only', '#print-only');
    }
    var pfButtonSelectors = '.printfriendly.pf-alignright, .printfriendly.pf-alignleft, .printfriendly.pf-aligncenter';
    var pfContentNodes = $doc.find('.pf-content, #pf-content');
    pfContentNodes.find(pfButtonSelectors).remove();
    // Workaround for incorrect pf-content usage. Some publishers are wrapping printfriendly button in div.pf-content
    // which results in us picking that as the content
    // If we start with all selectors and remove the button after finding the candidates
    // then candidates.length > 0 and the blogger/WP hooks will not be tested
    if($.trim(pfContentNodes.text()) !== '' || pfContentNodes.find('img').length > 0 || $.inArray('IMG', $.map(pfContentNodes, function(el) {return el.nodeName; })) !== -1 ) {
      contentSelectors.push('.pf-content', '#pf-content');
    }

    var userSettingsContent = userSettingsSelectorService.contentSelectorResult();
    if (userSettingsContent) {
      if (userSettingsContent.type === 'node') {
        candidates = userSettingsContent.value;
      } else if (userSettingsContent.type === 'text') {
        var articleContent = scorer.tree.createElement("DIV");
        articleContent.node.setAttribute('id', 'pf-content');
        articleContent.appendChild(scorer.tree.createTextNode(userSettingsContent.value));
        return articleContent.node;
      }
    }

    if(!candidates.length && pfData.page.enablePrintOnly) {
      candidates = $doc.find(contentSelectors.join(','));
    }

    if(candidates.length === 0) {
      switch(pfData.config.platform) {
        case 'blogger-dynamic':
          post = $doc.find('.overview-content .entry-content, .viewitem-content .entry-content');
          if(post.length > 0) {
            post.find('.post-title, .entry-title, .post-header, .post-footer').remove();
            candidates = post;
          }
          break;
        case 'blogger':
          post = $doc.find('#main').find('.post-body, .entry-content, .post-title, .entry-title');
          if(post.length > 0) {
            post.find('.post-title, .entry-title, .post-header, .post-footer').remove();
            candidates = post;
          }
          break;
        case 'wordpress':
          var wooCommerceSelectors = readability.wpWooCommerceSelectors.join(',');

          var selectors = ['.fl-module-fl-post-content', '.elementor-widget-theme-post-content'];

          $.each(readability.wpContentParentTags, function(i, s1) {
            $.each(readability.wpContentTags, function(k, s2) {
              selectors.push(s1 + ' ' + s2);
            });
          });
          selectors.push('[data-elementor-type="wp-post"]')

          if (this.isWooCommerce() && $doc.find(wooCommerceSelectors).length > 0) {
            candidates = $doc.find(wooCommerceSelectors);
            logger.log("Found WP Candidate using WooCommerce Selectors");
          } else {
            //NOTE: Do not join the selectors and make a single call as that causes
            // a lot of junk to be classified as content
            $.each(selectors, function(i, selector) {
              var candidate = $doc.find(selector);
              if (candidate.length === 1 &&
                !candidate.hasClass('pf-invalid-selector') &&
                readability.getInnerText(candidate[0]).length > 150) {
                logger.log("Found WP candidate. Selector - " + selector);
                candidates = candidate;
                return false;
              }
            });
          }

          break;
        case 'weebly':
          post = $doc.find('#wsite-content .blog-content');
          if(post.length === 1 && (post.text().length > 20 || post.find('img').length > 0)) {
            candidates = post;
          }
          break;
        case 'wikihow':
          post = $doc.find('#bodycontents');
          if(post.length === 1 && (post.text().length > 20 || post.find('img').length > 0)) {
            candidates = post;
          }
          break;
        case 'medium':
          post = $doc.find('article.postArticle--full > .postArticle-content');
          if(post.length === 1 && (post.text().length > 20 || post.find('img').length > 0)) {
            candidates = post;
          }
          break;
        case 'washingtonpost':
          candidates = $doc.find('.article-body .teaser-content, .remainder-content');

          break;
        case 'nytimes':
          // Find article by ".story-body"
          post = $doc.find('.story-body');
          if(post.length >= 1) {
            candidates = post;
          }

          // Find article by class from meta tag
          if (candidates.length === 0) {
            var slugMetas = $.grep(pfData.page.metas, function(elm) { return elm.name === 'slug'; });
            if (slugMetas.length) {
              post = $doc.find('#' + slugMetas[0].content);
              if (post.length >= 1) {
                candidates = post;
              }
            }
          }

          // Find article by "article#story" and then clean junk
          if (candidates.length === 0) {
            post = $doc.find('article#story');

            if (post.length >= 1) {
              post.find(
                'nav, header, footer, #bottom-wrapper, #newsletter-module, .bottom-of-article, ' +
                '[class^="ResponsiveAd"], div [class^="SectionBar"], div[class^="elementStyles-recirculation"], ' +
                '[class^="InlineMessage"]'
              ).remove();
              candidates = post;
            }
          }

          break;
        case 'squarespace':
          var sqsSelectors = '#productSummary, .product-description, #content, .Main-content, .BlogItem, .hentry, main, article div[data-layout-label="Post Body"]'.split(',');
          $.each(sqsSelectors, function(_i, selector) {
            post = $doc.find(selector);
            if((post.length === 1 || post.length === 2) &&
              (post.text().length > 20 || post.find('img').length > 0)) {

              // Remove product quantity, add to cart button, product variants (like delivery date),
              // product sharing (twitter, facebook etc)
              post.find(
                '.product-quantity-input, .sqs-add-to-cart-button-wrapper, .product-variants, .product-sharing, ' +
                'aside, .entry-header, .entry-footer, nav, .Blog-meta, .BlogItem-share, .Index-page-scroll-indicator'
              ).remove();

              candidates = post;
              return false;
            }
          });
          break;
      }

      if(!this.skipSchemaSelectorsDomain()) {
        var schemaSelectors = [
          '[itemtype*="schema.org/Article"] [itemprop~=articleBody]',
          '[itemtype*="schema.org/NewsArticle"] [itemprop~=articleBody]',
          '[itemtype*="schema.org/Report"] [itemprop~=articleBody]',
          '[itemtype*="schema.org/ScholarlyArticle"] [itemprop~=articleBody]',
          '[itemtype*="schema.org/TechArticle"] [itemprop~=articleBody]',
          '[itemtype*="schema.org/Recipe"]',
          '[itemtype*="schema.org/ScholarlyArticle"] [data-article-body]'
        ];

        $.each(schemaSelectors, function(i, selector) {
          var articleBody = $doc.find(selector);
          if (articleBody.length === 1 &&
              readability.getInnerText(articleBody[0]).length > 250) {
            candidates = articleBody;
            return false;
          }
        });
      }
    }


    // This can happen when print-only is applied to the body element for example
    var candidatesHasBodyElem = $.grep(candidates, function(el) {return el.tagName == 'BODY'}).length > 0;

    if(candidates.length > 0 && !candidatesHasBodyElem) {
      // TODO Check if this is redundant since cleanHTML also does the same thing
      candidates.find('.navbar, .flex-direction-nav, .yarpp-related, .articleInline, .bottom-meta, .bottomnavigation, #branding, .commentlist, #commentwrapper, #comments, .comments, #disqus_thread, .entry-meta, .igit_relpost, #navbar, .nocomments, .noprint, .pd-rating, .pin-it-btn-wrapper, .post-actions, .post-comments, .post-extras, .post-footer, .post_footer, .post-header, .post-info, .post .meta, .post-meta, .postmeta, .postmetadata, .post_nav, .post_tags, .prev_next, .print-no, .respond, #respond, #sharebar, .shareTools, .share-buttons, .shareTop, .share_this, #sharebarx, .share_box, .sharedaddy, .share_icons, .shr-bookmarks, .sociable, .social_button, .social-ring, .socialwrap, .wpadvert, .wp-socializer, .editorial-disclosure').remove();
      candidates.find(pfButtonSelectors).remove();
      if(pfData.config.platform === 'wikihow') {
        candidates.find('#method_toc, .altadder_section, .relatedwikihows, .ad_label, .wh_ad, .wh_ad_inner, .video, .step_num').remove();
      } else if(pfData.config.platform === 'nytimes') {
        candidates.find('footer, .visually-hidden').remove();
      }

      if($.trim(candidates.text()) !== '' || candidates.find('img,svg').length > 0 || $.inArray('IMG', $.map(candidates, function(el) {return el.nodeName; })) !== -1 ) {
        logger.log("Bypassed readability and found content using " + pfData.config.platform + " rules");

        var contentDiv = scorer.tree.createElement("DIV");
        contentDiv.node.id = "pf-content";
        if(pfData.config.platform === 'wordpress') {
          $.each(readability.wpPostImageSelectors, function(i, selector) {
            var $wpPostImages = $doc.find(selector);
            if($wpPostImages.length === 1) {
              var $wpPostImage = $wpPostImages.first().find('img').addBack('img');

              // if preview content doesn't have the same image then prepend it
              if (!primaryImage.findSameImage(primaryImage.getImageOrigSrc($wpPostImage[0], candidates, false))) {
                // handle cases when image is wrapped in <figure> and has
                // associated <figcaption>
                if ($wpPostImage.parent()[0].nodeName === 'FIGURE') {
                  $wpPostImage = $wpPostImage.parent();
                }
                contentDiv.appendChild($wpPostImage[0]);
                logger.log("Picked WP Post Image using selector - " + selector);
                return false;
              }
            }
          });

          var $recipeIngredients = $doc.find('.single-recipe-ingredients');
          if($recipeIngredients.length === 1 &&
            candidates.find('.single-recipe-ingredients').length === 0) {
            contentDiv.appendChild($recipeIngredients[0]);
          }
        }

        if (userSettingsSelectorService.keepStyleResult().value !== 'on') {
          candidates.find('*[style]').addBack().each(function(){
            this.setAttribute('orig-style', this.getAttribute('style'));
            this.removeAttribute('style');
          });
        }

        // "aside" tag - if aside and little text. i.e if total text is X and aside is less than 15% of X, then remove aside
        var totalLength = candidates.text().length;
        var asideLength = candidates.find('aside').text().length;

        if (asideLength < totalLength * 0.15) {
          candidates.find('aside').remove();
        }

        for (var i = 0, length = candidates.length; i < length; i++) {
          var candidate = candidates[i];
          if ($(contentDiv.node).has(candidate).length === 0) {
            if (candidate.tagName === 'THEAD' || candidate.tagName === 'TBODY') {
              contentDiv.appendChild(candidate.parentNode);
            } else {
              contentDiv.appendChild(candidate);
            }
          }
        }

        return contentDiv.node;
      }
    }

    var stripUnlikelyCandidates = readability.flagIsActive(readability.FLAG_STRIP_UNLIKELYS),
        isPaging = (page !== null) ? true: false;

    page = page ? page : document.body;

    var pageCacheHtml = page.innerHTML;

    var queue = [];
    // NOTE: phantomjs children property returns `undefined` for some elements(ex. SVGElements)
    // so we have to verify it first
    if (page.children && page.children.length) {
      for (var j = 0, jlength = page.children.length; j < jlength; j++) { queue.push(page.children[j]); }
    }

    /**
     * First, node prepping. Trash nodes that look cruddy (like ones with the class name "comment", etc), and turn divs
     * into P tags where they have been used inappropriately (as in, where they contain no other block level elements.)
     *
     * Note: Assignment from index for performance. See http://www.peachpit.com/articles/article.aspx?p=31567&seqNum=5
     * TODO: Shouldn't this be a reverse traversal?
     **/
    var node = null;
    var nodesToScore = [];
    var textScore;
    var primaryContentNodes = ['P','PRE','TD', 'UL', 'OL'];
    var secondaryContentNodes = ['SPAN', 'B'];
    /* jshint -W084 */
    while(node = queue.shift()) {
      parentNode = null;
      /* Remove unlikely candidates */
      if (stripUnlikelyCandidates && readability.isUnlikelyCandidate(node)) {
        logger.log("Removing unlikely candidate - " + logElIdClass(node));
        node.parentNode.removeChild(node);
        continue;
      }

      if ($.inArray(node.tagName, primaryContentNodes) > -1 && !commonUtils.hasClass(node, 'pf-br-replacement')) {
        nodesToScore.push(node);
      } else if ($.inArray(node.tagName, secondaryContentNodes) > -1 &&
                  node.childNodes.length === 1 &&
                  node.childNodes[0].nodeType === Node.TEXT_NODE &&
                  readability.getInnerText(node).length > 30) {

        do {
          parentNode = helper.findNonExclusiveParent(parentNode || node);
        } while(parentNode && $.inArray(parentNode.tagName, secondaryContentNodes) > -1);

        if(parentNode && !commonUtils.hasClass(parentNode, listClass)) {
          nodesToScore.push(parentNode);
        }

      /* Turn all divs that don't have children block level elements into p's */
      } else if (node.tagName === "DIV") {
        if (node.innerHTML.search(readability.regexps.divToPElements) === -1 && !node.classList.contains('print-yes')) {
          try {
            var newNode = scorer.tree.createElement('p');
            /* jshint -W083 */
            forEachNodeChild(node, function(nodeChild) { newNode.appendChild(nodeChild); });
            /* jshint +W083 */
            DomScorerModifier.toElem(node.parentNode).replaceChild(newNode, node);
            if(node.id) { newNode.node.id = node.id; }
            if (node.className) { newNode.node.className = node.className; }
            nodesToScore.push(newNode.node);
          } catch(e) {
            nodesToScore.push(node);
            logger.log("Could not alter div to p, probably an IE restriction, reverting back to div.: " + e);
          }
        } else {
          /* text nodes are not part of allElements since getElementsByTagName do not
            * return them. Hence we have to find and wrap text nodes to ensure
            * that they are scored. Since allElements is dynamic, it will be automatically looped
            * over
            */
          /* jshint -W083 */
          forEachNodeChild(node, function(childNode) {
            try {
              if(childNode.nodeType === Node.TEXT_NODE && $.trim(childNode.nodeValue)) {
                var span = scorer.tree.createElement('span');
                span.node.className = 'pf-space-replacement';
                if (pfData.browser.isIE && pfData.browser.version < 10) {
                  childNode.innerHTML = '&nbsp;' + childNode.nodeValue;
                }
                DomScorerModifier.toElem(node).replaceChild(span, childNode);
                span.appendChild(childNode);
              /* element.children returns comment nodes in IE 8 and below.
                * This results in incorrect parent being identified in
                * findNonExclusiveParent. So remove comment nodes. It is also removed
                * by stripUnlikelyCandidates but we don't want to depend on it since it
                * may be turned off when grabArticle is called multiple times
                */
              } else if(childNode.nodeType === Node.COMMENT_NODE) {
                node.removeChild(childNode);
              }
            } catch(e) {}
          });
          /* jshint +W083 */
        }
      }
      if(nodesToScore[nodesToScore.length-1]) {
        commonUtils.addClassTo(nodesToScore[nodesToScore.length-1], listClass);
      }

      // NOTE: phantomjs children property returns `undefined` for some elements(ex. SVGElements)
      // so we have to verify it first
      if (node.children && node.children.length) {
        for(var ci = 0, cil = node.children.length; ci < cil; ci++) {
          queue.push(node.children[ci]);
        }
      }
    }
    /**
     * Loop through all paragraphs, and assign a score to them based on how content-y they look.
     * Then add their score to their parent node.
     *
     * A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
     **/
    candidates = [];
    for (var pt=0; pt < nodesToScore.length; pt++) {
      isParentSameAsTheNode = false;
      var currentScoreNode = nodesToScore[pt];
      /* Because we have added non paragraph elements to nodes_to_score we need to handle those
        * nodes in a different manner. Their points should be added to themseleves if possible
        * instead of their parent elements
        */
      if($.inArray(currentScoreNode.tagName, ['SECTION', 'DIV', 'ARTICLE']) > -1 && currentScoreNode.children && currentScoreNode.children.length > 1) {
        parentNode = currentScoreNode;
        isParentSameAsTheNode = true;
      } else {
        parentNode = helper.findNonExclusiveParent(currentScoreNode);
      }

      if(!parentNode || typeof(parentNode.tagName) === 'undefined') {
        continue;
      }

      innerText = readability.getInnerText(currentScoreNode);
      if (
        (innerText.length < 25 && !helper.isRecipeIngredient(innerText) && !helper.isLinkTextOnly(currentScoreNode, innerText)) ||
        innerText.length < 5
      ) {
        continue;
      }

      grandParentNode = helper.findNonExclusiveParent(parentNode);

      textScore = readability.getTextScore(innerText);

      /* We roll up the score of the node to its parent, and also add half
        * to the grandparent if both parent and the child nodes aren't present
        * in nodesToScore as that would lead double scoring of the same
        * innerText.
        *
        * We also roll up the score to parentNode, if we have ourselves
        * assigned parentNode to be the same as the child node as in the
        * case of SECTION, DIV and ARTICLE tags when we set isParentSameAsTheNode
        * to true.
        */

      if (isParentSameAsTheNode || !commonUtils.hasClass(parentNode, listClass)) {
        if(typeof parentNode.readability === 'undefined') {
          readability.initializeNode(parentNode);
          candidates.push(parentNode);
        }
        parentNode.readability.contentScore += textScore;
      }

      if (grandParentNode &&
          typeof grandParentNode.tagName !== 'undefined' &&
          !commonUtils.hasClass(parentNode, listClass) &&
          !commonUtils.hasClass(grandParentNode, listClass)) {

        if(typeof grandParentNode.readability === 'undefined') {
          readability.initializeNode(grandParentNode);
          candidates.push(grandParentNode);
        }

        grandParentNode.readability.contentScore += textScore * 0.9;
      }

      if(readability.debugLevel > 3) {
        logger.log('Node: ' + logElIdClass(currentScoreNode));
        logger.log('Text Score: ' + textScore);
        logger.log('Parent: ' + logEl(parentNode));
        if(grandParentNode && typeof(grandParentNode.readability) !== 'undefined')
          logger.log('grandParent: ' + logEl(grandParentNode));
        logger.log('');
      }
    }

    /**
     * After we've calculated scores, loop through all of the possible candidate nodes we found
     * and find the one with the highest score.
     **/
    var topCandidate = null;
    for(var c = 0, cl = candidates.length; c < cl; c++) {
      /**
       * Scale the final candidates score based on link density. Good content should have a
       * relatively small link density (5% or less) and be mostly unaffected by this operation.
       **/
      candidates[c].readability.contentScore = candidates[c].readability.contentScore * (1 - readability.getLinkDensity(candidates[c]));
    }

    candidates.sort(function(a,b) {
      var aScore = a.readability.contentScore;
      var bScore = b.readability.contentScore;
      return ((aScore < bScore) ? 1 : (aScore === bScore ? 0 : -1));
    });

    logger.log("Top 5 Candidates");
    /* jshint -W004 */
    for(var i = 0, l = Math.min(5, candidates.length); i < l; i++) {
      logger.log(logEl(candidates[i]));
    }

    /* jshint +W004 */
    if(candidates.length > 0) {
      topCandidate = candidates[0];
      var topCandidateScore = Math.min(topCandidate.readability.contentScore, 100),
          candidateScoreThreshold = topCandidateScore * 0.5,
          candidatesAboveTheshold = [],
          parentReplaceScoreTThreshold = topCandidateScore * 0.9;

      $.each(candidates, function(i, candidate) {
        /*
        * Suppose we have 3 nodes A -> B -> C where
        * - B is child of A * and C is child of B
        * - All of them are candidates
        * - They are the only candidates above threshold with one
        *   of them being the topCandidate
        *
        * If we pick a common ancestor, then it will always be A
        * But that defeats the spirit of choosing common ancestor :)
        * Common ancestor choosing is helpful when we have disconnected
        * nodes with scores above threshold which usually means that the
        * nodes are semantically part of the same content but are separated
        * due to HTML tag soup
        *
        * But that's not the case here. In this case we should always choose
        * the highest scored candidate whether it is A, B or C
        *
        * For that first we tag the candidate with the class 'pf-candidate' if
        * they qualify.
        * We check whether the current candidate has a child or parent which
        * had qualified. If yes, then it means that the current node score
        * is lower than that of the qualified node since we are looping in
        * descending score order. So skip the current node (return true skips
        * to next element)
        *
        */

        $candidate = $(candidate);
        if ($candidate.parents('.pf-candidate').length > 0) { return true; }
        var $childCandidates = $candidate.find('.pf-candidate')
        if ($childCandidates.length > 0) {
          if (
            candidate.tagName === 'ARTICLE' && candidate.readability.contentScore >= candidateScoreThreshold ||
            candidate.readability.contentScore >= parentReplaceScoreTThreshold
          ) {
            candidatesAboveTheshold[candidatesAboveTheshold.indexOf($childCandidates[0])] = candidate;
            topCandidate = candidatesAboveTheshold[0];
          }
        }

        $candidate.addClass('pf-candidate');
        if(candidate.readability.contentScore >= candidateScoreThreshold) {
          candidatesAboveTheshold.push(candidate);
        }
      });

      if(candidatesAboveTheshold.length > 1) {
        try {
          topCandidate = helper.getCommonAncestor(candidatesAboveTheshold);
          if (topCandidate.tagName === 'BODY') {
            var normalizeCandidate = function(c) {
              if(c.tagName === 'THEAD' || c.tagName === 'TBODY') { return c.parentElement; }
              else { return c; }
            };
            var elem = scorer.tree.createElement('div');
            var currentTopCandidate = normalizeCandidate(candidates[0]);
            DomScorerModifier.toElem(currentTopCandidate.parentElement).replaceChild(elem, currentTopCandidate);
            elem.appendChild(currentTopCandidate);
            elem.node.readability = currentTopCandidate.readability;
            /* jshint -W004 */
            for(var i = 0, length = candidatesAboveTheshold.length; i < length; i++) {
              elem.appendChild(normalizeCandidate(candidatesAboveTheshold[i]));
            }
            topCandidate = elem.node;
            logger.log("Combining top candidates");
            /* jshint +W004 */
          } else {
            logger.log("Changing Top Candidate to Ancestor");
          }
        } catch(e) {
          topCandidate = candidates[0];
        }
      }
    }

    /**
     * If we still have no top candidate, just use the body as a last resort.
     * We also have to copy the body node so it is something we can modify.
     **/
    if (topCandidate === null || topCandidate.tagName === "BODY") {
      logger.log('Top Candidate NULL or BODY');
      var topCandidateElem = scorer.tree.createElement('DIV');
      var child = page.firstChild;
      while(child) {
        topCandidateElem.appendChild(child);
        child = page.firstChild;
      }
      DomScorerModifier.toElem(page).appendChild(topCandidateElem);
      topCandidate = topCandidateElem.node;
    }

    if (pfData.config.platform === 'medium') {
      var $parentArticle = $(topCandidate).parents('article');
      if ($parentArticle.length === 1) {
        logger.log('Changing Top Candidate to Ancestor article');
        var $nonEmptySections = $parentArticle.find('section').filter(function() { return !!this.innerText.length; });
        var tagsToSave = ['h1', 'h2', 'h3', 'h4', 'p', 'pre', 'code', 'ul', 'ol', 'figure', 'img'];
        var saveSelector = [];
        /* jshint -W004 */
        for(var i = 0, l = tagsToSave.length; i < l; i++) {
          var tag = tagsToSave[i];
          saveSelector.push([tag, tag + '>*', ':has(' + tag + ')'].join(','));
        }
        /* jshint +W004 */
        $($nonEmptySections[0]).find(':not(' + saveSelector.join(',') + ')').remove();
        topCandidate = $parentArticle[0];
      }
    }
    if (topCandidate.nodeName === 'THEAD' || topCandidate.nodeName === 'TBODY') { topCandidate = topCandidate.parentNode; }

    if (typeof topCandidate.readability === 'undefined')  {
      readability.initializeNode(topCandidate);
    }

    logger.log('Top Candidate: ' + logEl(topCandidate));
    /**
     * Now that we have the top candidate, look through its siblings for content that might also be related.
     * Things like preambles, content split by ads that we removed, etc.
     **/
    var articleContent = scorer.tree.createElement("DIV");
    if (isPaging) { articleContent.node.id = "pf-content"; }
    var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
    var parentNode = helper.findNonExclusiveParent(topCandidate) || topCandidate.parentNode;
    var siblingNodes = parentNode ? Array.prototype.slice.call(parentNode.childNodes) : [];

    var imgNode = null;
    // Sometimes articles have an image in the beginning. Usually it is the node before topCandidate
    if($(topCandidate).prev().find('img').length === 1) {
      imgNode = $(topCandidate).prev()[0];
      articleContent.appendChild(imgNode);
    }
    if($(topCandidate).parent().prev().find('img').length === 1) {
      // This node will not be part of siblingnodes. So no need to set imgNode
      articleContent.appendChild($(topCandidate).parent().prev()[0]);
    }

    for (var s = 0, sl = siblingNodes.length; s < sl; s++) {
      var siblingNode = siblingNodes[s];
      var append = false;
      var validSiblingNodeTypes = ['p','div','ul','ol','table', 'tr', 'td', 'tbody', 'blockquote'];
      var contentBonus = 0;
      var reason = '';
      var idClassName = siblingNode.id + ' ' + siblingNode.className;

      /**
       * Fix for odd IE7 Crash where siblingNode does not exist even though
       * this should be a live nodeList.
       * Example of error visible here: http://www.esquire.com/features/honesty0707
       **/
      if (!siblingNode) {
        continue;
      } else if (siblingNode === imgNode) {
        continue;
      }

      if (readability.debugLevel > 3) {
        logger.log("Looking at sibling node: " + logEl(siblingNode));
      }

      // Give a bonus if sibling nodes and top candidates have the same classname
      if (siblingNode.className === topCandidate.className &&
          topCandidate.className !== "") {
        contentBonus += topCandidate.readability.contentScore * 0.2;
      }

      // We always want topCandidate to be appended.
      if (siblingNode.contains(topCandidate)) {
        append = true;
        reason = 'top candidate';
      } else if (readability.regexps.negativeWholeWord.test(idClassName)) {
        continue;
      } else if (typeof siblingNode.readability !== 'undefined' &&
          (siblingNode.readability.contentScore + contentBonus) >= siblingScoreThreshold) {
        append = true;
        reason = 'content score + contentbonus > threshold';
      } else if ($.inArray(siblingNode.nodeName.toLowerCase(), validSiblingNodeTypes) > -1) {
        var linkDensity = readability.getLinkDensity(siblingNode);
        var nodeContent = readability.getInnerText(siblingNode);
        var nodeLength  = nodeContent.length;
        var linkCount   = siblingNode.getElementsByTagName('a').length;
        var imgCount    = siblingNode.getElementsByTagName('img').length;

        if (nodeLength > 300 && linkDensity < 0.25) {
          append = true;
          reason = 'Long content with low link density';
        } else if (nodeLength > 80 && linkDensity < 0.25 && linkCount < 3) {
          append = true;
          reason = 'Possibly long content with low link density & link count < 3';
        } else if (nodeLength < 80 && linkDensity === 0 &&
                    nodeContent.search(readability.regexps.period) !== -1) {
          append = true;
          reason = 'Short content with no links and has periods (.)';
        } else if (linkCount < 2 && imgCount == 1) {
          append = true;
          reason = 'link count < 2 with one image';
        }
      }


      if (append) {
        logger.log("Appending node: " + logEl(siblingNode) + ' -- because ' + reason);

        var nodeToAppend = null;
        if (siblingNode.nodeName !== "DIV" && siblingNode.nodeName !== "P" && siblingNode.nodeName !== 'TABLE') {
          /**
           * We have a node that isn't a common block level element, like
           * a form or td tag. Turn it into a div so it doesn't get filtered
           * out later by accident.
           */
          nodeToAppend = scorer.tree.createElement("DIV");
          nodeToAppend.node.id = siblingNode.id;

          /* jshint -W083 */
          forEachNodeChild(siblingNode, function(child) { nodeToAppend.appendChild(child); });
          /* jshint +W083 */
        } else {
          nodeToAppend = DomScorerModifier.toElem(siblingNode);
        }

        // To ensure a node does not interfere with readability styles,
        // remove its classnames
        nodeToAppend.node.className = "";
        articleContent.appendChild(nodeToAppend);
      }
    }

    /**
     * So we have all of the content that we need. Now we clean it up for presentation.
     **/
    readability.prepArticle(articleContent.node);

    /**
     * Now that we've gone through the full algorithm, check to see if we got any meaningful content.
     * If we didn't, we may need to re-run grabArticle with different flags set. This gives us a higher
     * likelihood of finding the content, and the sieve approach gives us a higher likelihood of
     * finding the -right- content.
     **/
    if(readability.getInnerText(articleContent.node).length < readability.textLimit) {
      logger.log('****Text length less than ' + readability.textLimit + ' ****');
      page.innerHTML = pageCacheHtml;
      scorer.rebuildTree();
      scorer.beforeRunner();

      if (readability.flagIsActive(readability.FLAG_STRIP_UNLIKELYS)) {
        readability.removeFlag(readability.FLAG_STRIP_UNLIKELYS);
        logger.log("Turning off FLAG_STRIP_UNLIKELYS");
        return readability.grabArticle(scorer, page);
      } else if (readability.flagIsActive(readability.FLAG_WEIGHT_CLASSES)) {
        readability.removeFlag(readability.FLAG_WEIGHT_CLASSES);
        logger.log("Turning off FLAG_WEIGHT_CLASSES");
        return readability.grabArticle(scorer, page);
      } else if (readability.flagIsActive(readability.FLAG_CLEAN_CONDITIONALLY)) {
        readability.removeFlag(readability.FLAG_CLEAN_CONDITIONALLY);
        logger.log("Turning off FLAG_CLEAN_CONDITIONALLY");
        return readability.grabArticle(scorer, page);
      } else if(readability.textLimit === 250) {
        logger.log("*** Reducing text limit to 75 ***");
        readability.textLimit = 75;
        return readability.grabArticle(scorer, page);
      } else {
        return null;
      }
    }

    if (articleContent.hasTagName('thead') || articleContent.hasTagName('tbody')) { return articleContent.parent.node; }
    return articleContent.node;
  },


  /**
   * Get the inner text of a node - cross browser compatibly.
   * This also strips out any excess whitespace to be found.
   *
   * @param Element
   * @param boolean - strips out any excess whitespace. Default is true
   * @return string
   **/
  getInnerText: function (e, normalizeSpaces) {
    if(typeof(e.textContent) === "undefined") {
      return "";
    }

    normalizeSpaces = (typeof normalizeSpaces === "undefined") ? true : normalizeSpaces;

    var textContent = $.trim(e.textContent);

    if(normalizeSpaces) {
      textContent = textContent.replace( readability.regexps.normalize, " ");
    }

    return textContent;
  },

  /**
   * Get the number of times a string s appears in the node e.
   *
   * @param Element
   * @param string - what to split on. Default is ","
   * @return number (integer)
   **/
  getCharCount: function (e,s) {
    s = s || ",";
    return readability.getInnerText(e).split(s).length-1;
  },

  /**
   * Remove the style attribute on every e and under.
   * TODO: Test if getElementsByTagName(*) is faster.
   *
   * @param Element
   * @return void
   **/
  cleanStyles: function (e) {
    if (userSettingsSelectorService.keepStyleResult().value === 'on') { return; }

    e = e || document;
    var cur = e.firstChild;

    if (!e) { return; }
    // Remove any root styles, if we're able.
    if(typeof e.removeAttribute === 'function' && e.className !== 'pf-styled') {
      e.setAttribute('orig-style', e.getAttribute('style'));
      e.removeAttribute('style'); }

      // Go until there are no more child nodes
      while ( cur !== null ) {
        if ( cur.nodeType === Node.ELEMENT_NODE) {
          // Remove style attribute(s) :
          if(cur.className !== "pf-styled") {
            cur.setAttribute('orig-style', cur.getAttribute('style'));
            cur.removeAttribute("style");
          }
          readability.cleanStyles( cur );
        }
        cur = cur.nextSibling;
      }
  },

  /**
   * Get the density of links as a percentage of the content
   * This is the amount of text that is inside a link divided by the total text in the node.
   *
   * @param Element
   * @return number (float)
   **/
  getLinkDensity: function (e) {
    var links      = e.getElementsByTagName("a");
    var textLength = readability.getInnerText(e).length;
    var linkLength = 0;
    for(var i=0, il=links.length; i<il;i+=1) {
      linkLength += readability.getInnerText(links[i]).length;
    }

    return linkLength / textLength;
  },

  /**
   * Get an elements class/id weight. Uses regular expressions to tell if this
   * element looks good or bad.
   *
   * @param Element
   * @return number (Integer)
   **/
  getClassWeight: function (e) {
    if(!readability.flagIsActive(readability.FLAG_WEIGHT_CLASSES)) {
      return 0;
    }

    var weight = 0;
    var idClassName = e.id + ' ' + e.className;

    if (idClassName.search(readability.regexps.negativePartialWord) !== -1 &&
        $.inArray(e.nodeName.toLowerCase(), readability.positiveTags) === -1 ) {
      weight -= 25;
    }

    if (idClassName.indexOf('side') >= 0 && idClassName.indexOf('widget') >= 0 &&
        $.inArray(e.nodeName.toLowerCase(), readability.positiveTags) === -1 ) {
      weight -= 25;
    }

    if (idClassName.search(readability.regexps.positivePartialWord) !== -1 &&
        $.inArray(e.nodeName.toLowerCase(), readability.negativeTags) === -1 ) {
      weight += 25;
    }

    return weight;
  },

  nodeIsVisible: function (node) {
    return (node.offsetWidth !== 0 || node.offsetHeight !== 0) && node.style.display.toLowerCase() !== 'none';
  },

  /**
   * Clean a node of all elements of type "tag".
   * (Unless it's a youtube/vimeo video. People love movies.)
   *
   * @param Element
   * @param string tag to clean
   * @return void
   **/
  clean: function (e, tag) {
    var targetList = e.getElementsByTagName( tag );
    var isEmbed    = (tag === 'object' || tag === 'embed');

    for (var y=targetList.length-1; y >= 0; y-=1) {
      /* Allow youtube and vimeo videos through as people usually want to see those. */
      if(isEmbed) {
        var attributeValues = "";
        for (var i=0, il=targetList[y].attributes.length; i < il; i+=1) {
          attributeValues += targetList[y].attributes[i].value + '|';
        }

        /* First, check the elements attributes to see if any of them contain youtube or vimeo */
        if (attributeValues.search(readability.regexps.videos) !== -1) {
          continue;
        }

        /* Then check the elements inside this element for the same. */
        if (targetList[y].innerHTML.search(readability.regexps.videos) !== -1) {
          continue;
        }

      }

      targetList[y].parentNode.removeChild(targetList[y]);
    }
  },

  /**
   * Clean an element of all tags of type "tag" if they look fishy.
   * "Fishy" is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
   *
   * @return void
   **/

  htmlspecialchars: function (s) {
    if (typeof(s) === "string") {
      s = s.replace(/&/g, "&amp;");
      s = s.replace(/"/g, "&quot;");
      s = s.replace(/'/g, "&#039;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
    }

    return s;
  },

  flagIsActive: function(flag) {
    return (readability.flags & flag) > 0;
  },

  addFlag: function(flag) {
    readability.flags = readability.flags | flag;
  },

  removeFlag: function(flag) {
    readability.flags = readability.flags & ~flag;
  }
};

var primaryImage = {
  primaryImageHTML: null,
  foundViaUserSettings: false,

  find: function() {
    if (pfData.userSettings.primaryImage && pfData.userSettings.primaryImage.value === 'off') {
      this.primaryImageHTML = ''
      return;
    }

    var userSettingsImage = userSettingsSelectorService.primaryImageSelectorResult()
    if (userSettingsImage ) {
      if (userSettingsImage.type === 'node') {
        this.primaryImageHTML = userSettingsImage.value.outerHTML;
      } else if (userSettingsImage.type === 'url') {
        this.primaryImageHTML = '<img src=' + userSettingsImage.value +' />';
      }
      this.foundViaUserSettings = true;
      return;
    }

    try {
      var image = userSettingsImage || this.largeImage() || this.wpPostImage() || this.metaImage();

      if (image) {
        var img = $(image).find('img').addBack('img')[0];

        var src = this.getImageRestoreSrc(img);
        if (src) {
          var $imageCopy = $(image.outerHTML);
          $imageCopy.attr('style', '');
          this.primaryImageHTML = $imageCopy[0].outerHTML;
        }
      }
    } catch(ex) {
      logger.error(ex);
    }
  },

  largeImage: function() {
    var findLikelyImage = function(imgs) {
      for (var i = 0; i < imgs.length; i++) {
        var image = imgs[i];
        if (!readability.isUnlikelyCandidate(image, 'image') && !readability.hasUnlikelyParent(image)) {
          if (image.nextSibling && image.nextSibling.tagName === "FIGCAPTION") {
            image = image.parentNode;
          }
          return image;
        }
      }
    }

    return findLikelyImage(document.querySelectorAll('.pf-large-image')) || findLikelyImage($(pfData.page.body).find('.pf-large-image'));
  },

  wpPostImage: function() {
    var $wpPostImage;
    if(pfData.config.platform === 'wordpress') {
      $.each(readability.wpPostImageSelectors, function(i, selector) {
        var $wpPostImages = $(document).find(selector);
        if($wpPostImages.length === 1) {
          $wpPostImage = $wpPostImages.first();
          // handle cases when image is wrapped in <figure> and has
          // associated <figcaption>
          if ($wpPostImage.parent()[0].nodeName === 'FIGURE') {
            $wpPostImage = $wpPostImage.parent();
          }
          logger.log("Picked WP Post Image using selector - " + selector);
          return false;
        }
      });
    }
    if ($wpPostImage) {
      return $wpPostImage[0];
    }
  },

  // Finds article image src by meta tag and returns it
  metaImage: function() {
    if (pfData.userSettings.primaryImage.value === 'content-only') { return null; }

    var metaSrc = helper.metaContentAttr('property', 'og:image') ||
      helper.metaContentAttr('name', 'twitter:image') ||
      helper.metaContentAttr('itemprop', 'image');
    if (metaSrc) {
      var foundImg = this.findSameImage(metaSrc, document.body, false)
      if (foundImg) { return foundImg; }

      // Sometimes the primary image is included in page as background image
      // via CSS which we can't detect. We assume the meta tags to be correct
      // as they are used by facebook/twitter and hence we will use it even if
      // can't find the image in the page
      var $img = $('<img>');
      $img.attr('src', metaSrc);
      return $img[0];
    } else {
      return null;
    }

  },

  prependTo: function(content) {
    if (pfData.page.hasPrintOnly && pfData.page.enablePrintOnly) {
      logger.log('Primary Image: SKIPPED, has print-only');
      return;
    }

    if (!this.primaryImageHTML) {
      logger.log('Primary Image: SKIPPED, no candidates');
      return;
    }

    var $imgHTML = $(this.primaryImageHTML);
    var $img = $imgHTML.find('img').addBack('img');
    var origSrc = this.getImageOrigSrc($img[0]) || this.getImageRestoreSrc($img[0]);
    // if preview content doesn't have the same image then prepend it
    if (!this.findSameImage(origSrc, content, this.foundViaUserSettings)) {
      $imgHTML.addClass('blockImage').addClass('pf-primary-img');
      $(content).prepend($imgHTML);
      logger.log('Primary Image: ADDED src = ' + origSrc);
    } else {
      logger.log('Primary Image: ALREADY EXISTS src = ' + origSrc);
    }
  },

  similarityMinScore: 0.17,
  // calculates similarity of image urls based on levenshtein distance
  similarityScore: function(origSrc, src) {
    origSrc = cleanImgFromPatterns(origSrc);
    src = cleanImgFromPatterns(src);

    var length = Math.min(origSrc.length, src.length);
    var score = levenshteinDistance(origSrc, src) / length;
    return score < this.similarityMinScore ? score : 1;
  },

  // Find same image by original src and returns it
  findSameImage: function(origSrc, context, exactMatchOnly) {
    if(!origSrc) { return; }

    origSrc = this.cleanSrc(origSrc);
    origSrc = decodeURI(origSrc);

    var image = null;
    var minScore = this.similarityMinScore;

    $('img, picture source', context).each(function() {
      var src = primaryImage.getImageOrigSrc(this) || primaryImage.getImageRestoreSrc(this);
      if (!src) {
        return true; // continue the loop
      }

      src = decodeURI(primaryImage.cleanSrc(src));
      // Don't need to clean srcSet because of using indexOf to find the same src
      var srcSet = decodeURI(primaryImage.getImageOrigSrcSet(this));
      if (srcSet.indexOf(origSrc) !== -1) {
        image = this;
        return false;
      } else if (!exactMatchOnly) {

        var score = primaryImage.similarityScore(origSrc, src)
        if (score < minScore) {
          image = this;
          minScore = score
        }
      }
    });

    return image;
  },

  getImageOrigSrc: function(image) {
    return pfData.onServer ? (image.getAttribute('pf-orig-src') || image.getAttribute('src')) : image.src;
  },

  getImageRestoreSrc: function(image) {
    return pfData.onServer ? (image.getAttribute('pf-restore-src') || image.getAttribute('src')) : image.src;
  },

  getImageOrigSrcSet: function(image) {
    return pfData.onServer ? image.getAttribute('pf-orig-srcset') : image.srcset;
  },

  // Remove unneeded parts of image src
  cleanSrc: function(src) {
    // Squarespace adds "format={number}w" query string to urls with images
    // remove it to be able to find the same image
    // i.e.
    // <meta property="og:image" content="http://host/image.jpg?format=1000w">
    // <img src="http://host/image.jpg?format=800w">
    src = src.replace(/format=\d+w/g, '');
    // remove www. prefix
    src = src.replace(/www\./g, '');
    // Remove sizes from urls like http://host/image-1200x800.jpg
    src = src.replace(/[-_]\d{1,4}x\d{1,4}/, '');

    return src;
  }
};

window.__pfImageToBase64Hooks = {}
function toBase64URL(url, callback) {
  if (!pfData.userSettings.encodeImages || url.startsWith('data:')) { return callback(url); }

  var id = UUID();
  window.__pfImageToBase64Hooks[id] = function(payload) {
    if(payload.state === 'success') { callback(payload.data) }
    else { callback(url) }
  }
  messageBus.postMessage('root', 'PfImageToBase64', {id: id, url: url});
}

/*
* TODO: Since we are setting image widths in pf.js, we probably do not need
* to wait for images to load. We can probably use a data-width attribute instead of
* width attribute. We will just need to take care of lazy load images
*/
var imageProcessor = {
  init: function() {
    $doc.find('#pf-content img').addClass('flex-width');
    $doc.find('.wp-caption img, .caption img, .tr-caption-container img, .thumbinner img.thumbimage').addClass('caption-img').removeClass('flex-width');

    this.resizeImageCssClass = commonUtils.resizeImageCssClass(pfData.userSettings.imagesSize);
    this.fixLazyLoadImages();
    this.fixResponsiveImages();
    this.fixMediumImages();
    this.convertImagesToBase64();
    this.layoutImages.setDisplayStyle();
    return this.layoutImages.init();
  },

  convertImagesToBase64: function() {
    $('img').each(function() {
      var img = this;
      if (img.getAttribute('src')){
        toBase64URL(img.src, function(dataUrl) { img.src = dataUrl; });
      }
    });
  },

  maxSrcset: function(srcset) {
    if (!srcset) { return; }

    var srcs = srcset.split(/,\s/);
    var firstSrc = srcs[0].split(' ')
    var result = { src: firstSrc[0], width: parseInt(firstSrc[1], 10) }
    for (var i = 1; i < srcs.length; i++) {
      var parts = srcs[i].split(' ');
      var src = parts[0];
      var width = parseInt(parts[1], 10);
      if (result.width < width) {
        result = { src: src, width: width }
      }
    }

    return result.src;
  },

  // wkhtmltopdf doesn't support responsive images, so src must be set to fix it
  fixResponsiveImages: function() {
    var alreadyFixed = {};
    var fixImgSrcset = function(img) {
      if(alreadyFixed[img]) { return; }
      toBase64URL(img.currentSrc || imageProcessor.maxSrcset(img.getAttribute('srcset')) || img.src, function(dataUrl) {
        img.src = dataUrl;
      });
      img.removeAttribute('srcset');
      alreadyFixed[img] = true;
    }
    $doc.find('img[pf-data-srcset]').each(function() {
      var img = this;
      var processedSrcset = img.getAttribute('pf-data-srcset');
      img.setAttribute('srcset', processedSrcset);

      img.onload = function() { fixImgSrcset(this); };
      img.onerror = function() { fixImgSrcset(this); };
    });
  },

  fixMediumImages: function() {
    $doc.find('img.ix.iy').remove();
    $doc.find('img').each(function(){
      var img = this;
      if(img.src && /miro\.medium\.com/i.test(img.src)) {
        var imgParts = img.src.split('/');
        var imgId = imgParts[imgParts.length - 1];
        $doc.find('img[src*="' + imgId + '"]').filter(function() { return this !== img; }).remove();
        img.src = img.src.replace(/q=\d+/, "q=100").replace(/max\/\d+\//, "max/1200/");
      }
    });
  },

  interpolationUrlRegexp: /([\?&][^=]*={[^\}]*})/,
  imgUrlRegexp: /(http(s?):)|([\/|.|\w|\s])*\.(?:jpg|gif|png|img)/i,
  lazyImgDataAttributes: ["data-ct-lazy","data-ezsrc","data-flickity-lazyload","data-hi-res-src","data-href","data-layzr","data-lazy-src","data-low-res-src","data-mediaviewer-src","data-native-src","data-opt-src","data-orig-src","data-original","data-original-src","data-pagespeed-lazy-src","data-pin-media","data-raw-src","data-runner-src","data-src","data-tf-src","data-wpfc-original-src","datasrc","nitro-lazy-src","original"],

  normalizeDataSrcAttr: function(attrSrc) {
    if (!attrSrc) { return; }
    var result = this.tryGetSrcFromJson(attrSrc);
    if (result) { return result; }

    return attrSrc;
  },

  findDeepValue: function(obj, callback) {
    for(var key in obj) {
      var value = obj[key];
      if (typeof value === 'string' && callback(value)) {
        return value;
      } else if (typeof value === 'object') {
        return this.findDeepValue(value, callback)
      }
    }
  },

  tryGetSrcFromJson: function(attrSrc) {
    var attrJson = {};
    try {
      attrJson = JSON.parse(attrSrc);
    } catch(e) { return; }

    return this.findDeepValue(attrJson, function(src) { return imageProcessor.isValidImgSrc(src); });
  },

  isValidImgSrc: function(src) {
    return this.imgUrlRegexp.test(src);
  },

  fixLazyLoadImages: function() {
    $doc.find('picture source[data-srcset]').each(function() {
      if (!this.getAttribute('srcset')) {
        this.setAttribute('srcset', this.getAttribute('data-srcset'));
      }
    });
    var srcAttr = pfData.onServer ? 'pf-restore-src' : 'src';
    $('img[' + srcAttr + '=""]:not([srcset],img[data-ct-lazy],img[data-ezsrc],img[data-flickity-lazyload],img[data-hi-res-src],img[data-href],img[data-layzr],img[data-lazy-src],img[data-low-res-src],img[data-mediaviewer-src],img[data-native-src],img[data-opt-src],img[data-orig-src],img[data-original],img[data-original-src],img[data-pagespeed-lazy-src],img[data-pin-media],img[data-raw-src],img[data-runner-src],img[data-src],img[data-tf-src],img[data-wpfc-original-src],img[datasrc],img[nitro-lazy-src],img[original],img.lazyload,img.lazyloaded,img[itemprop="url"],img[loading="lazy"],img[data-load="false"],img.js-progressiveMedia-image,a[data-replace-image],amp-img)').remove();

    $doc.find('img[src^="data:"]').each(function() {
      var originalImg = this;
      var dimensionsChecker = new Image();

      dimensionsChecker.onload = function() {
        if (this.width <= 1 || this.height <= 1) {
          originalImg.removeAttribute('src');
        }
      }
      dimensionsChecker.src = originalImg.src;
    });

    $doc.find('img[data-srcset]').each(function() {
      if (!this.getAttribute('srcset')) {
        this.setAttribute('srcset', this.getAttribute('data-srcset'));
      }
    });

    $doc.find('button.lightbox').each(function() {
      var btn = DomScorerModifier.toElem(this);
      var img = this.querySelector('img');
      if (img) { btn.parent.replaceChild(DomScorerModifier.toElem(img), btn); }
    });

    $doc.find('img[data-ct-lazy],img[data-ezsrc],img[data-flickity-lazyload],img[data-hi-res-src],img[data-href],img[data-layzr],img[data-lazy-src],img[data-low-res-src],img[data-mediaviewer-src],img[data-native-src],img[data-opt-src],img[data-orig-src],img[data-original],img[data-original-src],img[data-pagespeed-lazy-src],img[data-pin-media],img[data-raw-src],img[data-runner-src],img[data-src],img[data-tf-src],img[data-wpfc-original-src],img[datasrc],img[nitro-lazy-src],img[original],img.lazyload,img.lazyloaded,img[itemprop="url"],img[loading="lazy"],img[data-load="false"],img.js-progressiveMedia-image,a[data-replace-image],amp-img').each(function() {
      /* There are various browser quirks associated with changing the src of an image.
       *  Webkit doesn't re-fire events and IE reports the original width attribute etc
       *  Sidestep all that by creating a new image and replacing the original.
       */
      var img = this;
      var $newImage = $(document.createElement('img'));
      var src = null;
      for(var i = 0; i < imageProcessor.lazyImgDataAttributes.length; i++) {
        var imgDataSrc = imageProcessor.normalizeDataSrcAttr(this.getAttribute(imageProcessor.lazyImgDataAttributes[i]));
        // NOTE: we pick non-base64 data attribute
        if (imgDataSrc && imgDataSrc.indexOf(';base64,') < 0) {
          src = toAbsoluteUrl(imgDataSrc, pfData.page.location);
          break;
        }
      }
      src = src || this.getAttribute('href');
      if (!src && pfData.page.location.host.match(/yahoo/)) {
        var style = this.getAttribute('orig-style');
        if (style && style.match(/(http.*?)\)/)) {
          src = style.match(/(http.*?)\)/)[1];
        } else {
          src = this.getAttribute('src');
        }
      }

      // Non lazyloaded images can end up in this loop due to conditions like img[itemprop="url"]
      // This is a failsafe for that
      if (!src) {
        var attrSrc = img.getAttribute('src');
        src = (attrSrc === document.location.href) ? img.getAttribute('pf-orig-src') : attrSrc
      }

      // src must use original page protocol in case of schema less url
      // because extension uses chrome-extension protocol
      if (pfData.config.isExtension && src) {
        src = toAbsoluteUrl(src, pfData.page.location);
      }

      var srcset = img.getAttribute('pf-data-srcset') || img.getAttribute('data-srcset') || img.getAttribute('srcset');
      // NOTE: check if no src or src is data base64 placeholder
      if (srcset && (!src || src.indexOf('data:') >= 0 || srcset.indexOf(src) >= 0)) {
        src = imageProcessor.maxSrcset(srcset) || src;
      }

      $newImage[0].className = img.className;
      copyDataset($newImage[0], img);

      // NOTE: some lazy-loaders set img.width and img.height to 1px size
      // to prevent writing this value to rendered image we assign w/h only in case it's bigger than 1px

      var width = parseInt(img.getAttribute('width'), 10);
      var height = parseInt(img.getAttribute('height'), 10);
      if (width > 1) { $newImage[0].width = width; }
      if (height > 1) { $newImage[0].height = height; }

      if (img.parentNode.nodeName.toUpperCase() === 'PICTURE') {
        img.parentNode.parentNode.replaceChild($newImage[0], img.parentNode);
      } else {
        img.parentNode.replaceChild($newImage[0], img);
      }

      $newImage
        .on({
          load: function() {
            imageProcessor.layoutImages.layoutImage($newImage);
            // Convert relative to absolute URL
            $newImage[0].src = $newImage[0].src;
            // Convert image src to base64
            toBase64URL($newImage[0].src, function(dataUrl) {
              $newImage[0].src = dataUrl;
            });
            $newImage.off('load');
          },
          error: function() {
            // NOTE: some websites interpolate variables into dynamic urls which prevents
            // loading if we don't pass them like 'resize={width}' in:
            // "https://www.thetimes.co.uk/imageserver/image/methode%2Ftimes%2Fprod%2Fweb%2Fbin%2Fbe41b120-3a59-11e9-ac2f-7ff26270aa53.jpg?crop=3500%2C2333%2C0%2C0&resize={width}"
            // in order to prevent such issues we remove all interpolations

            var noInterpolationSrc = $newImage.attr('src').replace(imageProcessor.interpolationUrlRegexp, '');
            var src = $newImage.attr('src');

            if (noInterpolationSrc !== src) { $newImage.attr('src', noInterpolationSrc); }
          }
        });

      // The src is set last because load events are fired erratically in IE,
      // if src is set before load event is created
      if (src) {
        $newImage[0].src = src;
      } else if (srcset) {
        $newImage[0].srcset = srcset;
      }
    });

    $doc.find('amp-iframe').each(function() {
      var $apmIframe = $(this);
      var $firstImg = $apmIframe.find('img:first-child');
      $apmIframe.replaceWith($firstImg);
    })
  },

  layoutImages: {
    thresholds: {
      blockImage: {
        width: 820 * 0.45
      },
      smallImage: {
        width: 100,
        height: 60
      }
    },

    layoutImage: function ($img) {
      if($img[0].getAttribute('data-pf_style_display') === 'none') { return; }
      this.setImgClassAndDimensions($img);
    },

    setImgClassAndDimensions: function($img) {
      var width    = commonUtils.getImageWidth($img, pfData.onServer);
      var height   = commonUtils.getImageHeight($img, pfData.onServer);
      var imgClass;

      /**
       * If the image has no area, there's nothing to fix.
       * In addition, the image may not have loaded properly yet,
       * so we should just leave it be.
      **/
      if(width === 0) {
        return;
      }

      $img.removeClass('blockImage mediumImage smallImage');
      /* Decide whether to float or center the image. */
      if ($img.hasClass('pf-primary-img') || width > this.thresholds.blockImage.width) {
        imgClass = 'blockImage';
      } else if (width < this.thresholds.smallImage.width &&
                height < this.thresholds.smallImage.height) {
        imgClass = 'smallImage';
      } else {
        imgClass = 'mediumImage';
      }
      $img.addClass(imgClass);

      if($img.hasClass('caption-img')) {
        var imgWidth = commonUtils.getImageWidth($img, pfData.onServer);
        var $parents = $img.parents('.pf-caption, .wp-caption, .caption, .tr-caption-container');

        if (imgWidth && $parents.find('img').length === 1) {
          $parents.width(imgWidth);
        }

        $parents.addClass('pf-caption flex-width').addClass(imgClass).addClass(imageProcessor.resizeImageCssClass);

        if($img.hasClass('thumbimage')) {
          $img.parents('.thumbinner').width(imgWidth).addClass('pf-caption flex-width').addClass(imgClass).addClass(imageProcessor.resizeImageCssClass);
        }
      }

      $img.width(width);
    },

    setDisplayStyle: function() {
      var imageDisplayStyle = 'block';
      var validDisplayStyles = ['left','right','block', 'none'];
      var cssStyles = {
        margin: '1em 0 1em 1.5em',
        clear: 'right',
        display: 'inline-block',
        float: 'right'
      };

      if ($.inArray(pfData.userSettings.imageDisplayStyle,
                    validDisplayStyles) !== -1) {
        imageDisplayStyle = pfData.userSettings.imageDisplayStyle;
      }

      if (imageDisplayStyle === 'block') {
        cssStyles = {
          margin: '1em auto',
          clear: 'both',
          display: 'block',
          float: 'none'
        };
      } else {
        if(imageDisplayStyle === 'none') {
          cssStyles.margin = '0';
          cssStyles.float = 'none';
          cssStyles.display = 'none';
        } else if(imageDisplayStyle === 'left') {
          cssStyles.margin = '1em 1.5em 1em 0';
          cssStyles.float = 'left';
        }
      }

      var css = '#pf-content img.mediumImage, #pf-content figure.mediumImage {';
      for (var prop in cssStyles) {
        css += prop + ': ' + cssStyles[prop] + ';';
      }
      css += '}';

      commonUtils.addCSS(css, document, true);
    },

    init: function () {
      var promises = [];

      $doc.find('#pf-content img').each(function() {
        var $deferred = $.Deferred()
        var $img = $(this);
        if (!$img.hasClass('pf-svg-image')) {
          this.removeAttribute('height');
        }
        if(commonUtils.getImageWidth($img, pfData.onServer) === 0) {
          /* If the image was not cached, call layoutImage when it's loaded. */
          $img.on('load', function () {
            imageProcessor.layoutImages.layoutImage($img);
            $deferred.resolve();
          });
          // IE sometimes doesn't fire the load event. This is the failsafe
          window.setTimeout(function(){
            imageProcessor.layoutImages.layoutImage($img);
            $deferred.resolve();
          }, 2000);
        } else {
          /* If the image was cached, you call it immediately because onload will never fire. */
          imageProcessor.layoutImages.layoutImage($img);
          $deferred.resolve();
        }

        promises.push($deferred.promise());
      });

      return $.when.apply($, promises).promise();
    }
  }
};

var helper = {
  metaContentAttr: function(attr, value) {
    var metas = $.grep(pfData.page.metas, function(elm) { return elm[attr] === value; });
    return metas.length ? metas[0].content : null;
  },

  findNotEmptyParent: function (tag) {
    var parent = tag.parent();
    // NOTE: we check for zero for rare edgecase
    // if we reach the htmlTag.parent() to prevent infinite recursion
    // we have to check htmlTag.parent().length
    if (parent.length === 0) { return; }

    if (parent.children().length > 1 || $.trim(parent.text()).length !== 0) {
      return { parent: parent, tag: tag };
    } else {
      return this.findNotEmptyParent(parent);
    }
  },

  restoreSrcAsCamo: function (articleContent, contentData) {
    var $deferred = $.Deferred();

    if(typeof window.top.convertUrlToCamoUrl !== 'function') {
      $deferred.resolve();
      return $deferred.promise();
    }

    var SRCSET_REGEXP = /(?<url>[^,\s]+)(\s+(?<size>[^,]+))?,?/g

    $.when.apply($, Array.from(articleContent.querySelectorAll('img')).map((node) => {
      var $imgDeferred = $.Deferred();
      var imgSrc = node.getAttribute('pf-restore-src') || node.getAttribute('pf-orig-src') || node.getAttribute('src');
      if (imgSrc) {
        window.top.convertUrlToCamoUrl(imgSrc).then(camoSrc=> {
          if(camoSrc) { node.src = camoSrc }
          $imgDeferred.resolve()
        });
      } else {
        $imgDeferred.resolve()
      }
      var imgSrcset = node.getAttribute('pf-restore-src') || node.getAttribute('pf-orig-srcset') || node.getAttribute('srcset');
      var $imgSrcsetDeferred = $.Deferred();
      if (imgSrcset) {
        $.when.apply($, Array.from(imgSrcset.matchAll(SRCSET_REGEXP)).map((match) => {
          var $srcOfSrcsetDeferred = $.Deferred();
          window.top.convertUrlToCamoUrl(match.groups.url).then((camoSrc) => {
            $srcOfSrcsetDeferred.resolve([camoSrc, match.groups.size].filter(v => !!v).join(' '))
          })
          return $srcOfSrcsetDeferred.promise()
        })).then((...camoSrcs) => {
          var newImgSrcset = camoSrcs.join(', ')
          if(newImgSrcset) { node.setAttribute('srcset', newImgSrcset); }
          $imgSrcsetDeferred.resolve()
        })
      } else {
        $imgSrcsetDeferred.resolve()
      }
      return $.when.apply($, [$imgDeferred.promise(), $imgSrcsetDeferred.promise()])
    })).then(() => {
      contentData.content = articleContent.innerHTML;
      $deferred.resolve()
    })

    return $deferred.promise();
  },

  restoreImageSrcs: function (articleContent, contentData) {
    if (pfData.page.location.href.startsWith('http://')) {
      return this.restoreSrcAsCamo(articleContent, contentData);
    } else {
      articleContent.querySelectorAll('img, picture source').forEach(function (img) {
        const restoreSrc = img.getAttribute('pf-restore-src');
        const restoreSrcset = img.getAttribute('pf-restore-srcset');
        if (restoreSrc) { img.src = restoreSrc; }
        if (restoreSrcset) { img.srcset = restoreSrcset; }
      });
      contentData.content = articleContent.innerHTML;
      return $.Deferred().resolve().promise();
    }
  },

  runPostAlgoProcesses: function(articleContent, contentData) {
    try {
      contentData.favicon = pfData.page.favicon
      contentData.userSettings = pfData.userSettings;
      if (pfData.onServer) {
        // If running on server check NSFW agains preview content
        nsfwChecker.checkText(contentData.contentTextWithTitleAndUrl);
      }

      var $deferred = $.Deferred();
      if(contentData.hasContent) {
        this.addHeaderFooter();
        if (!pfData.onServer){
          imageProcessor.init().then(function() {
            contentData.content = articleContent.innerHTML;
            var pageUrl = pfData.config.ssLocation || '';
            contentData.contentTextWithTitleAndUrl = pageUrl + articleContent.textContent + contentData.title;
            contentData.contentTextLength = articleContent.textContent.length;
            $deferred.resolve();
          });
        } else {
          this.restoreImageSrcs(articleContent, contentData).then(() => {
            $deferred.resolve();
          });
        }
      } else {
        $deferred.resolve();
      }

      $deferred.promise().then(function() {
        messageBus.postMessage('core', 'PfRunPostAlgoProcesses', {contentData: contentData});
      });
    } catch(e) {
      logger.error(e);
      // Last ditch attempt
      messageBus.postMessage('core', 'PfRunPostAlgoProcesses', {contentData: contentData});
    }
  },

  pickTitleFromContent: function() {
    var hTags = ['h1', 'h2', 'h3'];
    $.each(hTags, function(i, tag) {
      var $titleTag = $doc.find(tag);
      if($titleTag.length == 1 && $.trim($titleTag.text()) !== '') {
        readability.titleText = $.trim($titleTag.text());
        readability.titleTags.push(tag);
        logger.log("Picking possible title from content - " + readability.titleText);
        return false;
      } else if($titleTag.length > 1) {
        // if there are more than one tag, then neither this tag nor the tags
        // lower are being used for titles. So abort the loop
        return false;
      }
    });
  },

  isLinkTextOnly: function(node, innerText) {
    var nestedATags = node.querySelectorAll('a');
    if (nestedATags.length !== 1) { return false; }
    return nestedATags[0].innerText === innerText;
  },

  isRecipeIngredient: function(text) {
    var containsWeight = text.search(readability.regexps.weight) !== -1;
    var containsFractions = text.search(readability.regexps.fractions) !== -1;
    var containsCookingWords = text.search(readability.regexps.cookingWords) !== -1;

    return containsWeight || containsFractions || containsCookingWords;
  },

  addHeaderFooter: function() {
    var header = [];

    if (pfData.userSettings.customCssStyle) {
      header.push('<style class="pf-user-css-settings">' + pfData.userSettings.customCssStyle + '</style>');
    }
    if ($.trim(pfData.userSettings.headerImageUrl) !== '') {
      header.push('<img id="pf-header-img" src="' + $.trim(pfData.userSettings.headerImageUrl) + '"/>');
    }
    if ($.trim(pfData.userSettings.headerTagline) !== '') {
      header.push('<p id="pf-tagline">' + unescape($.trim(pfData.userSettings.headerTagline)) + '</p>');
    }

    if (!pfData.config.disableUI) {
      header.push(this.headerHtml());
    }

    // Add author line only if it doesn't exist in main content
    var authorNodes = $('.algo-author', readability.articleContent);
    if(readability.author && authorNodes.length === 0) {
      header.push(readability.author);
    } else {
      // SS always includes author in header.
      // Set it to empty to not include author twice.
      contentData.author = '';
    }

    if(readability.pubDate) {
      header.push("<span id='pf-date'>" + readability.pubDate + "</span>");
      contentData.pubDate = readability.pubDate;
    }
    $(header.join('')).insertBefore( $doc.find('#pf-content') );

    // rearranging title so that order is pf-src -> title -> author/pubdate
    $doc.find('#pf-title').insertBefore($doc.find('#pf-src'));

    if(readability.customHeader) {
      $(readability.customHeader, document).insertBefore($doc.find('#pf-title'));
      contentData.customHeader = $(readability.customHeader).html();
    }
    if(readability.customFooter) {
      $doc.find('body').append(readability.customFooter);
      contentData.customFooter = $(readability.customFooter).html();
    }
    if(readability.copyright) {
      $doc.find('body').append(readability.copyright);
      contentData.copyright = readability.copyright.html();
    }
  },

  headerHtml: function() {
    var pageURL = pfData.config.urls.page;

    try {
      // Foreign languages in URL are encoded at times. Try decoding them
      // Decoding can error out when the URL is not actually encoded but has parts
      // that look like it is.
      pageURL =  decodeURI(pageURL);
    } catch(e) {}

    /*
     * Use encodeURI to avoid XSS.
     * We are using pageURL instead of using
     * pfData.config.urls.page directly because pageURL is guaranteed to be
     * unencoded since we try to decode it. pfData.config.urls.page will mostly
     * be in encoded format. We can't guarantee it because of browser bugs
     * (old - https://bugs.webkit.org/show_bug.cgi?id=30225). So instead of
     * depending on browser behaviour, we just use pageURL
     *
     * TODO: have pfData.config.urls.page.encoded. The only place we need a
     * a decoded version is the text of pf-src-url. That we can do once
     *
    */
    var encodedURL = encodeURI(pageURL);

    var location = pfData.page.location;
    var hostname = decodeURI(location.host).replace(/^www\./, '');
    var pathname = decodeURI(location.pathname).replace(/\/$/, '');

    return '<div id="pf-src">' +
             '<a id="pf-src-url" href="' + encodedURL + '">' +
               '<img id="pf-src-icon" width="16" height="16" src="' + pfData.page.favicon + '" >' +
               '<strong>' + hostname + '</strong>' +
               '<span>' + pathname + '</span>' +
             '</a>' +
           '</div>';
  },

  extractText: function(arr, node) {
    if(node.nodeType === Node.TEXT_NODE) {
      var content = $.trim(node.nodeValue);
      if(content !== '') { arr.push(content); }
    } else if(length > 1 || (node.childNodes.length === 1 && node.childNodes[0].nodeType != Node.TEXT_NODE)) {
      forEachNodeChild(node, function(child) { helper.extractText(arr, child); })
    } else {
      var text = $.trim($(node).text());
      if (text.length) {
        arr.push(text);
      }
    }
  },

  findMeta: function(metas, attr, attr_value) {
    return $.grep(metas, function(elm) { return elm[attr] === attr_value; });
  },

  /**
   * @param {HTMLElement} - Element to check for exclusitivity
   * @returns {Boolean} Returns true in case the element is a simple block wrapper
  */
  isExclusiveBlockElement: function(node) {
    var isSingleChild = node.children && node.children.length === 1;
    if (!isSingleChild) { return false; }

    var styleDisplay = node.getAttribute('data-pf_style_display');

    if (['block', 'flex', 'table-row-group', 'table-row'].indexOf(styleDisplay) >= 0) {
      return true;
    }
    if (styleDisplay === null && node.tagName.toUpperCase() === 'DIV') {
      return true;
    }

    return false;
  },

  hasParentAndGrandParent: function(parent, grandParent) {
    return parent &&
           grandParent &&
           grandParent.tagName !== 'undefined' &&
           grandParent.tagName !== 'BODY' &&
           parent.tagName !== 'BODY' &&
           grandParent.tagName !== 'HTML';
  },

  /* In deeply nested structures it is inefficient to assign scores to the immediate
   * parent if that parent has only one child. Instead we find the parent with more than
   * one child. That parent is more likely to have a collection of content blocks under it
   */
  findNonExclusiveParent: function(node) {
    var parent = node.parentNode;
    var grandParent = parent ? parent.parentNode : null;

    while (this.hasParentAndGrandParent(parent, grandParent) && this.isExclusiveBlockElement(parent)) {
      parent = grandParent;
      grandParent = grandParent.parentNode;
    }
    if (parent.tagName === 'BODY' || parent.tagName === 'HTML') { return; }
    return parent;
  },

  /* Got this from
   * http://stackoverflow.com/questions/3960843/how-to-find-the-nearest-common-ancestors-of-two-or-more-nodes
   */
  getCommonAncestor: function(nodes) {
    if (nodes.length < 2) {
      throw new Error("getCommonAncestor: not enough parameters");
    }

    var node1 = nodes.shift();

    var i,
        method = "contains" in node1 ? "contains" : "compareDocumentPosition",
        test = method === "contains" ? 1 : 0x0010;

    marker:
    /*jshint -W084 */
    while (node1 = node1.parentNode) {
      i = nodes.length;
      while (i--) {
        if ((node1[method](nodes[i]) & test) !== test) {
          continue marker;
        }
      }
      return node1;
    }

    return null;
  }
};

var htmlPreProcessor = {
  run: function(scorer) {
    var $deferred;
    if (pfData.config.platform === 'medium') {
      $('.js-progressiveMedia-canvas, .js-progressiveMedia-thumbnail, [id^="lo-highlight-meter-"]').remove();
      $('.js-progressiveMedia-image').removeClass('hidden-originally');
    }

    $('script,link,style,noscript,object,embed,.comment-list', document.body).remove();

    this.replaceEmbeddedYoutube(scorer);

    // Remove all iframes except Twitter embed and Facebook pages
    $('iframe').not('.twitter-tweet-rendered').not('[src*="https://www.facebook.com/plugins/page.php"]').filter(function() { return !$(this).parent('.twitter-tweet-rendered').length; }).remove();
    $('iframe.twitter-tweet-rendered, .twitter-tweet-rendered iframe, pf-iframe.twitter-tweet-rendered, .twitter-tweet-rendered pf-iframe').each(function() {
      var $el = $(this);

      this.width = $el.data('pf_rect_width');
      this.height = $el.data('pf_rect_height');
    });
    this.fixSvgUseTags();

    if (!pfData.onServer) {
      try {
        this.fixCanvases();
        this.fixInlineSvgs();
        $deferred = $.Deferred().resolve();
      } catch(e) {
        logger.error(e);
        $deferred = $.Deferred().reject();
      }
    } else {
      $deferred = $.Deferred().resolve();
    }

    return $deferred.promise();
  },

  fixCanvases: function() {
    var canvases = document.getElementsByTagName('canvas');
    var canvasDataUrls = pfData.page.canvasDataUrls;

    for (var i = canvases.length - 1; i >= 0 ; i--) {
      var canvas = canvases[i];
      this.convertCanvasToImage(canvas, canvasDataUrls[canvas.getAttribute('pf-dataurl-index')]);
    }
  },

  replaceEmbeddedYoutube: function(scorer) {
    var embeddedYoutubePathPrefix = 'https://www.youtube.com/embed/';

    $("pf-iframe[src^='" + embeddedYoutubePathPrefix +"'], iframe[src^='" + embeddedYoutubePathPrefix +"']").each(function() {
      var video = { id: null, type: null, href: null, thumb: null };

      var videoIdMatch = this.getAttribute('src').match(new RegExp(embeddedYoutubePathPrefix + '([^?]+)'));
      if (videoIdMatch) {
        var id = videoIdMatch[1];

        video.type = 'video'
        video.href = 'https://youtu.be/' + id;
        video.thumb = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
      } else {
        var playlistIdMatch = this.getAttribute('src').match(new RegExp(embeddedYoutubePathPrefix + '.*list=([^\;&]+)'));
        if (playlistIdMatch) {
          var id = playlistIdMatch[1];

          video.type = 'playlist'
          video.href = 'https://www.youtube.com/playlist?list=' + id;
          video.thumb = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
        }
      }

      // NOTE: video is not parsed
      if (!video.type) { return; }

      var wrapperLink = scorer.tree.createElement('a');
      wrapperLink.node.href = video.href;
      wrapperLink.node.setAttribute('data-pf-allow-empty', '1');
      commonUtils.addClassTo(wrapperLink.node, 'youtube-replace-link');

      var img = scorer.tree.createElement('img');
      img.node.src = video.thumb;
      img.node.setAttribute('pf-restore-src', video.thumb);
      commonUtils.addClassTo(img.node, 'youtube-replace-img');

      var span = scorer.tree.createElement('span');
      span.appendChild(scorer.tree.createTextNode(video.href));

      DomScorerModifier.toElem(this.parentElement).replaceChild(wrapperLink, this);
      wrapperLink.appendChild(img);
      wrapperLink.appendChild(span);
    });
  },

  fixInlineSvgs: function(scorer) {
    $('svg').map(function() { htmlPreProcessor.processSvg(this); });
  },


  processSvg: function(svg) {
    var width = commonUtils.getSvgImageWidth(svg, pfData.onServer);
    var height = commonUtils.getSvgImageHeight(svg, pfData.onServer);

    // NOTE: prevent definition svgs to be converted to png
    // as they are invisible and only used for <use /> references
    // from other svgs
    if (width === 0 || height === 0) {
      svg.parentNode.removeChild(svg);
      return;
    }

    var scaledDimensions = htmlPreProcessor.scaleImageDimensions({width: width, height: height});
    this.fixSvgAttrs(svg, scaledDimensions.width, scaledDimensions.height);
  },

  fixSvgUseTags: function() {
    $('svg').each(function() {
      var svg = $(this);
      svg.find('use').each(function () {
        var useTag = $(this);
        var refId = useTag.attr('xlink:href');
        if(!refId || refId[0] !== '#') {
          svg.remove();
          return false;
        }
        // NOTE: sometimes there is junk inside `xlink:href`
        // in order to prevent invalid ids we have to wrap it with try-catch
        var refTag = [];
        try {
          refTag = $(useTag.attr('xlink:href'));
        } catch(e) {}
        if (refTag.length) {
          useTag.replaceWith(refTag.children().clone());
        } else {
          svg.remove();
          return false;
        }
      });
    });
  },

  fixSvgAttrs: function(svg, width, height) {
    if (!svg.getAttribute('version')) {
      svg.setAttribute('version', 1.1);
    }

    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    try {
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
    } catch(e) {}
  },

  convertCanvasToImage: function(canvas, dataUrl) {
    var classNames, image;

    classNames = canvas.getAttribute('class');
    classNames = classNames ? classNames : '';
    classNames += ' canvas-png';

    image = new Image();
    image.src = dataUrl;
    image.setAttribute('class', classNames);
    canvas.parentNode.replaceChild(image, canvas);
  },

  scaleImageDimensions: function(dimensions) {
    dimensions.width = parseInt(dimensions.width, 10);
    dimensions.height = parseInt(dimensions.height, 10);

    if (dimensions.width > pfData.config.maxImageWidth) {
      var scale = pfData.config.maxImageWidth / dimensions.width;
      dimensions.width = dimensions.width * scale;
      dimensions.height = dimensions.height * scale;
    }

    return dimensions;
  }
};

/*
 * Check for NSFW phrases and resolve state deferred to 'absent'/'present' for supported language
 * or to 'unknown' if language not found or not supported.
 */
var nsfwChecker = {
  matchedPhrase: '',
  // can be resolved to ['unknown', 'absent', 'present']
  state: $.Deferred(),

  checkText: function(text) {
    // Notify core window as soon as state changed
    this.state.then(function(nsfwState) {
      contentData.nsfwState = nsfwState;
      contentData.nsfwMatchedPhrase = nsfwChecker.matchedPhrase;
      messageBus.postMessage('core', 'PfNSFWChecked', {state: nsfwState, matchedPhrase: nsfwChecker.matchedPhrase});
    });

    var lang = pfData.page.language || 'en';

    // Use just first part of language iso code
    lang = lang.split('-')[0];

    var supportedLanguages = ["common","en","ar","bn","cs","da","de","eo","es","fi","fr","he","hi","hu","it","ja","ko","nl","no","pl","pt","ro","ru","sv","ta","th","tlh","tr","vi","zh"];

    if ($.inArray(lang, supportedLanguages) != -1) {
      $.getJSON("//cdn.printfriendly.com/assets/client/nsfw/nsfw.json", function(data) {
        nsfwChecker.checkContentForPhrases(text, data, lang);
      }).fail(function() {
        nsfwChecker.state.resolve('unknown');
      });
    } else {
      this.state.resolve('unknown');
    }
  },

  checkContentForPhrases: function(content, nsfwPhrases, lang) {
    logger.time('Check for NSFW');

    // Use custom regex because \b is not supported in javascript for unicode
    // Since we are combining common and lang phrases, a single wordseparator which
    // works universally is needed
    var wordsSeparator = '(?:^|\\s|$|\\.|,|!|\\?|\\)|\\(|"|\')';

    // NOTE: in somecases lang is not in our nsfwPhrases in this case we fallback to 'en'
    if(!nsfwPhrases[lang]) { lang = 'en'; }

    var nsfwList = nsfwPhrases['common'].concat(nsfwPhrases[lang]);

    var regex = new RegExp(wordsSeparator + "(" + nsfwList.join("|") + ")" +  wordsSeparator, "i");
    var match = content.match(regex);
    if (match) {
      nsfwChecker.matchedPhrase = match[0];
      logger.log('NSFW detected: ' + nsfwChecker.matchedPhrase);
      this.state.resolve('present');
    } else {
      this.state.resolve('absent');
    }

    logger.timeEnd('Check for NSFW');
  }
};
