var map;
var infowindow;
var service;

// async method that gets called when Google map returns.
function initMap() {
    //var pyrmont = { lat: -33.867, lng: 151.195 };
    var pyrmont = { lat: 38.925979, lng: -77.035176 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();

    var places = theView.places();

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
    if (typeof results === "undefined") throw Error("'results' missing.");
    if (typeof status === "undefined") throw Error("'status' missing.");

    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
    else {
        console.log("Problem with Google Places service.");
    }
}

function createMarker(place) {
    if (typeof place === "undefined") throw Error("'place' missing.");

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
    });

    theView.AddMarker(place.name, marker);

    // this is to make them bounce if clicked on.
    // but we want that to work off the LI item clicked on.
    // and also, we want to stop bouncing when clicked on another.
    marker.addListener('click', toggleBounce);

    function toggleBounce() {
        if (marker.getAnimation() !== null)
            marker.setAnimation(null);
        else
            selectOnlyThisMarker(marker);
    };

    google.maps.event.addListener(marker, 'click', function () {
        AddNYTimesLookupToMarker(marker, place.name);
    });
}

function selectOnlyThisMarker(marker) {
    if (typeof marker === "undefined") throw Error("'marker' missing.");

    // Stop all other markers from bouncing.
    var listMarkers = theView.markers();
    for (var i in listMarkers) {
        var m = listMarkers[i];
        m.setAnimation(null);
    }

    // and only animate this one.
    animateMarker(marker);
};

function showOnlyTheseMarkers(markers) {
    // remove all markers.
    var listMarkers = theView.markers();
    for (var i in listMarkers) {
        var marker = listMarkers[i];
        marker.setMap(null);
    }

    // now only show the given markers.
    for (var i in markers) {
        var marker = markers[i];
        marker.setMap(map);
    }
};

function showOnlyMarkersInSearch() {
    // remove all markers.
    var listMarkers = theView.markers();
    for (var i in listMarkers) {
        var marker = listMarkers[i];
        marker.setMap(null);
    }

    // get places in the search and get the markers for them.
    // show only these markers.
    var listPlaces = theView.placesToShow();
    for (var i in listPlaces) {
        var place = listPlaces[i];
        var marker = theView.GetMarkerByPlace(place);
        marker.setMap(map);
    }

};

function animateMarker(marker) {
    if (typeof marker === "undefined") throw Error("'marker' missing.");
    marker.setAnimation(google.maps.Animation.BOUNCE);
};

function showMarker(marker) {
    if (typeof marker === "undefined") throw Error("'marker' missing.");
    marker.setMap(map);
};

function hideMarker(marker) {
    if (typeof marker === "undefined") throw Error("'marker' missing.");
    marker.setMap(null);
};

function AddNYTimesLookupToMarker(marker, placeName) {
    if (typeof marker === "undefined") throw Error("'marker' missing.");
    if (typeof placeName === "undefined") throw Error("'placeName' missing.");

    var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="
            + placeName + "&api-key=bd91481bf8a206b38397217ce23f51a7:2:73398314";

    $.getJSON(nytimesURL, function (data) {
        if (data.response.docs.length > 0) {
            var nytimesData = data.response.docs[0].headline.main;
            var nytimesDataURL = data.response.docs[0].web_url;
            // Need to set the content again after the data arrives.
            infowindow.setContent(getMarkerHTML(placeName, nytimesData, nytimesDataURL));
        }
    }).fail(function () {
        infowindow.setContent(getMarkerHTML(placeName) + "Could not retrieve data.")
    });

    infowindow.setContent(getMarkerHTML(placeName));
    infowindow.open(map, marker);
};

function getMarkerHTML(name, nytimesHeadline, nytimeURL) {
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

    return html;
};
