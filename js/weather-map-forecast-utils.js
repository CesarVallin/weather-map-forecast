// WEATHER_MAP-UTILITIES

// Define a variable to store the previous marker
// To be used to check and remove previous markers
let previousMarker = null;
// Define a variable to store the current marker coordinates.
// To be used to update ajax request
let markerLatLng = null;

// Define variable to clear five-dayParent div before next search
const fiveDayParentDiv = document.querySelector('#five-dayParent');
// To render city name and image...
const dynamicName = document.querySelector('#dynamic-city');

// -------------------------------------------------------------------------------------------------
// Test function:
export function sayHello() {
    console.log(`hello from weather_map-utilities.js`);
}
// -------------------------------------------------------------------------------------------------
// Initialize map function:
export function initializeMap() {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const mapOptions = {
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        zoom: 3,
        center: [-95.712891, 37.09024],
    }
    return new mapboxgl.Map(mapOptions);
}
// ------------------------------------------------------------------------------------------------
// Searchbox function... ENABLES search data for 'getter' function
export function searchPack(map, searchBoxInput) {
    geocode(searchBoxInput.value, MAPBOX_TOKEN).then((data) => {
        console.log(data);
        // EXECUTES weatherAPI based on searchBoxInput ////////////////////////////////////////////////////////
        // -----------------------------------------------------------------
        // Remove the previous marker (if it exists)
        if (previousMarker) {
            previousMarker.remove();
        }
        // -----------------------------------------------------------------
        // Create one marker
        let marker = new mapboxgl.Marker({
            draggable: true
        })
            .setLngLat(data)
            .addTo(map)
        console.log(marker.getLngLat(), `Yay, typed`);
        // ------------------------------------------------------------------
        // Update the previousMarker variable to the current marker
        // Only one marker per search
        previousMarker = marker;
        // ------------------------------------------------------------------
        // Fly to your current coordinates
        map.flyTo({
            center: data,
            zoom: 10
        });
        // -----------------------------------------------------------------
        // AJAX request based on 'markerLatLng' - (current marker positioning)
        markerLatLng = marker.getLngLat();
        getMapAndWeather(markerLatLng);
        // ----------------------------------------------------
        // weatherAPI COMPLETED based on searchBoxInput ////////////////////////////////////////////////////////
        // -----------------------------------------------------------
        // EXECUTES weatherAPI based on marker drag +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        marker.on('dragend', function () {
            // Fly to your current coordinates
            map.flyTo({
                center: marker.getLngLat(),
                zoom: 10
            });
            console.log(marker.getLngLat(), `Yay, dragged`);
            // ----------------------------------------------------
            // AJAX request based on 'markerLatLng' - (current marker positioning)
            markerLatLng = marker.getLngLat();
            getMapAndWeather(markerLatLng);
            // ----------------------------------------------------
        })
        // weatherAPI COMPLETED based on marker drag ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // ----------------------------------------------------------
    });
}
// ------------------------------------------------------------------------------------------------
// Function getting map from Mapbox and weather from OpenWeatherMap ... 'GETTER FUNCTION'
function getMapAndWeather (markerLatLng) {
    // clear fiveDayParentDiv innerHTML before 'getting' & 'rendering' new information.
    fiveDayParentDiv.innerHTML = '';
    $.ajax(`https://api.openweathermap.org/data/2.5/forecast?lat=${markerLatLng.lat.toString()}&lon=${markerLatLng.lng.toString()}&units=imperial&appid=${OPEN_WEATHER_APPID}`).done((weatherAPI) => {
        console.log(weatherAPI);
        console.log(weatherAPI.city.name, weatherAPI.city.country, `from weatherAPI`);
        renderWeather(weatherAPI);
    })
}
// ------------------------------------------------------------------------------------------------
// Function rendering weatherAPI, 'render function'...
function renderWeather(weatherAPI) {
    // ----------------------------------------------------------------------------------
    // Rendering city name and image...
    dynamicName.innerHTML = '';
    const dynamicNameDiv = document.createElement('div');
    dynamicNameDiv.classList.add("d-flex", "flex-column", "align-items-center");
    dynamicNameDiv.innerHTML = `
            <div class="dynamic-cityAndTemp text-center">
                <p class="m-0">${weatherAPI.city.name}, ${weatherAPI.city.country} - current temp: ${weatherAPI.list[0].main.temp}°F
                </p>
            </div>
            <div>
                <img src="../img/kids-meditate-removebg-preview-thisone%20copy.png" class="kids-image py-2">
            </div>
    `;
    dynamicName.appendChild(dynamicNameDiv);
    // ----------------------------------------------------------------------------------
    // Rendering 5 day forecast...
    const minMaxTemps = returnMinMaxTemps(weatherAPI).slice(0, 5); // safe guard to only receive 5 items.
    console.log(minMaxTemps)
    // Moving for 5 days (minMaxTemps)(per single day)
    // Index being multiplied by 8 every time the forEach loop executes
    minMaxTemps.forEach((singleDay, index) => {
        console.log(weatherAPI);
        console.log(minMaxTemps);
        let singleDayDivParent = document.createElement('div');
        singleDayDivParent.classList.add('col')
        singleDayDivParent.innerHTML = `
                <div class="text-center singleDayDiv">
                    <p class="singleDayDate">
                        ${singleDay.date}
                    </p>
                    <p>
                        ${singleDay.min}°F / ${singleDay.max} °F
                    </p>
                    <img src="https://openweathermap.org/img/wn/${weatherAPI.list[index * 8].weather[0].icon}@2x.png">
                    <p>
                        ${weatherAPI.list[index * 8].weather[0].description}<br>
                        wind speed : ${weatherAPI.list[index * 8].wind.speed}<br>
                        pressure: ${weatherAPI.list[index * 8].main.pressure}<br>
                        ${weatherAPI.city.name}<br>
                    </p>
                </div>
            `;
        fiveDayParentDiv.appendChild(singleDayDivParent);
    });
    // Console logs below proving information above!!
    const minMaxTemps1 = returnMinMaxTemps(weatherAPI).slice(0, 5) // Safe guard to only receive 5 items
    console.log(minMaxTemps1);
    for(let i = 0; i < minMaxTemps1.length; i++) {
        console.log(i, minMaxTemps1[i], `from minMaxTemps1`);
        console.log(i, i * 8, weatherAPI.list[i * 8].weather[0].description, `from weatherAPI`);
        console.log(i, i * 8, weatherAPI.list[i * 8].wind.speed, `from weatherAPI`);
        console.log(i, i * 8, weatherAPI.list[i * 8].main.pressure, `from weatherAPI`);
    }
}


