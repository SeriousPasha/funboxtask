'use strict';


describe('placemarkPath test', function () {
    var placemarkPathCtrl,
        placemarkNames = ['Home', 'Work', 'Ivan', 'Ivanka', 'Shop', 'Undeground', 'Airport', 'Farm', 'BusinessCenter', 'Park'];

    beforeEach(module('placemarkPathApp'));

    beforeEach(inject(function($componentController) {
        placemarkPathCtrl = $componentController('placemarkPath');
    }));

    describe('placemarkPathController test', function () {

        it('create, replace and delete placemarks test', function () {
            // Создаём три метки на карте.
            placemarkPathCtrl.newPlacemark = placemarkNames[0];
            placemarkPathCtrl.newPlacemarkSubmit();
            placemarkPathCtrl.newPlacemark = placemarkNames[1];
            placemarkPathCtrl.newPlacemarkSubmit();
            placemarkPathCtrl.newPlacemark = placemarkNames[2];
            placemarkPathCtrl.newPlacemarkSubmit();

            expect(placemarkPathCtrl.placemarks.length).toBe(3);
            expect(_.map(placemarkPathCtrl.placemarks, function (placemark) {
                return placemark.value;
            })).toEqual(placemarkNames.slice(0, 3));

            placemarkPathCtrl.newPlacemark = placemarkNames[3];
            placemarkPathCtrl.newPlacemarkSubmit();
            placemarkPathCtrl.newPlacemark = placemarkNames[4];
            placemarkPathCtrl.newPlacemarkSubmit();
            placemarkPathCtrl.replacePlacemarks(0,1);
            placemarkPathCtrl.replacePlacemarks(2,4);
            placemarkPathCtrl.replacePlacemarks(2,3);
            expect(placemarkPathCtrl.placemarks.length).toBe(5);
            expect(_.map(placemarkPathCtrl.placemarks, function (placemark) {
                return placemark.value;
            })).toEqual([
                    placemarkNames[1],
                    placemarkNames[0],
                    placemarkNames[3],
                    placemarkNames[4],
                    placemarkNames[2]
            ]);
            placemarkPathCtrl.deletePlacemark(1);
            placemarkPathCtrl.deletePlacemark(2);

            expect(_.map(placemarkPathCtrl.placemarks, function (placemark) {
                return placemark.value;
            })).toEqual([
                placemarkNames[1],
                placemarkNames[3],
                placemarkNames[2]
            ]);

        });
    });

});