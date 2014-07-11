/**
 * Created by anthonyhayes on 5/20/14.
 */
angular.module('mapApp.mapsController', [])
    .controller('MapsController', ['$scope', '$routeParams', '$location', '$filter', '$timeout',
        'leafletData', 'ModalService', 'MapService', 'ApplicationService',


        function ($scope, $routeParams, $location, $filter,$timeout,
                  leafletData, ModalService, MapService, ApplicationService) {



             var drawnItems = new L.FeatureGroup(),
                options = {
                    edit: { featureGroup: drawnItems }
                },
                drawControl = new L.Control.Draw(options);

            angular.extend($scope, {
                events: {
                    map: {
                        enable: ['click', 'drag', 'blur'],
                        logic: 'emit'
                    }
                },
                controls: {
                    custom: [ drawControl ]
                },
            austin: {
                lat: 30.22050,
                    lng: -97.76647,
                    zoom: 10
            },
            markers: {
                m1: {
                    lat: 30.22347,
                        lng: -97.75497
                }
            },
            layers: {
                baselayers: {
                    googleTerrain: {
                        name: 'Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    },
                    osm: {
                        name: 'StreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                        }
                    },
                    cycle: {
                        name: 'CycleMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                            layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                                attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                        }
                    }
                },
                overlays: {
                    hillshade: {
                        name: 'Hillshade Europa',
                            type: 'wms',
                            table: 'hillshade',
                            url: 'http://129.206.228.72/cached/hillshade',
                            visible: true,
                            layerOptions: {
                            layers: 'europe_wms:hs_srtm_europa',
                                format: 'image/png',
                                opacity: 0.25,
                                attribution: 'Hillshade layer by GIScience http://www.osm-wms.de',
                                crs: L.CRS.EPSG900913
                        }
                    },
                    fire: {
                        name: 'OpenFireMap',
                            type: 'xyz',
                        table: 'fire',
                            url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
                            layerOptions: {
                            attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                        }
                    },
                    cars: {
                        name: 'Cars',
                        table: 'cars',
                            type: 'group',
                        visible: true
                    },
                    bikes: {
                        name: 'Bicycles',
                        table: 'bikes',
                            type: 'group',
                            visible: false
                    }
                }
            },
            markers: {
                m1: {
                    lat: 30.2643,
                        lng: -97.82363,
                        layer: 'cars',
                        message: "I'm a car"
                },
                m2: {
                    lat: 30.23588,
                        lng: -97.80355,
                        layer: 'cars',
                        message: "I'm a car"
                },
                m3: {
                    lat: 30.20588,
                        lng: -97.84355,
                        layer: 'bikes',
                        message: 'A bike!!'
                },
                m4: {
                    lat: 30.29588,
                    lng: -97.86355,
                        layer: 'bikes'
                },
                m5: {
                    lat: 30.32588,
                    lng: -97.88355
                },
                m6: {
                    lat: 30.34588,
                    lng: -97.90355
                }
            }
            });

            $scope.oneAtATime = true;

            $scope.maps = [];
            angular.forEach($scope.layers.baselayers, function(value, key){
                console.log(key + ': ' + value);
                var maps = {};
                maps.name = key;
                maps.title = value.name;
                maps.content = value.type;
                maps.top = value.visible;
                maps.type = value.type;
                maps.url = value.url;
                maps.layerOptions = value.layerOptions;
                $scope.maps.push(maps)

            });
            $scope.mapLayers = [];
            angular.forEach($scope.layers.overlays, function(value, key){
                console.log(key + ': ' + value);
                var mapLayer = {};
                mapLayer.name = key;
                mapLayer.table = value.table;
                mapLayer.title = value.name;
                mapLayer.content = value.type;
                mapLayer.visible = value.visible;
                if(mapLayer.visible){
                    mapLayer.label = 'Remove This Layer'
                }else{
                    mapLayer.label = 'Add This Layer'
                }
                $scope.mapLayers.push(mapLayer)

            });

            $scope.layerUp = function(index, event) {
                // stop accordion behavior
                event.preventDefault();
                event.stopPropagation();
                if (index <= 0 || index >= $scope.mapLayers.length)
                    return;
                var temp = $scope.mapLayers[index];
                $scope.mapLayers[index] = $scope.mapLayers[index - 1];
                $scope.mapLayers[index - 1] = temp;
            };

            $scope.layerDown = function(index, event) {
                // stop accordion behavior
                event.preventDefault();
                event.stopPropagation();
                if (index < 0 || index >= ($scope.mapLayers.length - 1))
                    return;
                var temp = $scope.mapLayers[index];
                $scope.mapLayers[index] = $scope.mapLayers[index + 1];
                $scope.mapLayers[index + 1] = temp;
            };

            $scope.layerRemove = function(index, event) {
                // stop accordion behavior
                event.preventDefault();
                event.stopPropagation();
                $scope.mapLayers.splice(index, 1);
            };



            $scope.$on('leafletDirectiveMap.click', function(event, args){
                var latlng = args.leafletEvent.latlng;
                toastr.info('Lat: ' + latlng.lat + '<br>Lng: ' + latlng.lng);
            });

            var origMapConfig = angular.copy($scope.layers);

            leafletData.getMap().then(function(map) {
                map.addLayer(drawnItems);

                map.on('draw:created', function (e) {
                    var layer = e.layer;
                    drawnItems.addLayer(layer);
                    console.log(JSON.stringify(layer.toGeoJSON()));
                });
            });
            $scope.toggleLayer = function(layer) {
                $scope.layers.overlays[layer].visible = !$scope.layers.overlays[layer].visible;
                angular.forEach($scope.mapLayers, function(value){
                    if(value.name == layer){
                        if(value.label == 'Add This Layer'){
                            value.label = 'Remove This Layer'
                        }else{
                            value.label = 'Add This Layer'
                        }
                    }

                });
            };

            $scope.toggleMap = function(mapName, MapTitle) {
                leafletData.getMap().then(function(map) {
                    delete $scope.layers.baselayers;
                    $scope.layers.baselayers = {};
                    var topMap = angular.copy(origMapConfig.baselayers[mapName]);
                    $scope.layers.baselayers[MapTitle] =  angular.copy(topMap);
                 });
           };

            $scope.codecss = "if then else css";
            $scope.codesql = "if then else sql";
            $scope.codehtmlmixed = "if then else html";


            $scope.editorOptionssql = {
                lineWrapping : true,
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {"Ctrl-Space":"autocomplete"},
                theme: 'twilight',
                mode: 'sql'
            };
            $scope.editorOptionscss = {
                lineWrapping : true,
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                theme: 'twilight',
                mode: 'css'
            };
            $scope.editorOptionshtmlmixed = {
                lineWrapping : true,
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                theme: 'twilight',
                mode: "text/html"
            };

            CodeMirror.commands.autocomplete = function(cm) {
                var doc = cm.getDoc();
                var POS = doc.getCursor();

                var mode = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(POS).state).mode.name;
                if(mode == 'sql'){
                    CodeMirror.showHint(cm, CodeMirror.hint.sql, {
                        tables: {
                            "table1": [ "col_A", "col_B", "col_C" ],
                            "table2": [ "other_columns1", "other_columns2" ]
                        }
                    });
                }else if(mode == 'css'){
                    CodeMirror.showHint(cm, CodeMirror.hint.css);
                }else{
                    CodeMirror.showHint(cm, CodeMirror.hint.html);
                }
             };
            var orig = CodeMirror.hint.css;
            CodeMirror.hint.css = function(cm) {
                var inner = orig(cm) || {from: cm.getCursor(), to: cm.getCursor(), list: []};
                inner.list.push("bozo");
                inner.list.push("bozo.col1");
                return inner;
            };

            //get code
            $scope.applySnippit = function(mode) {
                var editor = "editorOptions" + mode;
                var look = $scope['code'+mode];
                $timeout(function() {
                    angular.element('.'+mode).triggerHandler('click');
                }, 0);
            };

            $scope.editMode = function(mode, layerName) {
                // first get company that opportunity is to be created for
                $scope.layerName = layerName;
                $timeout(function() {
                    angular.element('.'+mode).triggerHandler('click');
                }, 0);
            };

            $scope.viewTable = function(table) {
                $location.path('/table/'+table);
            };

            $scope.addNewLayer = function(layer,mode) {

                $timeout(function() {
                    angular.element('.'+mode).triggerHandler('click');
                }, 0);
                alert('add new layer '+layer.name);
            };
            $scope.saveSession = function(mode) {
                $timeout(function() {
                    angular.element('.'+mode).triggerHandler('click');
                }, 0);

                alert('save map layers ');
            };
            $scope.refreshLayer = function(layer, mode) {
                $timeout(function() {
                    angular.element('.'+mode).triggerHandler('click');
                }, 0);

                alert('refresh map layer '+ layer);
            };
            $scope.refreshMap = function(mode) {
                $timeout(function() {
                    angular.element('.'+mode).triggerHandler('click');
                }, 0);

                alert('refresh map layers ');
            };

            $scope.uploadLayer = function() {

                $location.path('/uploader');
            };

            $scope.createNewTable = function() {
                // call service to return unique table name
                var table = ApplicationService.newTableName();
                $location.path('/table/'+table);
            };

            $scope.infoBoxAttributes = [
                { 'title': 'Item 3', 'show': "off",'drag': true },
                { 'title': 'Item 2', 'show': "off",'drag': true },
                { 'title': 'Item 1', 'show': "off",'drag': true },
                { 'title': 'Item 4', 'show': "off",'drag': true }
            ];

            $scope.applyInfobox = function(item,index){
                if(item.show == 'off'){
                    $scope.infoBoxAttributes[index].show = 'on';
                }else{
                    $scope.infoBoxAttributes[index].show = 'off';

                }
                $scope.applyInfoBoxSettings = function(layer,mode) {

                    $timeout(function() {
                        angular.element('.'+mode).triggerHandler('click');
                    }, 0);
                    alert('add infobox for layer '+layer);
                };

            };

            $scope.iAttributeUp = function(index) {
                if (index <= 0 || index >= $scope.infoBoxAttributes.length)
                    return;
                var temp = $scope.infoBoxAttributes[index];
                $scope.infoBoxAttributes[index] = $scope.infoBoxAttributes[index - 1];
                $scope.infoBoxAttributes[index - 1] = temp;
            };

            $scope.iAttributeDown = function(index) {
                if (index < 0 || index >= ($scope.infoBoxAttributes.length - 1))
                    return;
                var temp = $scope.infoBoxAttributes[index];
                $scope.infoBoxAttributes[index] = $scope.infoBoxAttributes[index + 1];
                $scope.infoBoxAttributes[index + 1] = temp;
            };

            $scope.iAttributeRemove = function(index) {
                $scope.infoBoxAttributes.splice(index, 1);
            };



        }
    ]);

