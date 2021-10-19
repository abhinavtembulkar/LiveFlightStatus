// am4core.useTheme(am4themes_animated);
// Themes end
// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);
var interfaceColors = new am4core.InterfaceColorSet();
// Set map definition
chart.geodata = am4geodata_worldLow;
// Set projection
chart.projection = new am4maps.projections.Mercator();
// Export
chart.exporting.menu = new am4core.ExportMenu();
// Zoom control
chart.zoomControl = new am4maps.ZoomControl();

// Data for general and map use
var destinationCities = [
    {
        "id": "brussels",
        "title": "Brussels",
        "latitude": 50.8371,
        "longitude": 4.3676
    }
];

var originCities = [
    {
        "id": "reykjavik",
        "title": "Reykjavik",
        "destinations":destinationCities.map((ele)=>ele.id),
        "latitude": 64.1353,
        "longitude": -21.8952
    }
];


// Default to London view
//chart.homeGeoPoint = { "longitude": originCities[0].zoomLongitude, "latitude": originCities[0].zoomLatitude };
//chart.homeZoomLevel = originCities[0].zoomLevel;

var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
var planeSVG = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";

// Texts
var labelsContainer = chart.createChild(am4core.Container);
labelsContainer.isMeasured = false;
labelsContainer.x = 80;
labelsContainer.y = 27;
labelsContainer.layout = "horizontal";
labelsContainer.zIndex = 10;

var plane = labelsContainer.createChild(am4core.Sprite);
plane.scale = 0.15;
plane.path = planeSVG;
plane.fill = am4core.color("#cc0000");

var title = labelsContainer.createChild(am4core.Label);
title.text = "Flights starts from Reykjavik";
title.fill = am4core.color("#cc0000");
title.fontSize = 20;
title.valign = "middle";
title.dy = 2;
title.marginLeft = 15;

// var changeLink = chart.createChild(am4core.TextLink);
// changeLink.text = "Click to change origin city";
// changeLink.isMeasured = false;

// changeLink.events.on("hit", function() {
//     console.log(3)
//     if (currentOrigin == originImageSeries.dataItems.getIndex(0)) {
//         showLines(originImageSeries.dataItems.getIndex(1));
//     }
//     else {
//         showLines(originImageSeries.dataItems.getIndex(0));
//     }
// })

// changeLink.x = 142;
// changeLink.y = 72;
// changeLink.fontSize = 13;


// The world
var worldPolygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
worldPolygonSeries.useGeodata = true;
worldPolygonSeries.fillOpacity = 0.6;
worldPolygonSeries.exclude = ["AQ"];

// Origin series (big targets, London and Vilnius)
var originImageSeries = chart.series.push(new am4maps.MapImageSeries());

var originImageTemplate = originImageSeries.mapImages.template;

originImageTemplate.propertyFields.latitude = "latitude";
originImageTemplate.propertyFields.longitude = "longitude";
originImageTemplate.propertyFields.id = "id";

originImageTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
originImageTemplate.nonScaling = true;
originImageTemplate.tooltipText = "{title}";

originImageTemplate.setStateOnChildren = true;
originImageTemplate.states.create("hover");

originImageTemplate.horizontalCenter = "middle";
originImageTemplate.verticalCenter = "middle";

var originHitCircle = originImageTemplate.createChild(am4core.Circle);
originHitCircle.radius = 11;
originHitCircle.fill = interfaceColors.getFor("background");

var originTargetIcon = originImageTemplate.createChild(am4core.Sprite);
originTargetIcon.fill = interfaceColors.getFor("alternativeBackground");
originTargetIcon.strokeWidth = 0;
originTargetIcon.scale = 1.3;
originTargetIcon.horizontalCenter = "middle";
originTargetIcon.verticalCenter = "middle";
originTargetIcon.path = targetSVG;

var originHoverState = originTargetIcon.states.create("hover");
originHoverState.properties.fill = chart.colors.getIndex(1);

// when hit on city, change lines
// originImageTemplate.events.on("hit", function(event) {
//     console.log(2)
//     showLines(event.target.dataItem);
// })

// destination series (small targets)
var destinationImageSeries = chart.series.push(new am4maps.MapImageSeries());
var destinationImageTemplate = destinationImageSeries.mapImages.template;

destinationImageTemplate.nonScaling = true;
destinationImageTemplate.tooltipText = "{title}";
destinationImageTemplate.fill = interfaceColors.getFor("alternativeBackground");
destinationImageTemplate.setStateOnChildren = true;
destinationImageTemplate.states.create("hover");

destinationImageTemplate.propertyFields.latitude = "latitude";
destinationImageTemplate.propertyFields.longitude = "longitude";
destinationImageTemplate.propertyFields.id = "id";

var destinationHitCircle = destinationImageTemplate.createChild(am4core.Circle);
destinationHitCircle.radius = 7;
destinationHitCircle.fillOpacity = 1;
destinationHitCircle.fill = interfaceColors.getFor("background");

var destinationTargetIcon = destinationImageTemplate.createChild(am4core.Sprite);
destinationTargetIcon.scale = 0.7;
destinationTargetIcon.path = targetSVG;
destinationTargetIcon.horizontalCenter = "middle";
destinationTargetIcon.verticalCenter = "middle";

originImageSeries.data = originCities;
destinationImageSeries.data = destinationCities;

// // Line series
var lineSeries = chart.series.push(new am4maps.MapLineSeries());
lineSeries.mapLines.template.line.strokeOpacity = 0.5;

chart.events.on("ready", function() {
    console.log(1)
    // showLines(originImageSeries.dataItems.getIndex(0));
})

// chart.events.on("datavalidated",(event)=>{
//     console.log('DONE',event)
//     showLines(originImageSeries.dataItems.getIndex(0));
// })


var currentOrigin;

function showLines(origin) {
    
    var dataContext = origin.dataContext;
    var destinations = dataContext.destinations;
    // clear old
    lineSeries.mapLines.clear();
    lineSeries.toBack();
    worldPolygonSeries.toBack();

    currentOrigin = origin;

    if (destinations) {
        for (var i = 0; i < destinations.length; i++) {
            var line = lineSeries.mapLines.create();
            line.imagesToConnect = [origin.mapImage.id, destinations[i]];
        }
    }

    title.text = "Flights from " + dataContext.title;

    chart.zoomToGeoPoint({ latitude: dataContext.zoomLatitude, longitude: dataContext.zoomLongitude }, dataContext.zoomLevel, true);
}

var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
graticuleSeries.mapLines.template.line.strokeOpacity = 0.05;

// chart.series.