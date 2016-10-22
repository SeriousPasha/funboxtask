'use strict';

describe('n2n map-path-selection test', function() {

    beforeEach(function() {
        browser.get('index.html');
    });

    it('should redirect `index.html` and test placepark modification', function() {
        var element1,
            element2,
            inputElement  = element(by.model('$ctrl.newPlacemark')),
            deleteButtons = [],
            listItems,
            listItemDeleteButtons,
            placeMarkNames = [
                'Home',
                'Work',
                'Ivan',
                'Ivanka',
                'Shop',
                'Undeground',
                'Airport',
                'Farm',
                'BusinessCenter',
                'Park'
            ];

        inputElement.sendKeys(placeMarkNames[0]);
        inputElement.sendKeys(protractor.Key.ENTER);
        inputElement.sendKeys(placeMarkNames[1]);
        inputElement.sendKeys(protractor.Key.ENTER);
        inputElement.sendKeys(placeMarkNames[2]);
        inputElement.sendKeys(protractor.Key.ENTER);
        inputElement.sendKeys(placeMarkNames[3]);
        inputElement.sendKeys(protractor.Key.ENTER);
        inputElement.sendKeys(placeMarkNames[4]);
        inputElement.sendKeys(protractor.Key.ENTER);
        inputElement.sendKeys(placeMarkNames[5]);
        inputElement.sendKeys(protractor.Key.ENTER);
        inputElement.sendKeys(placeMarkNames[6]);
        inputElement.sendKeys(protractor.Key.ENTER);

        listItems = element.all(by.repeater('placemark in $ctrl.placemarks')).all(by.css('.placemark-text'));

        function getAllListItems () {
            return listItems.map(function (elem) {
                return elem.getText();
            });
        }

        expect(getAllListItems())
            .toEqual(placeMarkNames.slice(0, 7));

        listItemDeleteButtons = element.all(by.repeater('placemark in $ctrl.placemarks'));

        deleteButtons = [
            listItemDeleteButtons.get(1).element(by.css('.placemark-delete')),
            listItemDeleteButtons.get(2).element(by.css('.placemark-delete')),
            listItemDeleteButtons.get(4).element(by.css('.placemark-delete'))
        ];
        deleteButtons[0].click();
        deleteButtons[1].click();
        deleteButtons[2].click();

        listItems = element.all(by.repeater('placemark in $ctrl.placemarks')).all(by.css('.placemark-text'));

        expect(getAllListItems())
            .toEqual([
                placeMarkNames[0],
                placeMarkNames[2],
                placeMarkNames[4],
                placeMarkNames[5]
            ]);




        element1 = element.all(by.repeater('placemark in $ctrl.placemarks')).get(1);
        element2 = element.all(by.repeater('placemark in $ctrl.placemarks')).get(3);
        browser.actions().
            mouseDown(element1).
            mouseUp(element2).
            perform();

        element1 = element.all(by.repeater('placemark in $ctrl.placemarks')).get(2);
        element2 = element.all(by.repeater('placemark in $ctrl.placemarks')).get(0);
        browser.actions().
            mouseDown(element1).
            mouseUp(element2).
            perform();

        element1 = element.all(by.repeater('placemark in $ctrl.placemarks')).get(2);
        element2 = element.all(by.repeater('placemark in $ctrl.placemarks')).get(1);
        browser.actions().
            mouseDown(element1).
            mouseUp(element2).
            perform();

        listItems = element.all(by.repeater('placemark in $ctrl.placemarks')).all(by.css('.placemark-text'));
        expect(getAllListItems())
            .toEqual([
                placeMarkNames[2],
                placeMarkNames[4],
                placeMarkNames[0],
                placeMarkNames[5]
            ]);



        inputElement.sendKeys(placeMarkNames[7]);
        inputElement.sendKeys(protractor.Key.ENTER);
        inputElement.sendKeys(placeMarkNames[8]);
        inputElement.sendKeys(protractor.Key.ENTER);

        listItems = element.all(by.repeater('placemark in $ctrl.placemarks')).all(by.css('.placemark-text'));
        expect(getAllListItems())
            .toEqual([
                placeMarkNames[2],
                placeMarkNames[4],
                placeMarkNames[0],
                placeMarkNames[5],
                placeMarkNames[7],
                placeMarkNames[8]
            ]);

    });
});
