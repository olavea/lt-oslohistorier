console.log("HEI");

angular.module("LutterApp", [
  'ui.router',
  'ui-leaflet'
]);

angular.module("LutterApp").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: "/"
    })
    .state('project', {
      url: "/:projectId",
      views:  {
        "main@": {
          templateUrl: function ($stateParams) {
            return "/projects/" + $stateParams.projectId + "/index.html";
          }
        }
      }
    })
    .state('project.article', {
      url: "/:articleId",
      views:  {
        "main@": {
          templateUrl: function ($stateParams) {
            return "/" + $stateParams.projectId + "/" + $stateParams.articleId + "/index.html";
          }
        }
      }
    })

}]);

angular.module('LutterApp')
  .controller('MapController', ['$scope', function ($scope) {

    console.log("MapController");

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
