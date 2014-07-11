/* Directives */

https://github.com/angular/angular.js/wiki/Understanding-Directives

angular.module('mapApp.directives', []).
//This directive adds custom animations to views as they enter or leave a screen
//Note that AngularJS has an ng-animate directive but this one can be used when you 
//want complete control
    directive('animatedView', ['$route', '$anchorScroll', '$compile', '$controller',
        function ($route, $anchorScroll, $compile, $controller) {
            return {
                restrict: 'ECA',
                terminal: true,
                link: function (scope, element, attr) {
                    var lastScope,
                        onloadExp = attr.onload || '',
                        defaults = {
                            duration: 500,
                            viewEnterAnimation: 'slideLeft',
                            viewExitAnimation: 'fadeOut',
                            slideAmount: 50,
                            disabled: false
                        },
                        locals,
                        template,
                        options = scope.$eval(attr.animations);

                    angular.extend(defaults, options);

                    scope.$on('$routeChangeSuccess', update);
                    update();


                    function destroyLastScope() {
                        if (lastScope) {
                            lastScope.$destroy();
                            lastScope = null;
                        }
                    }

                    function clearContent() {
                        element.html('');
                        destroyLastScope();
                    }

                    function update() {
                        locals = $route.current && $route.current.locals;
                        template = locals && locals.$template;

                        if (template) {
                            if (!defaults.disabled) {
                                if (element.children().length > 0) { //Have content in view
                                    animate(defaults.viewExitAnimation);
                                } else { //No content in view so treat it as an enter animation
                                    animateEnterView(defaults.viewEnterAnimation);
                                }
                            } else {
                                bindElement();
                            }

                        } else {
                            clearContent();
                        }
                    }

                    function animateEnterView(animation) {
                        $(element).css('display', 'block');
                        bindElement();
                        animate(animation);
                    }

                    function animate(animationType) {
                        switch (animationType) {
                            case 'fadeOut':
                                $(element.children()).animate({
                                    //opacity: 0.0,
                                }, defaults.duration, function () {
                                    animateEnterView('slideLeft');
                                });
                                break;
                            case 'slideLeft':
                                $(element.children()).animate({
                                    left: '-=' + defaults.slideAmount,
                                    opacity: 1.0
                                }, defaults.duration);
                                break;
                            case 'slideRight':
                                $(element.children()).animate({
                                    left: '+=' + defaults.slideAmount,
                                    opacity: 1.0
                                }, defaults.duration);
                                break;
                        }
                    }

                    function bindElement() {
                        element.html(template);
                        destroyLastScope();

                        var link = $compile(element.contents()),
                            current = $route.current,
                            controller;

                        lastScope = current.scope = scope.$new();
                        if (current.controller) {
                            locals.$scope = lastScope;
                            controller = $controller(current.controller, locals);
                            element.children().data('$ngControllerController', controller);
                        }

                        link(lastScope);
                        lastScope.$emit('$viewContentLoaded');
                        lastScope.$eval(onloadExp);

                        // $anchorScroll might listen on event...
                        $anchorScroll();
                    }
                }

            };
        }
    ])
    // example of a directive to call a bootstrap.js function
    .directive('customPopover', function () {
        return {
            restrict: 'A',
            template: '<span>{{label}}</span>',
            link: function (scope, el, attrs) {
                scope.label = attrs.popoverLabel;

                $(el).popover({
                    trigger: 'click',
                    html: true,
                    content: attrs.popoverHtml,
                    placement: attrs.popoverPlacement
                });
            }
        };
    })
    .directive("flyovereditor", function () {
        return {
            restrict: 'EA',
            compile: function (element, attrs) {
                var stringMode = "'" + attrs.mode + "'";
                var invalid = "'invalid" + "'";
                var iAttributeStr = "'animate" + "'";
                var codeMirrorTemplate =
                    '<h1> Editor</h1>' +
                    '<p>' +
                        '   After editing, click Apply' +
                    '</p>' +
                    ' <textarea ui-codemirror="editorOptions' + attrs.mode + '" ng-model="code' + attrs.mode + '"></textarea>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var addLayerTemplate =
                    '<h1>Add Layer</h1>' +
                    '<p>' +
                    '  Select a layer then Click to add this layer to the map.' +
                    '</p>' +
                       ' <select ng-model="newLayer" ng-options="mapLayer.name for mapLayer in mapLayers">'+
                        '<option value="">-- choose layer --</option>'+
                        '</select><br><br>'+
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="addNewLayer(newLayer,' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var uploadLayerTemplate =
                    '<h1>Upload Layer</h1>' +
                    '<p>' +
                    '   Click Go to upload a new table' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="uploadLayer()" class="btn btn-primary ' + attrs.mode + '">Go</button>';
                var createLayerTemplate =
                    '<h1>Create Layer</h1>' +
                    '<p>' +
                    '   Click to create a table and add data for this new layer.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="createNewTable()" class="btn btn-primary ' + attrs.mode + '">Create Table</button>';
                var createInfoTemplate =
                    '<h1>InfoBox</h1>' +
                    '<p>' +
                    '   After editing, click Apply' +
                    '</p>' +
                    ' <div class="row-fluid">' +


                   ' <div ng-repeat="iAttribute in infoBoxAttributes" ng-animate="'+iAttributeStr+'">' +
                    '  {{iAttribute.title}} &nbsp;'+
                      '  <button ng-click="iAttributeUp($index)">up</button>'+
                       ' <button ng-click="iAttributeDown($index)">down</button>' +
                       ' <button ng-click="iAttributeRemove($index)">remove</button>' +
                   ' </div>' +

                '</br>' +
                    '</div>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applyInfoBoxSettings(layerName,' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var tableTemplate =
                    '<h1>Table View</h1>' +
                    '<p>' +
                    '   Click to view the layer data as a table.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="viewTable(layerName)" class="btn btn-primary ' + attrs.mode + '">Go</button>';
                var saveTemplate =
                    '<h1>Save Session</h1>' +
                    '<p>' +
                    '   Click the button to save this session.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="saveSession(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Save</button>';
                var refreshLayerTemplate =
                    '<h1>Layer Refresh</h1>' +
                    '<p>' +
                    '   Click the button to refresh this layer' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="refreshLayer(layerName, ' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Refresh</button>';
                var refreshMapTemplate =
                    '<h1>Map Refresh</h1>' +
                    '<p>' +
                    '   Click the button to refresh the map' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="refreshMap(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Refresh</button>';

                switch (attrs.mode) {
                    case 'sql':
                    case 'css':
                    case 'htmlmixed':
                        template = codeMirrorTemplate;
                        break;
                    case 'add':
                        template = addLayerTemplate;
                        break;
                    case 'upload':
                        template = uploadLayerTemplate;
                        break;
                    case 'create':
                        template = createLayerTemplate;
                        break;
                    case 'infobox':
                        template = createInfoTemplate;
                        break;
                    case 'tableLink':
                        template = tableTemplate;
                        break;
                    case 'save':
                        template = saveTemplate;
                        break;
                    case 'refreshLayer':
                        template = refreshLayerTemplate;
                        break;
                    case 'refreshMap':
                        template = refreshMapTemplate;
                        break;
                }

                $('<div>')
                    .attr('class', attrs.mode)
                    .html(template)
                    .addClass('jumbotron flyover flyover-centered')
                    .appendTo($('.content'));


                $('.js-jumbo.' + attrs.mode).click(function () {
                    $('.' + attrs.mode).toggleClass('in');
                });


            }

        }
    })
;