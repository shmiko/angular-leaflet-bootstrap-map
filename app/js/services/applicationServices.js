/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('mapApp.applicationServices', []).
    value('version', '0.1')


//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
    .service('ApplicationService', function () {


        this.storeCustomer = function (customerObj) {
            customerObject = customerObj;
        };

        this.getStoredCustomer = function () {
            if (customerObject) {
                return customerObject;
            } else {
                return null;
            }
        };
        this.storeOpportunity = function (opportunityObj) {
            opportunityObject = opportunityObj;
        };

        this.getStoredOpportunity = function () {
            if (opportunityObject) {
                return opportunityObject;
            } else {
                return null;
            }
        };
        this.storeOpportunityData = function (opportunityDataObj) {
            opportunityDataObject = opportunityDataObj;
        };

        this.getStoredOpportunityData = function () {
            if (opportunityDataObject) {
                return opportunityDataObject;
            } else {
                return null;
            }
        };
        this.storeOpportunityDataByCompany = function (opportunityDataCompanyObj) {
            opportunityDataCompanyObject = opportunityDataCompanyObj;
        };

        this.getStoredOpportunityDataByCompany = function () {
            if (opportunityDataCompanyObject) {
                return opportunityDataCompanyObject;
            } else {
                return {};
            }
        };
        this.storeOpportunityDataBySalesPerson = function (opportunityDataSalesPersonObj) {
            opportunityDataSalesPersonObject = opportunityDataSalesPersonObj;
        };

        this.getStoredOpportunityDataBySalesPerson = function () {
            if (opportunityDataSalesPersonObject) {
                return opportunityDataSalesPersonObject;
            } else {
                return {};
            }
        };
        this.storeOpportunityDataByCompanyDate = function (opportunityDataCompanyDateObj) {
            opportunityDataCompanyDateObject = opportunityDataCompanyDateObj;
        };

        this.getStoredOpportunityDataByCompanyDate = function () {
            if (opportunityDataCompanyDateObject) {
                return opportunityDataCompanyDateObject;
            } else {
                return {};
            }
        };
        this.storeOpportunityDataBySalesPersonDate = function (opportunityDataSalesPersonDateObj) {
            opportunityDataSalesPersonDateObject = opportunityDataSalesPersonDateObj;
        };

        this.getStoredOpportunityDataBySalesPersonDate = function () {
            if (opportunityDataSalesPersonDateObject) {
                return opportunityDataSalesPersonDateObject;
            } else {
                return {};
            }
        };

        var customerObject;
        var opportunityObject;
        var opportunityDataObject;
        var opportunityDataCompanyObject;
        var opportunityDataSalesPersonObject;
        var opportunityDataCompanyDateObject;
        var opportunityDataSalesPersonDateObject;


    })
    .service('ModalService', ['$modal',
        function ($modal) {

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'app/partials/util/modal.html'
            };

            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?',
                record: null,
                model1: null,
                model2: null,
                model3: null,
                model4: null
            };

            this.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                customModalDefaults.backdrop = 'static';
                return this.show(customModalDefaults, customModalOptions);
            };

            this.show = function (customModalDefaults, customModalOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in this service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in this service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $modalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $modalInstance.close('ok');
                        };
                        $scope.modalOptions.close = function (result) {

                            $modalInstance.close('cancel');
                        };
                    };
                }

                return $modal.open(tempModalDefaults).result;
            };


        }
    ])
    .service('DialogService', ['$dialog',
        function ($dialog) {
            var dialogDefaults = {
                backdrop: true,
                keyboard: true,
                backdropClick: true,
                dialogFade: true,
                templateUrl: 'app/partials/util/dialog.html'
            };

            var dialogOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            };

            this.showModalDialog = function (customDialogDefaults, customDialogOptions) {
                if (!customDialogDefaults) customDialogDefaults = {};
                customDialogDefaults.backdropClick = false;
                this.showDialog(customDialogDefaults, customDialogOptions);
            };

            this.showDialog = function (customDialogDefaults, customDialogOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempDialogDefaults = {};
                var tempDialogOptions = {};

                //Map angular-ui dialog custom defaults to dialog defaults defined in this service
                angular.extend(tempDialogDefaults, dialogDefaults, customDialogDefaults);

                //Map dialog.html $scope custom properties to defaults defined in this service
                angular.extend(tempDialogOptions, dialogOptions, customDialogOptions);

                if (!tempDialogDefaults.controller) {
                    tempDialogDefaults.controller = function ($scope, dialog) {
                        $scope.dialogOptions = tempDialogOptions;
                        $scope.dialogOptions.close = function (result) {
                            dialog.close(result);
                        };
                        $scope.dialogOptions.callback = function () {
                            dialog.close();
                            customDialogOptions.callback();
                        };
                    };
                }

                var d = $dialog.dialog(tempDialogDefaults);
                d.open();
            };

            this.showMessage = function (title, message, buttons) {
                var defaultButtons = [
                    {
                        result: 'ok',
                        label: 'OK',
                        cssClass: 'btn-primary'
                    }
                ];
                var msgBox = new $dialog.dialog({
                    dialogFade: true,
                    templateUrl: 'template/dialog/message.html',
                    controller: 'MessageBoxController',
                    resolve: {
                        model: function () {
                            return {
                                title: title,
                                message: message,
                                buttons: buttons === null ? defaultButtons : buttons
                            };
                        }
                    }
                });
                return msgBox.open();
            };
        }

    ]);