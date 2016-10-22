'use strict';

angular
    .module('placemarkPathApp')
    .component('placemarkPath', {
        templateUrl : 'placemark-path/placemark-path.template.html',
        controller : ['$scope', '$rootScope', function placemarkPathController($scope, $rootScope) {

            this.dragControlListeners =  {
                accept          : function (sourceItemHandleScope, destSortableScope) {return true;},//override to determine drag is allowed or not. default is true.
                itemMoved       : function (event) {},
                orderChanged    : function(event) {}
            };

            this.draggingPlacemark = null;
            this.newPlacemark      = '';
            this.placemarks        = [];

            this.newPlacemarkSubmit = function () {
                if (this.newPlacemark !== '') {
                    this.placemarks.push({
                        value : this.newPlacemark
                    });
                    this.newPlacemark = '';
                }
            }

            this.deletePlacemark = function (index) {
                this.placemarks.splice(index, 1);
            }

            this.replacePlacemarks = function (index1, index2) {
                var placemarks    = this.placemarks,
                    tempPlacemark = placemarks[index1];
                placemarks[index1] = placemarks[index2];
                placemarks[index2] = tempPlacemark;
            }

        }]
    });
