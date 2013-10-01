var defaultLatLng;
var map;
var service;
var infowindow;
var mapCircle;

function initialize() {
	defaultLatLng = new google.maps.LatLng(37.4881848,126.99825829999997);

	var mapOptions = {
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: defaultLatLng
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	var populationOptions = {
		strokeColor: '#000000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#808080',
		fillOpacity: 0.5,
		map: map,
		center: defaultLatLng,
		radius: 1000
	};
	mapCircle = new google.maps.Circle(populationOptions);
}

function searchLocation(query) {
	console.log(navigator.geolocation);
	var request = {
		location: defaultLatLng,
		radius: 1000,
		query: query
	};

	service = new google.maps.places.PlacesService(map);
	service.textSearch(request, callbackMarker);
}

function callbackMarker(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// for (var i=0 ; i< results.length ; i++) {
		// 	var place = results[i];
		// 	createMarker(results[i]);
		// }
		if (results.length > 0) {
			alert("검색 성공! 첫번째 값으로 이동합니다.");
			map.setCenter(results[0].geometry.location);
			mapCircle.setCenter(results[0].geometry.location);
			createMarker(results[0]);
		}
	}
	else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
		alert("검색 결과가 없습니다.");
	}
	else {
		alert("문제가 있네요.");
	}
}

function createMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	console.log(place);
}

$(document).ready(function() {
	$('#search_btn').click(function(e) {
		e.preventDefault();
		var search_nm = $('input[name=search_nm]').val();
		searchLocation(search_nm);
	});
	initialize();
});