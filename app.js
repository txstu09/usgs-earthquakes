var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {
    
    function onEachFeature(feature, layer) {
        let magnitude = feature.properties.mag.toString();
        let time = new Date(feature.properties.time);
        let location = feature.properties.place;

        layer.bindPopup("<h3>" + location + "</h3><hr><p>" + time + "<br>" + "Magnitude: " + magnitude +"</p>");
    }

    function radius(magnitude) {
        var a = magnitude;
        var r = Math.sqrt(a/Math.PI);
        var radius = Math.pow(10, r);
        return radius;
    }

    function getColor(mag) {
        return mag > 5 ? '#580000' :
            mag > 4 ? '#ee3e32' :
            mag > 3 ? '#f06b0b' :
            mag > 2 ? '#fbb021' :
            mag > 1 ? '#1b8a5a' :
            '#409eff';
    }

    function pointToLayer(feature, latlng) {
        var markerOptions = {
            radius: radius(feature.properties.mag),
            color: '#000000',
            weight: 0.5,
            fillColor: getColor(feature.properties.mag),
            fillOpacity: 1
            };

        return L.circleMarker(latlng, markerOptions);
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: pointToLayer,
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

    //Uncaught ReferenceError: getColor is not defined ????????
    /*
    var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (myMap) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1, 2, 3, 4, 5],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

    legend.addTo(myMap);
    */

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);
}