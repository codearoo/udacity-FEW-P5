
// The main ModelView used with Knockout.
function ModelView() {
    var self = this;
    self.places = ko.observableArray([
        "Bethesda Bagels",
        "Skinny Fiber Direct Silver Spring",
        "The White House Federal Credit Union",
        "Arlington Memorial Bridge",
        "Smithsonian National Zoological Park",
        "Rock Creek Park Horse Center",
    ]);
    self.searchString = ko.observable("");
    self.markers = ko.observableArray([]);

    // dynamic array that will list places only containing
    // the searchString.
    self.placesToShow = ko.pureComputed(function () {
        var retvalue = [];
        for (var i in self.places()) {
            var place = self.places()[i]
            if (self.IsPlaceInSearch(place)) {
                retvalue.push(place);
            }
        }
        return retvalue;
    });

    // shows the appropriate markers on the map.
    self.ShowSearchedMarkers = function () {
        var listMarkers = [];
        var listPlaces = self.placesToShow();
        for (var i in listPlaces) {
            var place = listPlaces[i];
            var marker = self.GetMarkerByPlace(place);
            listMarkers.push(marker);
        }
        showOnlyTheseMarkers(listMarkers);
        return true; // to continue handling other events.
    };

    self.AddMarker = function (name, marker) {
        if (typeof name === "undefined") throw Error("'name' missing.");
        if (typeof marker === "undefined") throw Error("'marker' missing.");
        self.markers()[name.toUpperCase()] = marker;
    };

    self.RemoveMarker = function (name, marker) {
        if (typeof name === "undefined") throw Error("'name' missing.");
        if (typeof marker === "undefined") throw Error("'marker' missing.");
        delete self.markers()[name];
    };

    self.GetMarkerByPlace = function (name) {
        if (typeof name === "undefined") throw Error("'name' missing.");
        return self.markers()[name.toUpperCase()];
    };

    // select the map marker and show info window.
    self.selectPlace = function (placeName) {
        if (typeof placeName === "undefined") throw Error("'placeName' missing.");
        var marker = theView.GetMarkerByPlace(placeName);
        selectOnlyThisMarker(marker);
        AddNYTimesLookupToMarker(marker, placeName);
    };

    self.IsPlaceInSearch = function (name) {
        return (name.toUpperCase().search(self.searchString().toUpperCase()) >= 0);
    };

};



var theView = new ModelView();
ko.applyBindings(theView);
