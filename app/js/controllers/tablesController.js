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

             $scope.filterOptions = {
                filterText: ''
            };

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
                        geom: null,
                        country: countries[c],
                        product: products[p],
                        amount: 1000 + Math.random() * 10000,
                        created: d,
                        updated: d
                    };
                    $scope.data.push(item);
                }
            }

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
                enableCellSelection: true,
                enableRowSelection: false,
                enableCellEditOnFocus: true,
                showColumnMenu: true,
                plugins: [filterBarPlugin],
                filterOptions: $scope.filterOptions
            };

            $scope.onTableAddClick = function () {

                alert('stuff goes here!');

            //stuff here

            };


        }
    ])
;

