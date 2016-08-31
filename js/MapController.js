angular.module('LutterApp')
  .controller('MapController', ['$scope', '$stateParams', 'Data', 'AppState', function ($scope, $stateParams, Data, AppState) {

    $scope.state = AppState;

    angular.extend($scope, {
      // Setting temporary center to Oslo
      center: {
        lat: 59.914831,
        lng: 10.767347,
        zoom: 14
      },
      tiles: {
        name: 'Positron',
        url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        type: 'xyz'
      },
      locations: []
    });

    $scope.$watch('state.selectedProjectId', function(newProjectId, oldProjectId) {
      if(newProjectId !== oldProjectId) {
        if(newProjectId) {
          $scope.locations = Data[newProjectId];
        } else {
          $scope.locations = [];
        }
      }
    });

   }]);
