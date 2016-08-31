angular.module("LutterApp", [
  'ui.router',
  'ui-leaflet'
]);

angular.module("LutterApp").config(["$stateProvider", "$urlRouterProvider", "DataProvider", function ($stateProvider, $urlRouterProvider, DataProvider) {

  DataProvider.setData(lutterAppData);

  $urlRouterProvider.otherwise('');

  $stateProvider
    .state('app', {
      url: "",
    })
    .state('project', {
      url: "/:projectId",
      views:  {
        "main@": {
          templateUrl: function ($stateParams) {
            return "/projects/" + $stateParams.projectId + "/index.html";
          }
        }
      },
      onEnter: function($stateParams, AppState){
        console.log("Setting selectedProjectId", $stateParams.projectId);
        AppState.selectedProjectId = $stateParams.projectId;
      },
      onExit: function(AppState) {
        console.log("Exit project");
        AppState.selectedProjectId = null;
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
      },
      onEnter: function($stateParams, AppState){
        AppState.selectedArticleId = $stateParams.articleId;
      },
      onExit: function(AppState) {
        console.log("Exit article");
        AppState.selectedArticleId = null;
      }
    })

}]);
