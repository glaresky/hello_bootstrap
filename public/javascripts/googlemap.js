var contentArray = [];
var iConArray = [];
var markers = [];
var iterator = 0;
var map;
var geocoder;

function mapLatLng(x,y){
	return new google.maps.LatLng(x,y)
}

var markerArray = [
];

function initialize() {
	geocoder = new google.maps.Geocoder();

	var mapOptions = {
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: new google.maps.LatLng(37.4881848,126.99825829999997)
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	var populationOptions = {
		strokeColor: '#000000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#808080',
		fillOpacity: 0.5,
		map: map,
		center: new google.maps.LatLng(37.4881848,126.99825829999997) ,
		radius: $("#radius").val()*1000
	};
	cityCircle = new google.maps.Circle(populationOptions);
}

// 주소 검색
function showAddress() {
	var address = $("#address").val();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				draggable: true
			});

			google.maps.event.addListener(marker, "dragend", function(event) {
				var point = marker.getPosition();
				$("#latitude").val(point.lat());
				$("#longitude").val(point.lng());

				var populationOptions = {
					strokeColor: '#000000',
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#808080',
					fillOpacity: 0.5,
					map: map,
					center: new google.maps.LatLng($("#latitude").val(),$("#longitude").val()) ,
					radius: $("#radius").val()*1000
				};
				if (cityCircle)
				{
					cityCircle.setMap(null);
				}
				cityCircle = new google.maps.Circle(populationOptions);
			});

			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();

			$("#latitude").val(lat);
			$("#longitude").val(lng);

			var populationOptions = {
				strokeColor: '#000000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#808080',
				fillOpacity: 0.5,
				map: map,
				center: new google.maps.LatLng(lat,lng) ,
				radius: $("#radius").val()*1000
			};
			if (cityCircle)
			{
				cityCircle.setMap(null);
			}
			cityCircle = new google.maps.Circle(populationOptions);

		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

// 드롭 마커 보기
function viewMarker() {
	for (var i = 0; i < markerArray.length; i++) {
		setTimeout(function() {
			addMarker();
		}, i * 300);
	}

	var marker = new google.maps.Marker ({
			position: new google.maps.LatLng(37.4881848,126.99825829999997),
			map: map,
			draggable: true
		});

	google.maps.event.addListener(marker, "dragend", function(event) {
		var point = marker.getPosition();
		$("#latitude").val(point.lat());
		$("#longitude").val(point.lng());

		var populationOptions = {
			strokeColor: '#000000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#808080',
			fillOpacity: 0.5,
			map: map,
			center: new google.maps.LatLng($("#latitude").val(),$("#longitude").val()) ,
			radius: $("#radius").val()*1000
		};
		if (cityCircle)
		{
			cityCircle.setMap(null);
		}
		cityCircle = new google.maps.Circle(populationOptions);
	});
}

// 마커 추가
function addMarker() {

	var marker = new google.maps.Marker({
		position: markerArray[iterator],
		map: map,
		draggable: false,
		icon: iConArray[iterator],
		animation: google.maps.Animation.DROP
	});
	markers.push(marker);

	var infowindow = new google.maps.InfoWindow({
      content: contentArray[iterator]
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});
	iterator++;
}

// 중심 이동
function fnLocation(lat, lng) {
	myLocation = new google.maps.LatLng(lat, lng);
	map.setCenter(myLocation);
}

//google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function(){
	     jQuery.ajax({
           type:"GET",
           url:"/test.json",
           dataType:"JSON", // 옵션이므로 JSON으로 받을게 아니면 안써도 됨
           success : function(data) {
                 // 통신이 성공적으로 이루어졌을 때 이 함수를 타게 된다.
                 // TODO
                 for(var i=0; i<data.data.length; i++){
                 	contentArray.push(data.data[i].nm);

                 	if(data.data[i].category == "cafe"){
                 		iConArray.push("images/cafe.jpg");	
                 	}else if (data.data[i].category == "ashtray"){
						iConArray.push("images/smokingarea.jpg");	
                 	}else{
                 		iConArray.push("images/googlemap_icon.png");	
                 	}
                 	
                 	markerArray.push(mapLatLng(data.data[i].latitude, data.data[i].longitude));
                 }
                 initialize();
			     viewMarker();
           },
           error : function(xhr, status, error) {
                 alert("error!");
           }
     });
});