// This script file is to load up call back method for the maps to have upon load.

var map;
var infowindow;
var service;

function initMap() {
    //var pyrmont = { lat: -33.867, lng: 151.195 };
    var pyrmont = {lat: 38.925979, lng: -77.035176 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();

    var places = octopus.GetPlaces();

    function addMarker(place) {
        if (typeof place === "undefined") throw Error("'place' missing.");
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: pyrmont,
            radius: 5000,
            name: place,
        }, callback);
    }

    // For all places in our model, add a marker.
    for (var i in places) {
        var place = places[i];
        addMarker(place);
    }
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
    });

    octopus.AddMarker(place.name, marker);

    // this is to make them bounce if clicked on.
    // but we want that to work off the LI item clicked on.
    // and also, we want to stop bouncing when clicked on another.
    marker.addListener('click', toggleBounce);

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        }
        else {
            // Stop all other markers from bouncing.
            var listMarkers = octopus.GetMarkers();
            for (var i in listMarkers) {
                var m = listMarkers[i];
                m.setAnimation(null);
            }

            // and only animate this one.
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    };

    var placeName = place.name;
    google.maps.event.addListener(marker, 'click', function () {
        if (typeof placeName === "undefined") throw Error("'placeName' missing.");
        var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="
                + placeName + "&api-key=bd91481bf8a206b38397217ce23f51a7:2:73398314";

        $.getJSON(nytimesURL, function (data) {
            if (data.response.docs.length > 0) {
                var nytimesData = data.response.docs[0].headline.main;
                var nytimesDataURL = data.response.docs[0].web_url;
                // Need to set the content again after the data arrives.
                setMarkerText(placeName, nytimesData, nytimesDataURL);
            }
        });

        setMarkerText(placeName);
        infowindow.open(map, this);

    });
}



function removeMarker(marker) {
    marker.setMap(null);
};

function setMarkerText(name, nytimesHeadline, nytimeURL) {
    if (typeof name === "undefined") throw Error("'name' missing.");
    var nytimesDataFound = typeof nytimesHeadline !== "undefined";
    if (nytimesDataFound && typeof nytimeURL === "undefined") {
        throw Error("'nytimeURL' required if 'nytimesHeadline' present.");
    }

    var html = "<div class='marker-name'>" + name + "</div>";

    if (nytimesDataFound) {
        html += "<div class='marker-nytimes-data'>"
            + "<a href='" + nytimeURL + "'>" + nytimesHeadline + "</a></div>";
    }

    infowindow.setContent(html);
}

