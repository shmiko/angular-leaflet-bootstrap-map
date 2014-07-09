/* Directives */


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
                var codeMirrorTemplate =
                    '<h1> Editor Clicked!</h1>' +
                    '<p>' +
                    '   Click the button again to make this go away or click the "Dismiss" button below.' +
                    '</p>' +
                    ' <textarea ui-codemirror="editorOptions' + attrs.mode + '" ng-model="code' + attrs.mode + '"></textarea>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var addLayerTemplate =
                    '<h1>Add Layer Clicked!</h1>' +
                    '<p>' +
                    '   Click the button again to make this go away or click the "Dismiss" button below.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var uploadLayerTemplate =
                    '<h1>Upload Layer Clicked!</h1>' +
                    '<p>' +
                    '   Click the button again to make this go away or click the "Dismiss" button below.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var createLayerTemplate =
                    '<h1>Create Layer Clicked!</h1>' +
                    '<p>' +
                    '   Click the button again to make this go away or click the "Dismiss" button below.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var createInfoTemplate =
                    '<h1>InfoBox Layer Clicked!</h1>' +
                    '<p>' +
                    '   Click the button again to make this go away or click the "Dismiss" button below.' +
                    '</p>' +
                    ' <div class="row-fluid">' +
                        '<ul class="thumbnails">' +
                            '<li class="span3" style="margin-left:10px;" ng-repeat="item in list1">' +
                                '<div class="btn btn-droppable" data-drop="true" ng-model="list1" jqyoui-droppable="{index: {{$index}}}">' +
                                    '<div class="btn btn-info btn-draggable" ng-show="item.title" data-drag="{{item.drag}}" data-jqyoui-options="{revert:' + invalid + ' }" ng-model="list1" jqyoui-draggable="{index: {{$index}},placeholder:true,animate:true}">' +
                                        '<tr> <td>{{item.title}}</td><td>&nbsp&nbsp&nbsp</td>' +
                                        '<td><button ng-click="applyInfobox(item,$index)" class="btn btn-primary">{{item.show}}</button></td></tr>' +
                                    '</div>' +
                                '</div>' +
                            '</li>' +
                        '</ul>' +
                        '</br>' +
                    '</div>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var tableTemplate =
                    '<h1>Table Clicked!</h1>' +
                    '<p>' +
                    '   Click the button again to make this go away or click the "Dismiss" button below.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';
                var saveTemplate =
                    '<h1>Save Clicked!</h1>' +
                    '<p>' +
                    '   Click the button again to make this go away or click the "Dismiss" button below.' +
                    '</p>' +
                    '<button class="btn btn-info js-jumbo ' + attrs.mode + '">Dismiss</button>' +
                    '<button ng-click="applySnippit(' + stringMode + ')" class="btn btn-primary ' + attrs.mode + '">Apply</button>';

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