var model = {
    places: [
        "Bethesda Bagels",
        "Skinny Fiber Direct Silver Spring",
        "The White House Federal Credit Union",
        "Arlington Memorial Bridge",
        "Smithsonian National Zoological Park",
        "rock creek park horse center"
    ],
    markers: [],
    searchString: "",
};

function theView() {
    var self = this;
    self.places = ko.observableArray(model.places);
    self.searchString = ko.observable(model.searchString);

    self.sayHi = function (text) {
        console.log(text);
    };

    self.selectPlace = function (placeName) {
        if (typeof placeName === "undefined") throw Error("'placeName' missing.");

        var marker = octopus.GetMarkerByPlace(placeName);

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
    };

};


var octopus = {
    GetPlaces: function () { return model.places; },

    AddMarker: function (name, marker) {
        model.markers[name] = marker;
    },
    GetMarkers: function () { return model.markers; },
    GetMarkerByPlace: function (placename) {
        if (typeof placename === "undefined") throw Error("'placename' missing.");

        return model[placename];
    },

};

ko.applyBindings(new theView());

