/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["logaligroup/gestionhr/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
