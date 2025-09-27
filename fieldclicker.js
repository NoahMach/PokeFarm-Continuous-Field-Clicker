// ==UserScript==
// @name         PokéFarm Auto Feed + Next
// @namespace    https://github.com/NoahMach/PokeFarm-Continuous-Field-Clicker
// @version      2.0
// @description  Automatically clicks "Feed All Pokémon" and then "Next >" on PokéFarm fields with instant reaction, starting 2 seconds after page load.
// @author       NoahMach
// @match        https://pokefarm.com/fields/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("PokéFarm Auto Feed + Next script loaded.");

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

            if (feedBtn && !feedBtn.disabled) {
                console.log("Clicking Feed All Pokémon...");
                feedBtn.click();

                console.log("Waiting for Next > to become enabled...");
                await waitUntil(() => {
                    const btn = getNextButton();
                    return btn && !btn.disabled;
                });

                const nextBtnNow = getNextButton();
                if (nextBtnNow && !nextBtnNow.disabled) {
                    console.log("Clicking Next > ...");
                    nextBtnNow.click();
                    await new Promise(r => setTimeout(r, 500));
                }
            } else if (feedBtn && feedBtn.disabled) {
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

            await new Promise(r => setTimeout(r, 200));
        }
    }

    window.addEventListener("load", () => {
        console.log("Page loaded. Starting automation in 2 seconds...");
        setTimeout(loop, 2000);
    });

})();
