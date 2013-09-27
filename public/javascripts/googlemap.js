var map;

function initialize() {
  var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(37.487707, 126.993598),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);