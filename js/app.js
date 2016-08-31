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
