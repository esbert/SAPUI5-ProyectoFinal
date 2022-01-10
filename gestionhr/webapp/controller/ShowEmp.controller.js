sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/base/Log",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.base.Log} Log
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, MessageBox, Log, JSONModel) {
        "use strict";

        return Controller.extend("logaligroup.gestionhr.controller.ShowEmp", {
            onInit: function () {
                this._split = this.byId("splitAppEmployee");
            },

            onPressBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", {}, true);
            },

            onSelEmployee: function (oEvent) {
                this._split.to(this.createId("idPage2Detail"));
                var context = oEvent.getParameter("listItem").getBindingContext("employeeModel");
                this._employeeId = context.getProperty("EmployeeId");
                var detailEmployee = this.byId("idPage2Detail");
                detailEmployee.bindElement("employeeModel>/Users(EmployeeId='" + this._employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");

            },
            onFileBeforeUpload: function (oEvent) {
                let fileName = oEvent.getParameter("fileName");
                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + this._employeeId + ";" + fileName
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },
            onFileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource();

                // Header Token CSRF - cross-site request forgery
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("employeeModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

            },
            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
            },
            onFileDeleted: function (oEvent) {
                var oUploadCollection = oEvent.getSource()
                var sPath = oEvent.getParameter("item").getBindingContext("employeeModel").getPath();
                this.getView().getModel("employeeModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh()
                    },
                    error: function (e) {

                    }
                });
            },
            onDeleteEmployee: function (oEvent) {
                MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("deseaEliminar"), {
                    title: this.getView().getModel("i18n").getResourceBundle().getText("confirm"),
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            this.getView().getModel("employeeModel").remove("/Users(EmployeeId='" + this._employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')", {
                                success: function (data) {
                                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("usuarioEliminado"));
                                    this._split.to(this.createId("idPage1Detail"));
                                }.bind(this),
                                error: function (e) {
                                    Log.info(e);
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                });
            },
            onRiseEmployee: function(oEvent) {
                if (!this._crearDialog) {
                    this._crearDialog = sap.ui.xmlfragment("logaligroup/gestionhr/fragment/CreateEmployee", this);
                    this.getView().addDependent(this._crearDialog);
                }
                this._crearDialog.setModel(new JSONModel({}),"createEmp");
                this._crearDialog.open();
            },
            onCanc: function() {
                this._crearDialog.close();
            },
            onCreateEmp: function() {
                var oData = this._crearDialog.getModel("createEmp").getData();
                var body = {
                    Ammount : oData.Ammount,
                    CreationDate : oData.CreationDate,
                    Comments : oData.Comments,
                    SapId : this.getOwnerComponent().SapId,
                    EmployeeId : this._employeeId
                };
                this.getView().getModel("employeeModel").create("/Salaries",body, {
                    success : function() { 
                        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("creacionSalarioCorrecta"));
                        this.onCanc();
                    }.bind(this),
                    error : function() {
                        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("creacionSalarioError"));
                    }.bind(this)
                });
            },
            onNumeric: function(oEvent) {
                var oValor = oEvent.getSource().getValue();
                var val = oValor.replace(/[^\d]/g, '');
            }
        });
    });