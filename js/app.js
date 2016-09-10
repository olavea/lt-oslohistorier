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
        console.log("Setting AppState to all");
        AppState.selectedProjectId = 'all';
      }
    })
    .state('project', {
      url: "/:projectId",
      views: {
        "main@": {
          templateUrl: function($stateParams) {
            return "/projects/" + $stateParams.projectId + ".html";
          }
        }
      },
      onEnter: function($stateParams, AppState) {
        console.log("Setting selectedProjectId", $stateParams.projectId);
        AppState.selectedProjectId = $stateParams.projectId;
      },
      onExit: function(AppState) {
        console.log("Exit project");
        AppState.selectedProjectId = 'all';
      }
    })
    .state('project.article', {
      url: "/:articleId",
      views: {
        "main@": {
          templateUrl: function($stateParams) {
            return "/" + $stateParams.projectId + "/" + $stateParams.articleId + ".html";
          }
        }
      },
      onEnter: function($stateParams, AppState) {
        AppState.selectedArticleId = $stateParams.articleId;
      },
      onExit: function(AppState) {
        console.log("Exit article");
        AppState.selectedArticleId = null;
      }
    });
}]);
