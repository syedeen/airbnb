 




    var map = L.map('map').setView([mapCoords.lat, mapCoords.lon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
      
  var marker = L.marker([mapCoords.lat, mapCoords.lon]).addTo(map)


     
