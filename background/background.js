//GNU GPL v3
//Please visit our github page: https://github.com/incpi/Swift-Helper-Extension

'use strict';

//activate on this site
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlMatches: '.*\/.*(.saralgujarat.in|.convegenius.ai)\/.*?' },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});