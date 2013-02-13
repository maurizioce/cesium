/*global define*/
define([
        'dojo/_base/window',
        'dojo/dom-class',
        'dojo/io-query',
        'dojo/parser',
        'dojo/ready',
        'Widgets/Dojo/checkForChromeFrame',
        'Widgets/Dojo/CesiumViewerWidget'
    ], function(
        win,
        domClass,
        ioQuery,
        parser,
        ready,
        checkForChromeFrame,
        CesiumViewerWidget) {
    "use strict";
    /*global console*/

    function doNothing() {
    }

    ready(function() {
        parser.parse();

        checkForChromeFrame();

        var endUserOptions = {};
        if (window.location.search) {
            endUserOptions = ioQuery.queryToObject(window.location.search.substring(1));
        }

        var rbsp = typeof endUserOptions.RBSP !== 'undefined';
        if (rbsp) {
            endUserOptions.source = 'Gallery/DA14/2012_DA14_RBSP.czml';
        } else {
            endUserOptions.source = 'Gallery/DA14/2012_DA14.czml';
        }

        var widget = new CesiumViewerWidget({
            endUserOptions : endUserOptions,
            enableDragDrop : true
        });

        widget.enableDragDrop = false;
        widget.fullscreenElement = document.body;
        widget.placeAt('cesiumContainer');
        widget.imagery.domNode.style.display = 'none';
        widget.viewHomeButton.domNode.style.display = 'none';
        widget.onObjectSelected = doNothing;
        widget.startup();

        if (rbsp) {
            var viewButton = document.getElementById('viewButtonId');
            viewButton.style.display = 'block';

            var rbspId = document.getElementById('rbspId');
            rbspId.style.display = 'block';

            viewButton.onchange = function(e) {
                if (e.srcElement.value === 'Home') {
                    widget.viewHome();
                    return;
                }
                var lookAtObject;
                if (e.srcElement.value === 'DA14') {
                    lookAtObject = widget.dynamicObjectCollection.getObject('/Application/STK/Scenario/2012_DA14_CA/Satellite/2012_DA14');
                }
                else if (e.srcElement.value === 'RBSP A') {
                    lookAtObject = widget.dynamicObjectCollection.getObject('/Application/STK/Scenario/2012_DA14_CA/Satellite/RBSP_A');
                }
                else if (e.srcElement.value === 'RBSP B') {
                    lookAtObject = widget.dynamicObjectCollection.getObject('/Application/STK/Scenario/2012_DA14_CA/Satellite/RBSP_B');
                }

                if (typeof widget._viewFromTo === 'undefined' || widget._viewFromTo.dynamicObject !== lookAtObject) {
                    widget.centerCameraOnObject(lookAtObject);
                }
            };
        } else {
            var asteroidOverlay = document.getElementById('asteroidOverlayId');
            asteroidOverlay.style.display = 'block';

            var zoomButton = document.getElementById('zoomID');
            zoomButton.style.display = 'block';
            zoomButton.onclick = function() {
                var lookAtObject = widget.dynamicObjectCollection.getObject('/Application/STK/Scenario/2012_DA14_CA/Satellite/2012_DA14');
                if (typeof widget._viewFromTo === 'undefined' || widget._viewFromTo.dynamicObject !== lookAtObject) {
                    widget.centerCameraOnObject(lookAtObject);
                } else {
                    widget.viewHome();
                }
            };
        }

        domClass.remove(win.body(), 'loading');
    });
});
