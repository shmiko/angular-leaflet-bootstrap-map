// Declare app level module which depends on filters, and services
angular.module('mapApp', [
    'ngRoute',

    'mapApp.mapsController',
    'mapApp.tablesController',
    'mapApp.uploaderController',

    'mapApp.filters',
    'mapApp.directives',

    'mapApp.applicationServices',
    'mapApp.mapService',

    /*
     plug-ins!
     */

    'ui.bootstrap',
    'nvd3',
    'ui.codemirror',
    'leaflet-directive',
    'angularFileUpload',
    'ngGrid'

]).
    config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/map', {
                templateUrl: 'partials/maps/map.html',
                controller: 'MapsController'
            });
            $routeProvider.when('/table/:table', {
                templateUrl: 'partials/tables/table.html',
                controller: 'TablesController'
            });
            $routeProvider.when('/table', {
                templateUrl: 'partials/tables/table.html',
                controller: 'TablesController'
            });
            $routeProvider.when('/uploader', {
                templateUrl: 'partials/uploader/uploader.html',
                controller: 'UploaderController'
            });
            $routeProvider.otherwise({
                redirectTo: '/map'
            });
        }
    ]);



