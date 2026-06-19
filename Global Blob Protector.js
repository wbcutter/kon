// ==UserScript==
// @name         Global Blob Protector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        *://*/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function patch(win) {
        try {
            if (win.__blobPatched) return;
            win.__blobPatched = true;

            const fake = function(url) {
                console.warn('[BLOCKED]', url);
            };

            win.URL.revokeObjectURL = fake;

            Object.defineProperty(win.URL, 'revokeObjectURL', {
                value: fake,
                writable: false,
                configurable: false
            });

        } catch (e) {}
    }

    patch(window);

    new MutationObserver(() => {
        document.querySelectorAll('iframe').forEach(frame => {
            try {
                patch(frame.contentWindow);
            } catch (e) {}
        });
    }).observe(document, {
        childList: true,
        subtree: true
    });
})();