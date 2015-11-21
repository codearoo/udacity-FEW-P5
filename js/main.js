
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
    self.markers = ko.observableArray([]);
    self.searchString = ko.observable("");

    self.AddMarker = function (name, marker) {
        if (typeof name === "undefined") throw Error("'name' missing.");
        if (typeof marker === "undefined") throw Error("'marker' missing.");
        self.markers()[name.toUpperCase()] = marker;
    };
    self.GetMarkerByPlace = function (name) {
        if (typeof name === "undefined") throw Error("'name' missing.");
        return self.markers()[name.toUpperCase()];
    };

    self.selectPlace = function (placeName) {
        if (typeof placeName === "undefined") throw Error("'placeName' missing.");
        var marker = theView.GetMarkerByPlace(placeName);
        selectOnlyThisMarker(marker);
        AddNYTimesLookupToMarker(marker, placeName);
    };

};

var theView = new ModelView();
ko.applyBindings(theView);

