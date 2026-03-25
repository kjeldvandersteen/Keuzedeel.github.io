//#region TILE LAYER
// link naar de kaart en de copyright informatie
var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var extraLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var cycleMap = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© CyclOSM | © OpenStreetMap contributors'
});
//#endregion

//#region Layer 1
var Provincies = L.layerGroup();

// GeoJSON data van steden in Nederland
var geoJSONLayer = fetch('nl.json')
  .then(response => response.json())
  .then(data => {
    return L.geoJSON(data, {
      style: { color: "#185be1", weight: 2 },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name); // province name
      }
    }).addTo(Provincies);
  });
//#endregion

//#region Layer 2
var Utrecht = L.marker([52.0907, 5.1214]).bindPopup('Utrecht'),
    DenHaag = L.marker([52.0705, 4.3007]).bindPopup('Den Haag'),
    DenBosch = L.marker([51.6860, 5.3037]).bindPopup('Den Bosch'),
    Haarlem = L.marker([52.3874, 4.6462]).bindPopup('Haarlem'),
    Zwolle = L.marker([52.5168, 6.0830]).bindPopup('Zwolle'),
    Leeuwarden = L.marker([53.2012, 5.7999]).bindPopup('Leeuwarden'),
    Groningen = L.marker([53.2194, 6.5665]).bindPopup('Groningen'),
    Maastricht = L.marker([50.8514, 5.6900]).bindPopup('Maastricht'),
    middelburg = L.marker([51.4833, 3.5833]).bindPopup('Middelburg'),
    lelystad = L.marker([52.5186, 5.4697]).bindPopup('Lelystad'),
    assen = L.marker([52.9921, 6.5645]).bindPopup('Assen');

var Hoofdsteden = L.layerGroup([Utrecht, DenHaag, DenBosch, Haarlem, Zwolle, Leeuwarden, Groningen, Maastricht, middelburg, lelystad, assen]);
//#endregion

//#region Layer 3
map.locate({ setView: true, maxZoom: 16 });

// Success handler
map.on('locationfound', function(e) {
  L.marker(e.latlng)
    .addTo(map)
    .bindPopup("You are here!")
    .openPopup();

  // Show accuracy circle
  L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
});
//#endregion

//#region MAP INITIALIZATION
// de kaart centreren op Nederland
var netherlandsBounds = L.latLngBounds(L.latLng(50.7, 3.3), L.latLng(53.7, 7.3));
var map = L.map('map', {maxBounds: netherlandsBounds, maxBoundsViscosity: 1.00, layers: [baseLayer, Hoofdsteden]});
map.fitBounds(netherlandsBounds);
//#endregion

//#region CONTROLS
// schaal links onder
L.control.scale({
    metric: true,
    imperial: false,
    position: 'bottomleft',
}).addTo(map);
//#endregion


//#region LAYER CONTROL
var baseMaps = {
    "OpenStreetMap": baseLayer,
    "OpenTopoMap": extraLayer,
    "CycleMap": cycleMap
};
var overlayMaps = {
    "hoofdsteden": Hoofdsteden,
    "provincies": Provincies
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
//#endregion
