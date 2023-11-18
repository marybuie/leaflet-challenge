var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
  });
  
  // tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(myMap);
  
  // Fetch the JSON data using d3
  // I decided that I wanted to study the significant earthquakes over the past 30 days
  // instead of all earthquake data over the past week, just to cater to my own interests. 
  //As a result, I have fewer data points in my visualization, but the url
  // for all earthquakes over past 7 days could easily be substituted into my code.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson")
  .then((earthquakeData) => {
    earthquakeData.features.forEach((earthquake) => {
      var magnitude = earthquake.properties.mag;
      var depth = earthquake.geometry.coordinates[2];
  
        var marker = L.circleMarker(
          [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],
          {
            radius: magnitude * 3, // I would recommend decreasing marker size to magnitude * 2 if using a JSON with more data points
            color: '#DFFF00', // Chartreuse, the color of danger
            fillColor: getColor(depth), 
            fillColor: getColor(depth),
            fillOpacity: 1,
            weight: 1.5,
          }
        );
  
        // Popups
        marker.bindPopup(
          `<h3>${earthquake.properties.title}</h3><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`
        );
  
        marker.addTo(myMap);
      });
  
// Legend
var legend = L.control({ position: "bottomright" });

// Legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  var depths = [0, 10, 20, 30, 40, 50];

  // Style for the legend container
  div.style.backgroundColor = 'white';
  div.style.padding = '10px';
  div.style.borderRadius = '10px';

  // Loop through depths and generate a label with a colored square for each interval
  for (var i = 0; i < depths.length; i++) {
    var colorBox = '<span style="background:' + getColor(depths[i] + 1) + '; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></span>';
    var depthText = depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+');
    
    // Style for each legend item
    var legendItemStyle = 'display: flex; justify-content: space-between; align-items: center;';

    div.innerHTML += '<div style="' + legendItemStyle + '">' + colorBox + '<span style="color: black;">' + depthText + '</span></div>';
  }

  return div;
};

// Add legend to the map
legend.addTo(myMap);
  
      // Function to get color based on depth
      function getColor(depth) {
        // I got bored, so I changed the hex palette to something a little more autumnal.
        // Palette sourced from https://coolors.co/gradient-palette/5207f2-ff9900?number=6
        // Seems kind of crazy to me that an earthquake with a depth of 77
        // would be the same color as an earthquake with a depth of 550,
        // but for the sake of this assignment, I think these ranges will have to suffice.
    
        return depth > 50 ? "#5207F2" :
               depth > 40 ? "#7524C2" :
               depth > 30 ? "#974191" :
               depth > 20 ? "#BA5F61" :
               depth > 10 ? "#DC7C30" :
                            "#FF9900";
      }
    });