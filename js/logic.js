var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    
    var baseMaps = {
      "Light Map": streetmap
    };
    
 
    var myMap=L.map("map-id", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers:[streetmap]
    })



function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><h4> Magnitude: "+feature.properties.mag+"</h4>"+"<p>" + new Date(feature.properties.time) + "</p>");
}
function eqcolors(mag) {
  if (mag >= 5) {
    return "#e50606"
  }
  else if (mag >=4) {
    return "#e8a355"
  }
  else if (mag >=3) {
    return "#e8d655"
  }
  else if (mag >=2) {
    return "#cfe855"
  }
  else if (mag >=1) {
    return "#abe855"
  }
  else {
    return "#5fe855"
  }
}
function radius(mag) {
  if (mag > 5) {
    return 25
  }
  else if (mag >4) {
    return 20
  }
  else if (mag >3) {
    return 15
  }
  else if (mag >2) {
    return 10
  }
  else if (mag >1) {
    return 5
  }
  else {
    return 2.5
  }
}
function eqstyle(feature){
  return {
    radius: radius(feature.properties.mag),
    fillColor: eqcolors(feature.properties.mag),
    color: eqcolors(feature.properties.mag),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
}
var legend = L.control({positon: "bottomright"})
legend.onAdd = function (myMap){
  var div = L.DomUtil.create('div',"info legend")
  var limits = ['0-1','1-2','2-3','3-4','4-5','5+']
  // var colors = ["#e50606", "#e8a355", "#e8d655", "#cfe855", "#abe855", "#5fe855"]
  var labels = []
  var colors =[]

  var legendInfo = "<h1>Earthquake Magnitude</h1>" +
  "<div class=\"labels\">" +
  "</div>";

  div.innerHTML = legendInfo

  limits.forEach(function(limit, index) {
    labels.push("<li>"+limit+"</li>");
  }); 
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  limits.forEach(function(limit, index) {
    colors.push("<li style=\"background-color: " + eqcolors(index) + "\">"+"</li>");
  }); 
  div.innerHTML += "<ul>" + colors.join("") + "</ul>";
  return div;
}
legend.addTo(myMap)
queryURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(queryURL,function(response){
  console.log(response)
  L.geoJSON(response, {
    onEachFeature:onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker (latlng, eqstyle(feature))
    }
  }).addTo(myMap)

})



