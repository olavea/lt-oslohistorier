/* global lutterAppData */

angular.module("LutterApp", [
  'ui.router',
  'ui-leaflet'
]);

angular.module("LutterApp").config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "DataProvider", function($stateProvider, $urlRouterProvider, $locationProvider, DataProvider) {
  DataProvider.setData(lutterAppData);

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      views: {
        "main@": {
          templateUrl: function() {
            return "home.html";
          }
        }
      },
      onEnter: function($stateParams, AppState) {
        console.log("[APP] Enter home state");
        AppState.selectedProjectId = 'all';
      }
    })
    .state('project', {
      url: "/:projectId",
      views: {
        "main@": {
          templateUrl: function($stateParams) {
            return "projects/" + $stateParams.projectId + ".html";
          }
        }
      },
      onEnter: function($stateParams, AppState) {
        console.log("[APP] Enter project state", $stateParams.projectId);
        AppState.selectedProjectId = $stateParams.projectId;
      },
      onExit: function(AppState) {
        console.log("[APP] Exit project state");
        AppState.selectedProjectId = 'all';
      }
    })
    .state('project.article', {
      url: "/:articleId",
      views: {
        "main@": {
          templateUrl: function($stateParams) {
            return $stateParams.projectId + "/" + $stateParams.articleId + ".html";
          }
        }
      },
      onEnter: function($stateParams, AppState) {
        console.log("[APP] Enter article state", $stateParams.articleId);
        AppState.selectedArticleId = $stateParams.articleId;
      },
      onExit: function(AppState) {
        console.log("[APP] Exit article state");
        AppState.selectedArticleId = null;
      }
    });
}]);
