angular.module('LutterApp')
  .controller('MapController', ['$scope', function ($scope) {

    angular.extend($scope, {
      // Setting temporary center to Oslo
      center: {
        lat: 59.914831,
        lng: 10.767347,
        zoom: 16
      },
      tiles: {
        name: 'Positron',
        url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        type: 'xyz'
      },
      locations: {}
    });

   }]);
