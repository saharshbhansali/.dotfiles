// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview Google Analytics for Google Dictionary extension.
 * @author sadovsky@google.com (Adam Sadovsky)
 */

goog.module('google3.translating.dictionary.chrome.ga');

const Const = goog.require('goog.string.Const');
const TrustedResourceUrl = goog.require('goog.html.TrustedResourceUrl');
const {safeScriptEl} = goog.require('safedom');

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-23514435-1']);
// Sample 10% of events to reduce the load on Google Analytics.
_gaq.push(['_setSampleRate', '10']);
// Note, we do not call _trackPageview since Chrome arbitrarily stops and starts
// background pages, rendering the pageview count meaningless and overwhelming
// the Analytics service.

(function() {
  let ga = /** @type {!HTMLScriptElement} */ (document.createElement('script'));
  ga.type = 'text/javascript';
  ga.async = true;
  safeScriptEl.setSrc(
      ga,
      TrustedResourceUrl.fromConstant(
          Const.from('https://ssl.google-analytics.com/ga.js')));
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
