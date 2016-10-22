'use strict';

describe('yaMap', function() {
    var longTimeout        = 50000,
        initMapOptions     = {center : [44.76, 35.64], zoom : 12},
        initZoomOptions    = {float: 'none',position: {right: 40,top: 5}},
        initPlacemarks     = [],
        placeMarkNames     = ['Home', 'Work', 'Ivan', 'Ivanka', 'Shop', 'Undeground', 'Airport', 'Farm', 'BusinessCenter', 'Park'],
        mapPlacemarksStore = [],
        placemarkSet       = [{
            value : placeMarkNames[0]
        }, {
            value : placeMarkNames[1]
        }, {
            value : placeMarkNames[2]
        }, {
            value : placeMarkNames[3]
        }],
        placemarkSet2 = [{
            value : placeMarkNames[4]
        }, {
            value : placeMarkNames[5]
        }, {
            value : placeMarkNames[6]
        }],
        placemarkSet3 = [{
            value : placeMarkNames[7]
        }, {
            value : placeMarkNames[8]
        }],
        originalTimeoutInterval,
        element,
        yaMapCtrl,
        placemarkPathCtrl;

    beforeEach(module('placemarkPathApp'));

    beforeEach(inject(function($componentController) {
        originalTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = longTimeout;
        var mapElement = $('<div style="width:500px;height:500px;"></div>');
        $('body').append(mapElement);
        yaMapCtrl = $componentController('yaMap', {}, {
            mapOptions  : initMapOptions,
            zoomOptions : initZoomOptions,
            placemarks  : initPlacemarks,
            mapElement  : mapElement.get(0)
        });

        yaMapCtrl.$onInit();
    }));

    describe('yaMapController test', function() {

        it('should create and manipulate some placemarks with expected names', function(done) {
            yaMapCtrl.afterMapReady(function () {
                expect(yaMapCtrl.placemarks).toEqual([]);
                yaMapCtrl.placemarks = [].concat(placemarkSet);
                yaMapCtrl.$scope.$apply();
                // Устанавливаем точки на карте.
                expect(yaMapCtrl.placemarks[0].value === placeMarkNames[0]).toBe(true);
                expect(yaMapCtrl.placemarks[1].value === placeMarkNames[1]).toEqual(true);
                expect(yaMapCtrl.placemarks[2].value === placeMarkNames[2]).toEqual(true);
                expect(yaMapCtrl.placemarks[3].value === placeMarkNames[3]).toEqual(true);
                expect(yaMapCtrl.placemarks[0].mapPlacemark instanceof ymaps.Placemark).toBe(true);
                expect(yaMapCtrl.placemarks[1].mapPlacemark instanceof ymaps.Placemark).toBe(true);
                expect(yaMapCtrl.placemarks[2].mapPlacemark instanceof ymaps.Placemark).toBe(true);
                expect(yaMapCtrl.placemarks[3].mapPlacemark instanceof ymaps.Placemark).toBe(true);
                mapPlacemarksStore.push(
                    yaMapCtrl.placemarks[0],
                    yaMapCtrl.placemarks[1],
                    yaMapCtrl.placemarks[2],
                    yaMapCtrl.placemarks[3]
                );
                // Меняем точки местами и удаляем один, что приводит к перемещению 2х.
                yaMapCtrl.placemarks = [
                    yaMapCtrl.placemarks[1],
                    yaMapCtrl.placemarks[3],
                    yaMapCtrl.placemarks[2],
                ];
                yaMapCtrl.$scope.$apply();
                expect(yaMapCtrl.placemarks[0] === mapPlacemarksStore[1]).toBe(true);
                expect(yaMapCtrl.placemarks[1] === mapPlacemarksStore[3]).toBe(true);
                expect(yaMapCtrl.placemarks[2] === mapPlacemarksStore[2]).toBe(true);
                // Добавляем набор новых в центр.
                yaMapCtrl.placemarks =
                    yaMapCtrl
                        .placemarks
                        .slice(0, 1)
                        .concat(placemarkSet2)
                        .concat(yaMapCtrl.placemarks.slice(1));
                yaMapCtrl.$scope.$apply();

                mapPlacemarksStore.push(
                    yaMapCtrl.placemarks[1],
                    yaMapCtrl.placemarks[2],
                    yaMapCtrl.placemarks[3]
                );

                expect(yaMapCtrl.placemarks[0] === mapPlacemarksStore[1]).toBe(true);
                expect(yaMapCtrl.placemarks[4] === mapPlacemarksStore[3]).toBe(true);
                expect(yaMapCtrl.placemarks[5] === mapPlacemarksStore[2]).toBe(true);

                // Проверяем, что содались новые элементы.
                expect(yaMapCtrl.placemarks[1].mapPlacemark instanceof ymaps.Placemark).toBe(true);
                expect(yaMapCtrl.placemarks[2].mapPlacemark instanceof ymaps.Placemark).toBe(true);
                expect(yaMapCtrl.placemarks[3].mapPlacemark instanceof ymaps.Placemark).toBe(true);

                // Добавляем новый массив и удаляем через одного и снова провеяем.

                yaMapCtrl.placemarks = yaMapCtrl.placemarks.concat(placemarkSet3);
                yaMapCtrl.$scope.$apply();
                mapPlacemarksStore.push(
                    yaMapCtrl.placemarks[6],
                    yaMapCtrl.placemarks[7]
                );
                yaMapCtrl.placemarks.splice(1, 1);
                yaMapCtrl.placemarks.splice(2, 1);
                yaMapCtrl.placemarks.splice(3, 1);
                yaMapCtrl.placemarks.splice(4, 1);
                yaMapCtrl.$scope.$apply();

                expect(yaMapCtrl.placemarks[0] === mapPlacemarksStore[1]).toBe(true);
                expect(yaMapCtrl.placemarks[1] === mapPlacemarksStore[5]).toBe(true);
                expect(yaMapCtrl.placemarks[2] === mapPlacemarksStore[3]).toBe(true);
                expect(yaMapCtrl.placemarks[3] === mapPlacemarksStore[7]).toBe(true);
                expect(yaMapCtrl.placemarks[3].mapPlacemark instanceof ymaps.Placemark).toBe(true);
                expect(yaMapCtrl.mapPolyLine instanceof ymaps.GeoObject).toBe(true);

                done();
            });
        });

        it('shoud test component api', function (done) {
            yaMapCtrl.afterMapReady(function () {
                var mapCenter     = yaMapCtrl.getCurrentMapCenter(),
                    initMapCenter = initMapOptions.center,
                    formatCenter  = function (item) {
                        return Math.round(item * 100, 10);
                    };
                mapCenter     = _.map(mapCenter, formatCenter);
                initMapCenter = _.map(initMapCenter, formatCenter);
                expect(mapCenter).toEqual(initMapCenter);
                expect(yaMapCtrl.map).not.toBe(null);
                done();
            });
        });


        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeoutInterval;
        });

    });

});