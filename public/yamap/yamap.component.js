'use strict';

angular
    .module('placemarkPathApp')
    .component('yaMap', {
        bindings: {
            placemarks  : '<'
        },
        templateUrl : 'yamap/yamap.template.html',
        controller : ['$scope', function yamapController($scope) {
            this.defaultMapId           = 'map';
            this.$scope                 = $scope;
            this.deaultMapOptions       = {center : [55.76, 37.64], zoom : 12};
            this.deaultZoomOptions      = {float: 'none',position: {right: 40,top: 5}};
            this.defaultmapStrokeWidth  = 2;
            this.afterMapReadyCallbacks = [];
            this.replacePlacemarks      = [];
            this.mapPolyLine            = null;
            this.placemarkActions       = {
                create  : _.bind(function (difference, oldValue, newValue) {
                    var self           = this,
                        balloonContent = newValue[difference.index].value,
                        newPlacemark   = new ymaps.Placemark(
                            this.getCurrentMapCenter(),
                            {
                                balloonContent : balloonContent
                            },
                            {
                                draggable: true
                            }
                        );
                    newPlacemark.events.add('drag', function(e) {
                        self.redrawPolyLine();
                    });
                    this.map.geoObjects.add(newPlacemark);
                    this.placemarks[difference.index]['mapPlacemark'] = newPlacemark;
                }, this),
                clear : _.bind(function () {
                    var geoObjects = this.map.geoObjects;
                    geoObjects.each(function (geoObject) {
                        geoObjects.remove(geoObject);
                    });
                }, this),
                delete  : _.bind(function (difference, oldValue, newValue) {
                    this.map.geoObjects.remove(oldValue[difference.index]['mapPlacemark']);
                }, this)
            };
            this.redrawPolyLine = function () {
                var coordinates,
                    placemarks = this.placemarks;
                if (_.every(placemarks, function (placemark) {
                    return !!placemark.mapPlacemark;
                })) {
                    coordinates = _.map(placemarks, function (placemark) {
                        return [].concat(placemark.mapPlacemark.geometry.getCoordinates());
                    });

                    if (!this.mapPolyLine) {
                        this.mapPolyLine = new ymaps.GeoObject({
                            geometry: {
                                type        : "LineString",
                                coordinates : coordinates
                            }
                        }, {
                            strokeWidth: this.defaultmapStrokeWidth
                        });
                        this.map.geoObjects.add(this.mapPolyLine);
                    } else {
                        this.mapPolyLine.geometry.setCoordinates(coordinates);
                    }
                }
            }

            this.getCurrentMapCenter = function () {
                return this.map.getCenter();
            }

            this.afterMapReady = function (callback) {
                if (this.map) {
                    callback();
                } else {
                    this.afterMapReadyCallbacks.push(callback);
                }
            }

            this.applyMapPlacemarkChanges = function (differences, oldValue, newValue) {
                var placemarkActions = this.placemarkActions,
                    self = this;
                function afterMapReadyHandler (){
                    _.each(differences, function (difference) {
                        placemarkActions[difference.action](difference, oldValue, newValue);
                    });
                    self.redrawPolyLine(newValue);
                }
                this.afterMapReady(afterMapReadyHandler);
            }

            this.watchPlacemarks = function (newValue, oldValue) {
                var differences;

                if (angular.equals(oldValue, newValue)) {
                    differences = _.map(newValue, function (item, index) {
                        return {
                            action : 'create',
                            index  : index
                        };
                    });
                    differences.unshift({
                        action : 'clear'
                    });
                } else {
                    differences = [];
                    _.each(newValue, function (item, index) {
                        var oldValueIndex = oldValue.indexOf(newValue[index]);
                        if (oldValueIndex === -1) {
                            differences.push({
                                action : 'create',
                                index  : index
                            });
                        }
                    });
                    _.each(oldValue, function (item, index) {
                        var newValueIndex = newValue.indexOf(oldValue[index]);
                        if (newValueIndex === -1) {
                            differences.push({
                                action : 'delete',
                                index  : index
                            });
                        }
                    });
                }
                this.applyMapPlacemarkChanges(differences, oldValue, newValue);
            }

            $scope.$watchCollection('$ctrl.placemarks', _.bind(this.watchPlacemarks, this));

            this.triggerMapReady = function () {
                var afterMapReadyCallbacks = this.afterMapReadyCallbacks;
                _.each(afterMapReadyCallbacks, function (callback) {
                    callback();
                });
            }

            this.initializeMap = function () {
                var map = new ymaps.Map(this.mapElement || this.defaultMapId, this.mapOptions || this.deaultMapOptions);
                map.controls.add('zoomControl', this.zoomOptions || this.deaultZoomOptions);
                this.map = map;
                this.triggerMapReady();
            }

            this.$onInit = function () {
                ymaps.ready(_.bind(this.initializeMap, this));
            }

        }]
    });