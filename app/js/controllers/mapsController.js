/**
 * Created by anthonyhayes on 5/20/14.
 */
angular.module('mapApp.mapsController', [])
    .controller('MapsController', ['$scope', '$routeParams', '$location', '$filter', '$timeout',
        'leafletData', 'ModalService', 'MapService', 'ApplicationService',


        function ($scope, $routeParams, $location, $filter,$timeout,
                  leafletData, ModalService, MapService, ApplicationService) {



             var drawnItems = new L.FeatureGroup(),
                options = { edit: { featureGroup: drawnItems } },
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
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    },
                    osm: {
                        name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                        }
                    },
                    cycle: {
                        name: 'OpenCycleMap',
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
                            url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
                            layerOptions: {
                            attribution: '&copy; <a href="http://www.openfiremap.org">OpenFireMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                continuousWorld: true
                        }
                    },
                    cars: {
                        name: 'Cars',
                            type: 'group',
                        visible: true
                    },
                    bikes: {
                        name: 'Bicycles',
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
                mapLayer.title = value.name;
                mapLayer.content = value.type;
                mapLayer.visible = value.visible;
                if(mapLayer.visible){
                    mapLayer.label = 'Remove'
                }else{
                    mapLayer.label = 'Add'
                }
                $scope.mapLayers.push(mapLayer)

            });
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
                        if(value.label == 'Add'){
                            value.label = 'Remove'
                        }else{
                            value.label = 'Add'
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
                }else{
                    CodeMirror.showHint(cm, CodeMirror.hint.css);
                }
             };
            var orig = CodeMirror.hint.css;
            CodeMirror.hint.css = function(cm) {
                var inner = orig(cm) || {from: cm.getCursor(), to: cm.getCursor(), list: []};
                inner.list.push("bozo");
                inner.list.push("bozo.col1");
                return inner;
            };

            $scope.applySnippit = function(mode) {
                var editor = "editorOptions" + mode;
                var look = $scope['code'+mode];
            };

            $scope.editMode = function(mode) {
                // first get company that opportunity is to be created for
                $timeout(function() {
                    angular.element('.'+mode).triggerHandler('click');
                }, 0);
            };

        }
    ]);

