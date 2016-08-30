console.log("HEI");

angular.module("LutterApp", ["ui.router"]);

angular.module("LutterApp").config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      url: "/",
      views:  {
        "main@": {
          template: "APP"
        }
      }
    })
    .state('app.project', {
      url: "/:projectId",
      views:  {
        "main@": {
          template: function ($stateParams) {
            return "APP PROJECT: " + $stateParams.projectId;
          }
        }
      },
      resolve: {
        projectId: ['$stateParams', function ($stateParams) {
          return $stateParams.projectId;
        }]
      }
    })
    .state('app.project.article', {
      url: "/:articleId",
      views:  {
        "main@": {
          template: function ($stateParams) {
            return "APP PROJECT: " + $stateParams.articleId;
          }
        }
      },
      resolve: {
        articleId: ['$stateParams', function ($stateParams) {
          return $stateParams.articleId;
        }]
      }
    })

}]);

angular.module("LutterApp").controller("MapController", ["$stateParams", function ($stateParams) {

}]);
