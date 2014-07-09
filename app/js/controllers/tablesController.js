/**
 * Created by anthonyhayes on 6/18/14.
 */
/**
 * Created by anthonyhayes on 4/14/14.
 */
angular.module('mapApp.tablesController', [])

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the details view
    .controller('TablesController', ['$scope', '$routeParams', '$location',
         'ModalService',

        function ($scope, $routeParams, $location, ModalService) {

            $scope.showActionMenu = false;
            $scope.showColumnActionMenu = false;
            $scope.filterOptions = {
                filterText: ''
            };
            var newField = 1;


            // generate some data
            $scope.data = [];
            var countries = ["US", "New Zealand", "UK", "Scotland", "Ireland", "Austria"];
            var products = ["Widget", "Gadget", "Doohickey" ];
            var id = 1;
            var d = new Date().toDateString();
            for (var c = 0; c < countries.length; c++) {
                for (var p = 0; p < products.length; p++) {
                    var item = {
                        id: id++,
                        geoRef: {lat:19.0283,lon:29.0283},
                        country: countries[c],
                        product: products[p],
//                        amount: 1000 + Math.random() * 10000,
                        amount: "19.0283,29.0283",
                        created: d,
                        updated: d
                    };
                    $scope.data.push(item);
                }
            }



            $scope.columnDef = [];
                angular.forEach($scope.data[0], function (value, col) {
                    if (col == 'id' || col == 'created' || col == 'updated'){
                        $scope.columnDef.push({
                            field: col,
                            headerCellTemplate: 'partials/util/filterHeaderTemplate.html',
                            enableCellEdit: false,
                            visible: false,
                            lat: false,
                            lon: false
                        });

                    }else if (col == 'geoRef'){
                        $scope.columnDef.push({
                            field: col,
                            enableCellEdit: false,
                            headerCellTemplate: 'partials/util/filterHeaderTemplate.html',
                            cellTemplate: '<a ng-click="popup(col,COL_FIELD )">{{COL_FIELD.lat}}, {{COL_FIELD.lon}}</a>' ,
                            lat: true,
                            lon: true
                        });

                    }
                    else{
                        $scope.columnDef.push({
                            field: col,
                            headerCellTemplate: 'partials/util/filterHeaderTemplate.html',
                            lat: false,
                            lon: false
                        });
                    }
                });

            $scope.popup = function(col, field) {
                // call your popup from here
                var modalDefaults = {
                    templateUrl: 'partials/tables/latLonMask.html'
                };
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Go',
                    headerText: 'Geo-reference This Row',
                    bodyText: 'Type your geo-reference for this row',
                    record: angular.copy(field),
                    model1: col
                };

                ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        field.lat = modalOptions.record.lat;
                        field.lon = modalOptions.record.lon;
                    }
                });
            };

            var filterBarPlugin = {
                init: function (scope, grid) {
                    filterBarPlugin.scope = scope;
                    filterBarPlugin.grid = grid;
                    $scope.$watch(function () {
                        var searchQuery = "";
                        angular.forEach(filterBarPlugin.scope.columns, function (col) {
                            if (col.visible && col.filterText) {
                                var filterText = (col.filterText.indexOf('*') === 0 ? col.filterText.replace('*', '') : col.filterText) + ";";
                                searchQuery += col.displayName + ": " + filterText;
                            }
                        });
                        return searchQuery;
                    }, function (searchQuery) {
                        filterBarPlugin.scope.$parent.filterText = searchQuery;
                        filterBarPlugin.grid.searchProvider.evalFilter();
                    });
                },
                scope: undefined,
                grid: undefined
            };
            $scope.myTable = {
                data: 'data',
                columnDefs: $scope.columnDef,
                enableCellSelection: true,
                enableCellEditOnFocus: true,
                headerRowHeight: 60, // give room for filter bar
                showColumnMenu: true,
                plugins: [filterBarPlugin],
                filterOptions: $scope.filterOptions,
                //To be able to have selectable rows in grid.
                rowTemplate: 'partials/util/rowTemplate.html',
//                menuTemplate: 'partials/util/menuTemplate.html',
                //Initial fields to group data by. Array of field names, not displayName.
                groups: [],
                //Show the dropzone for drag and drop grouping
                showGroupPanel: true




            };

            $scope.onTableAddClick = function () {

                var modalDefaults = {
                    templateUrl: 'partials/util/modal.html'
                };
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Go',
                    headerText: 'Create a New Table',
                    bodyText: 'Would you like to create a new table?'
                };

                ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result === 'ok') {

                    }
                });

            };
            $scope.onTableGeoReferenceClick = function () {

                var modalDefaults = {
                    templateUrl: 'partials/util/modal.html'
                };
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Go',
                    headerText: 'Geo-reference Table',
                    bodyText: 'Would you like to geo-reference the data in this table?'
                };

                ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result === 'ok') {

                    }
                });

            };
            $scope.onRowAddClick = function () {
                    var lastId = $scope.data[$scope.data.length-1].id + 1;
                    $scope.data.push({id:lastId});
            };
            $scope.onColumnAddClick = function () {

                $scope.columnDef.push({
                    field: 'newField'+ newField++,
                    headerCellTemplate: 'partials/util/filterHeaderTemplate.html'

                });
                $scope.myTable.columnDefs = $scope.columnDef;

                // bug in ngGrid forces me to rebuild column architecture.
                $scope.myTable.ngGrid.buildColumns();
            };

            //scope funcs
            $scope.toggleShowActionMenu = function() {
                $scope.showActionMenu = !$scope.showActionMenu;
            };
            $scope.toggleShowColumnActionMenu = function(col) {
                var c = {
                    col:col.colDef.field,
                    delete: false,
                    name:col.colDef.field,
                    lat: col.colDef.lat,
                    lon: col.colDef.lon,
                    latSetting: angular.copy(col.colDef.lat),
                    lonSetting: angular.copy(col.colDef.lon)
                };

                var modalDefaults = {
                    templateUrl: 'partials/tables/modalColumnActions.html'
                };
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Go',
                    headerText: col.colDef.field +' Column Actions',
                    bodyText: 'Would you like to change this field?',
                    record: c
                };

                ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
                    if (result === 'ok') {

                        col.colDef.lon = angular.copy(modalOptions.record.lon);
                        col.colDef.lat = angular.copy(modalOptions.record.lat);

                        // existence of the template means I have already processed this field
                        if(col.colDef.lon && col.colDef.lat && !col.colDef.cellTemplate){
                            col.colDef.cellTemplate = '<a ng-click="popup(col,COL_FIELD )">{{COL_FIELD.lat}}, {{COL_FIELD.lon}}</a>';
                            col.colDef.enableCellEdit = false;
                            var keepGoing = true;
                            angular.forEach($scope.data, function (record) {
                                if(keepGoing) {
                                    // parse values - must be comma seperated
                                    var str = angular.copy(record[col.colDef.field]);
                                    if(str) {

                                        var values = str.split(',');
                                        if (values.length == 2) {
                                            if (values[0]) {
                                                var lat = values[0]
                                            }
                                            if (values[1]) {
                                                var lon = values[1]
                                            }
                                            record[col.colDef.field] = {lat: lat, lon: lon};
                                        } else if (values) {
                                            // there is data, but it is in the wrong format, so abort
                                            keepGoing = false;
                                            col.colDef.lon = false;
                                            col.colDef.lat = false;
                                            delete col.colDef.cellTemplate;
                                            col.colDef.enableCellEdit = true;
                                            var modalDefaults2 = {
                                                templateUrl: 'partials/util/modal.html'
                                            };
                                            var modalOptions2 = {
                                                closeButtonText: 'Cancel',
                                                actionButtonText: 'ok',
                                                headerText: 'Geo-Reference Error',
                                                bodyText: 'Lat and Lon references require 2 comma separated values'
                                            };

                                            ModalService.showModal(modalDefaults2, modalOptions2).then(function (result) {
                                                if (result === 'ok') {

                                                }
                                            });
                                        }else{
                                            record[col.colDef.field] = {lat: 0, lon: 0};

                                        }
                                    }
                                }
                             });
                        }else if (col.colDef.lon && !col.colDef.cellTemplate){
                            col.colDef.cellTemplate = '<a ng-click="popup(col,COL_FIELD )">{{COL_FIELD.lon}}</a>';
                            col.colDef.enableCellEdit = false;
                            angular.forEach($scope.data, function (record) {
                                    var value = angular.copy(record[col.colDef.field]);

                                        if (value) {
                                            var lon = value;
                                            record[col.colDef.field] = {lon: lon};
                                        } else {
                                            record[col.colDef.field] = {lon: 0};
                                        }
                            });
                        }else if (col.colDef.lat && !col.colDef.cellTemplate){
                            col.colDef.cellTemplate = '<a ng-click="popup(col,COL_FIELD )">{{COL_FIELD.lat}}</a>';
                            col.colDef.enableCellEdit = false;
                            angular.forEach($scope.data, function (record) {
                                    var value = angular.copy(record[col.colDef.field]);

                                    if (value) {
                                        var lat = value;
                                        record[col.colDef.field] = {lat: lat};
                                    } else {
                                        record[col.colDef.field] = {lat: 0};
                                    }
                             });
                        }

                        if(modalOptions.record.name != col.colDef.field){

                            // first change the data (send to server for this?)
                            angular.forEach($scope.data, function (record) {
                                record[modalOptions.record.name] = angular.copy(record[col.colDef.field]);
                                delete record[col.colDef.field];
                            });

                            // now the column

                            col.colDef.field = angular.copy(modalOptions.record.name);

                        }

                        if(modalOptions.record.delete){
                            //delete column
                            modalDefaults2 = {
                                templateUrl: 'partials/util/modal.html'
                            };
                            modalOptions2 = {
                                closeButtonText: 'Cancel',
                                actionButtonText: 'Go',
                                headerText: 'Delete Column From Table',
                                bodyText: 'Are you sure you want to delete this column in this table?'
                            };

                            ModalService.showModal(modalDefaults2, modalOptions2).then(function (result) {
                                if (result === 'ok') {
                                    angular.forEach($scope.myTable.columnDefs, function (column, idx) {
                                        if (column.field == col.colDef.field) {
                                            $scope.myTable.columnDefs.splice(idx, 1);

                                        }
                                    });


                                }
                            });
                        }
                        // bug in ngGrid forces me to rebuild column architecture.
                        $scope.myTable.ngGrid.buildColumns();


                    }
                });
            };

        }
    ])
;

