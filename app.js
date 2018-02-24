var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    /*function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + features.properties.place + 
            "</h3><hr><p>" + new Date(features.properties.time) + "<br>" +
            " Magnitude: " + features.properties.mag + "</p>");
    }*/
    
    function onEachFeature(feature, layer) {
        let magnitude = feature.properties.mag.toString();
        let time = new Date(feature.properties.time);
        let location = feature.properties.place;

        layer.bindPopup("<h3>" + location + "</h3><hr><p>" + time + "<br>" + "Magnitude: " + magnitude +"</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidHhzdHUwOSIsImEiOiJjamUxdXJjODkzenk5MndtdTd1YmJsc3VyIn0.s-XDixpmijcRYL-oINQqZw");
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidHhzdHUwOSIsImEiOiJjamUxdXJjODkzenk5MndtdTd1YmJsc3VyIn0.s-XDixpmijcRYL-oINQqZw");

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);
}