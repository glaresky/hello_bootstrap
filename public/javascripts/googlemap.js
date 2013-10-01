var defaultLatLng;
var map;
var service;
var infowindow;
var mapCircle;

var gmarkers = []; 
var map = null;
var circle = null;
var geocoder = new google.maps.Geocoder();
var latlng;

function initialize() {
	geocoder = new google.maps.Geocoder();
	latlng = new google.maps.LatLng(37.4881848,126.99825829999997);
	var mapOptions = {
	zoom: 15,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var icon;
  var cate;

	jQuery.ajax({
	   type:"GET",
	   url:"/test.json",
	   dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
	   success : function(data) {
	         // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
	         // TODO
	         for(var i=0; i<data.data.length; i++){
	         	//contentArray.push(data.data[i].nm);
	         	if(data.data[i].category == "cafe"){
	         		icon = "images/cafe.jpg";	
              cate = "까페";
	         	}else if (data.data[i].category == "ashtray"){
					    icon = "images/smokingarea.jpg";	
              cate = "재떨이";
	         	}else{
	         		icon = "images/googlemap_icon.png";	
              cate = "기타";
	         	}

            var point = new google.maps.LatLng(data.data[i].latitude,data.data[i].longitude);
            var html="<b>"+data.data[i].nm+"</b><br>"+cate;
            var marker = createMarker(point,html,icon);

            //markerArray.push(mapLatLng(data.data[i].latitude, data.data[i].longitude));

	         	console.log(i);
	         }
	   	},
	   	error : function(xhr, status, error) {
	         alert("error!");
	   	},
	   	complete: function() {
	   		console.log("complete");
     	}
	});
}



function searchLocation(query) {
	console.log(query);
	var request = {
		location: latlng,
		radius: 1000,
		query: query
	};

	console.log(request);

	service = new google.maps.places.PlacesService(map);
	console.log(service);
	service.textSearch(request, callbackMarker);
}

function callbackMarker(results, status) {
	console.log("callbackMarker");
	var radius = parseInt($("#radius").val()*1000);

	console.log(radius);

	if (status == google.maps.places.PlacesServiceStatus.OK) {
		// for (var i=0 ; i< results.length ; i++) {
		// 	var place = results[i];
		// 	createMarker(results[i]);
		// }
		if (results.length > 0) {
			alert("검색 성공! 첫번째 값으로 이동합니다.");
			map.setCenter(results[0].geometry.location);
		    var searchCenter = results[0].geometry.location;

			if (circle) circle.setMap(null);
		    circle = new google.maps.Circle({
		  		strokeColor: '#000000',
		      	strokeOpacity: 0.8,
		      	strokeWeight: 2,
		      	fillColor: '#808080',
		      	fillOpacity: 0.5,
		      	map: map,
		      	center:searchCenter,
		      	radius: $("#radius").val()*1000
		    });

		    var bounds = new google.maps.LatLngBounds();
		    var foundMarkers = 0;
		    for (var i=0; i<gmarkers.length;i++) {
		    	if (google.maps.geometry.spherical.computeDistanceBetween(gmarkers[i].getPosition(),searchCenter) < radius) {
		          	bounds.extend(gmarkers[i].getPosition())
		          	gmarkers[i].setMap(map);
		          
		          	foundMarkers++;
		        } else {
		          gmarkers[i].setMap(null);
		        }
		    }

		    if (foundMarkers > 0) {
        		map.fitBounds(bounds);
      		} else {
        		map.fitBounds(circle.getBounds());
      		}
		}
	}
	else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
		alert("검색 결과가 없습니다.");
	}
	else {
		alert("문제가 있네요.");
	}
}

function createMarker(latlng, html, icon) {
    var contentString = html;
    var marker = new google.maps.Marker({
        position: latlng,
        title: name,
        icon: icon,
        zIndex: Math.round(latlng.lat()*-100000)<<5
        });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString); 
        infowindow.open(map,marker);
    });
    // save the info we need to use later for the side_bar
    gmarkers.push(marker);
    // add a line to the side_bar html
}

var infowindow = new google.maps.InfoWindow(
  { 
    size: new google.maps.Size(150,50)
  });

$(document).ready(function() {
	$('#search_btn').click(function(e) {
		e.preventDefault();
		var search_nm = $('input[name=search_nm]').val();
		searchLocation(search_nm);
	});
	initialize();
});