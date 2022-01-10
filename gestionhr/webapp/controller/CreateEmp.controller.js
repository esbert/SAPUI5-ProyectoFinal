sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("logaligroup.gestionhr.controller.CreateEmp", {

            onBeforeRendering: function () {
                var oView = this.getView();
                this._oNavContainer = this.getView().byId("wizardNavContainer");
                this._steps = this.byId("CreateEmpleado");
                this._oStep1 = this.getView().byId("tipoEmpleado");
                this._oStep2 = this.getView().byId("datosEmpleado");
                this._oStep3 = this.getView().byId("infAdicional");
                this._oModel = new JSONModel({
                    nombre: "",
                    apellido: "",
                    type: "",
                    salario: 0,
                    state: "None",
                    cifDin: "",
                    come: ""
                });

                oView.setModel(this._oModel, "wizard");
                this._oStep1.setValidated(false);
 //               this._oStep2.setValidated(false);
 //               this._oStep3.setValidated(false);
                this._steps.discardProgress(this._oStep1);
                this._steps.goToStep(this._oStep1);

            },

            onInit: function () {
            },

            _onConfiguracionSlider: function (val, min, max) {
                var oSlide = this.getView().byId("_IDGenSlider1");
                //oSlide.setProperty("value", val);
                oSlide.setProperty("min", min);
                oSlide.setProperty("max", max);
                this._oModel.setProperty("/salario", val);
            },
            _onStep2: function () {
                if (this._steps.getCurrentStep() === this.getView().byId("tipoEmpleado").getId()) {
                    this._steps.nextStep();
                } else {
                    this.getView().byId("infAdicional").setValidated(false);
                    this._steps.goToStep(this.getView().byId("datosEmpleado"));
                }

            },
            onInterno: function () {
                var ocfiDnie = this.getView().byId("_IDGenInput2");
                this._onConfiguracionSlider(24000, 12000, 80000);
                this._oModel.setProperty("/type", "0");
                ocfiDnie.setProperty("placeholder", "Ingrese el CIF");
                this._onStep2();
                // var oVista = this.getView().byId("datosEmpleado")
                // this.loadFragment({
                //     name: "logaligroup.gestionhr.fragment.HelloDialog"
                // }).then(function(oFragment) {
                //    this.getView().byId("datosEmpleado").addContent(oFragment);                
                //     this.getView().byId("idForm").bindElement("wizard>")
                //    this._steps.nextStep();
                // }.bind(this));
                //setVisible
            },
            onAutonomo: function () {
                var ocfiDnie = this.getView().byId("_IDGenInput2");
                this._onConfiguracionSlider(400, 100, 2000);
                this._oModel.setProperty("/type", "1");
                ocfiDnie.setProperty("placeholder", "Ingrese el DNI");
                this._onStep2();

            },
            onGerente: function () {
                var ocfiDnie = this.getView().byId("_IDGenInput2");
                this._onConfiguracionSlider(70000, 50000, 200000);
                this._oModel.setProperty("/type", "2");
                ocfiDnie.setProperty("placeholder", "Ingrese el CIF");
                this._onStep2();
            },
            _onCalcularDigitoVerificador: function (rut) {
                let oNum = rut.substr(0, rut.length - 1);
                let oDig = rut.substr(rut.length - 1, 1);
                var cont = 0, suma = 0, oDigRes, digComparar;

                for (var i = oNum.length - 1; i >= 0; i--) {
                    console.log(rut[i]);
                    cont++;
                    switch (cont) {
                        case 1:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 2);
                            break;
                        case 2:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 3);
                            break;
                        case 3:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 4);
                            break;
                        case 4:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 5);
                            break;
                        case 5:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 6);
                            break;
                        case 6:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 7);
                            break;
                        case 7:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 2);
                            break;
                        case 8:
                            suma = suma + (parseInt(oNum.substr(i, 1), 10) * 3);
                            break;
                        default:
                            break;
                    }
                }
                let resto = (suma % 11);
                let dif = 11 - resto;
                if (dif === 10) {
                    oDigRes = "K";
                    digComparar = oDig.toUpperCase();
                } else {
                    oDigRes = dif;
                    digComparar = parseInt(oDig);

                };
                if (oDigRes !== digComparar) {
                    return false;
                } else {
                    return true;
                }

            },
            onValDIN: function (oEvent) {
                if (this._oModel.getProperty("/type") === '1') {
                    let oDni = oEvent.getParameter("value");
                    //let oExp = /^[0-9]+[0-9kK]{1}$/;
                    let oExp = /^[0-9]+[0-9kK]{1}$/;
                    if (oExp.test(oDni)) {
                        if (!this._onCalcularDigitoVerificador(oDni)) {
                            this._oModel.setProperty("/state", "Error");
                        } else {
                            this._oModel.setProperty("/state", "None");
                        }
                    }
                }
                this.onValidarEmpleados();
            },


            onValidarEmpleados: function (oEvent, callback) {
                var oFlag = true;
                var oEstructura = this._oModel.getData();
                if (!oEstructura.nombre) {
                    oFlag = false;
                    oEstructura.nombreState = "Error";
                } else {
                    oEstructura.nombreState = "None";
                };
                if (!oEstructura.apellido) {
                    oFlag = false;
                    oEstructura.apellidoState = "Error";
                } else {
                    oEstructura.apellidoState = "None";
                };
                if (!oEstructura.cifDin.trim()) {
                    oFlag = false;
                    oEstructura.state = "Error";
                } else {
                    oEstructura.state = "None";
                };

                if (!oEstructura.salario) {
                    oFlag = false;
                };

                if (!oEstructura.fechaIncorporacion) {
                    oFlag = false;
                    oEstructura.fechaIncorporacionState = "Error";
                } else {
                    oEstructura.fechaIncorporacionState = "None";
                };

                if (oFlag) {
                    this._steps.validateStep(this.byId("datosEmpleado"));
                } else {
                    this._steps.invalidateStep(this.byId("datosEmpleado"));
                };

                if (callback) {
                    callback(oFlag);
                };

            },

            onFileBeforeUpload: function (oEvent) {
                let fileName = oEvent.getParameter("fileName");
                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + this._newUser + ";" + fileName
                    // value: this.getOwnerComponent().SapId+";"+this._newUser+";"+oEvent.getParameter("fileName")
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
                // actualiza el modelo, subimo un archivo nuevo, se va reflejar en la vista de los archivos
                //                oEvent.getSource().getBinding("items").refresh();

            },
            wizardCompletedHandler: function (oEvent) {

            },
  
            onRevisar: function (oEvent) {
                var oWizardNavContainer = this.getView().byId("wizardNavContainer");
                this._oUploadCollection = this.getView().byId("uploadCollection");
                var oPage = this.getView().byId("revisar");
                this.onValidarEmpleados(oEvent, function (oFlag) {
                    if (oFlag) {
                        oWizardNavContainer.to(oPage);
                        //this._oNavContainer 
                        // var uploadCollection = this.byId("UploadCollection");
                    } else {
                        this._oNavContainer.goToStep(this.byId("datosEmpleado"));
                    }

                });

            },

            _onEditarStep: function (step) {
                var wizardNavContainer = this.byId("wizardNavContainer");
                var fnAfterNavigate = function () {
                    this._steps.goToStep(this.byId(step));
                    wizardNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                wizardNavContainer.attachAfterNavigate(fnAfterNavigate);
                wizardNavContainer.back();
            },

            onEditarTipoEmpleado: function (oEvent) {
                this._onEditarStep.bind(this)("tipoEmpleado");
            },

            onDatosEmpleado: function () {
                this._onEditarStep.bind(this)("datosEmpleado");
            },

            onInfAdicional: function () {
                this._onEditarStep.bind(this)("infAdicional");
            },

            onCancelar: function () {
                sap.m.MessageBox.confirm(this.oView.getModel("i18n").getResourceBundle().getText("preguntaCancelar"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMain", {}, true);
                        }
                    }.bind(this)
                });

            },
            _onGuardarAtachment: function () {
                this._oUploadCollection.upload();
            },
            onGuardarEmpleado: function () {
                var wizardNavContainer = this._oNavContainer;
                var files = this._oUploadCollection.getItems();
                var numFiles = files.length
                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    Type: this._oModel.getData().type,
                    FirstName: this._oModel.getData().nombre,
                    LastName: this._oModel.getData().apellido,
                    Dni: this._oModel.getData().cifDin,
                    CreationDate: this._oModel.getData().fechaIncorporacion,
                    Comments: this._oModel.getData().come,
                    UserToSalary: [{
                        Ammount: parseFloat(this._oModel.getData().salario).toString(),
                        Comments: this._oModel.getData().come,
                        Waers: "EUR"
                    }]
                };

                this.getView().getModel("employeeModel").create("/Users", body, {
                    success: function (data) {
                        this._newUser = data.EmployeeId;
                        MessageBox.success(data.EmployeeId);
                        this._onGuardarAtachment();
                        sap.m.MessageBox.information(this.oView.getModel("i18n").getResourceBundle().getText("empNuevo") + ": " + this._newUser, {
                            onClose: function () {
                                this._oNavContainer.back();
                                this._oStep1.setValidated(false);
                                this._oStep2.setValidated(false);
                                this._oStep3.setValidated(false);
                                this._steps.discardProgress(this._oStep1);
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("RouteMain", {}, true);
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(e);
                        this.getView().setBusy(false);
                    }.bind(this)
                    

                });

            }

        });
    });