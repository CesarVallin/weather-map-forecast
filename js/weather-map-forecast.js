


console.log(`hello from weather_map.js`);
import {sayHello, initializeMap, searchPack} from './weather-map-forecast-utils.js'

(() => {
    // Test exported function:
    sayHello();
    // -------------------------------------------------------------------------------------------------
    // Variables...
    const map = initializeMap();
    // Search input:
    const searchBoxInput = document.querySelector('#search-input');
    // Search button:
    const searchBtn = document.querySelector('#button-addon1');

    // -------------------------------------------------------------------------------------------------
    // Events:
    // Search button event listener...
    searchBtn.addEventListener('click', (e) => {
        searchPack(map, searchBoxInput);
        searchBoxInput.value = '';
    });
    // Search enter key-up event listener...
    searchBoxInput.addEventListener('keyup', (e) => {
        // For enter, e.keyCode is 13
        if (e.keyCode === 13) {
            searchPack(map, searchBoxInput);
            searchBoxInput.value = '';
        }
    });

})();