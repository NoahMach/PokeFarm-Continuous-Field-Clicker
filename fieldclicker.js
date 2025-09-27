// ==UserScript==
// @name         PokéFarm Auto Feed + Next (Delayed Start, Instant Reaction)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Wait 2 seconds after page load, then instantly click "Feed All Pokémon" and "Next >" on PokéFarm fields
// @author       NoahMach
// @match        https://pokefarm.com/fields/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("PokéFarm Auto Feed + Next (Delayed Start, Instant Reaction) loaded.");

    function getFeedAllButton() {
        return Array.from(document.querySelectorAll('button, input[type="button"]'))
                    .find(btn => btn.innerText?.trim() === "Feed All Pokémon");
    }

    function getNextButton() {
        return document.querySelector('[data-action="next"]');
    }

    async function waitUntil(conditionFn, interval = 200) {
        while (!conditionFn()) {
            await new Promise(r => setTimeout(r, interval));
        }
    }

    async function loop() {
        while (true) {
            const feedBtn = getFeedAllButton();
            const nextBtn = getNextButton();

            // Click "Feed All Pokémon" if available
            if (feedBtn && !feedBtn.disabled) {
                console.log("Clicking Feed All Pokémon...");
                feedBtn.click();

                // Wait until Next > is enabled
                console.log("Waiting for Next > to become enabled...");
                await waitUntil(() => {
                    const btn = getNextButton();
                    return btn && !btn.disabled;
                });

                // Click Next > immediately
                const nextBtnNow = getNextButton();
                if (nextBtnNow && !nextBtnNow.disabled) {
                    console.log("Clicking Next > ...");
                    nextBtnNow.click();
                    await new Promise(r => setTimeout(r, 500));
                }
            }
            // If Feed All Pokémon is disabled but Next > is enabled, click Next >
            else if (feedBtn && feedBtn.disabled) {
                const nextBtnNow = getNextButton();
                if (nextBtnNow && !nextBtnNow.disabled) {
                    console.log("Clicking Next > ...");
                    nextBtnNow.click();
                    await new Promise(r => setTimeout(r, 500));
                } else {
                    console.log("No more actions possible. Stopping automation.");
                    break;
                }
            }

            // Short delay to prevent tight CPU loop
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // Start the loop 2 seconds after page load
    window.addEventListener("load", () => {
        console.log("Page loaded. Starting automation in 2 seconds...");
        setTimeout(loop, 2000);
    });

})();
