sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.gestionhr.controller.Main", {
            onInit: function () {

            },
            createEmployee: function() {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CreateEmp",{},false);
            },
            onEmployees: function() {
                window.location.assign("https://f0eac712trial-dev-logali-approuter.cfapps.us10.hana.ondemand.com/logaligroupemployees/index.html");
            }

        });
    });