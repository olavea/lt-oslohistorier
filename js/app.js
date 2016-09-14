/* global lutterAppData */

angular.module("LutterApp", [
  'ui.router',
  'ui-leaflet',
  'ngToast'
]);

angular.module("LutterApp").config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "ngToastProvider", "DataProvider", function($stateProvider, $urlRouterProvider, $locationProvider, ngToastProvider, DataProvider) {
  ngToastProvider.configure({
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    maxNumber: 1
  });

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

angular.module("LutterApp").run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$on('$viewContentLoaded', function(event) {
    var links = angular.element(document).find('a');
    for (var i = 0; i < links.length; i++) {
      var link = angular.element(links[i]);
      if ($location.host() !== link[0].hostname) {
        console.log("External", link[0].href);
        link.attr("target", "_blank");
      }
    }
  });

  if (typeof ga === "function") {
    $rootScope.$on('$stateChangeSuccess', function(event) {
      ga('send', 'screenview', {screenName: $location.path()});
      ga('send', 'pageview', {screenName: $location.path()});
    });

    $rootScope.$on('audio.played', function(event, track, procentagePlayed) {
      ga('send', 'event', track.projectId, 'play', track.articleId);
    });

    $rootScope.$on('audio.paused', function(event, track, procentagePlayed) {
      ga('send', 'event', track.projectId, 'pause', track.articleId, procentagePlayed);
    });

    $rootScope.$on('audio.stopped', function(event, track, procentagePlayed) {
      ga('send', 'event', track.projectId, 'stop', track.articleId, procentagePlayed);
    });

    $rootScope.$on('audio.ended', function(event, track, procentagePlayed) {
      ga('send', 'event', track.projectId, 'finished', track.articleId, 100);
    });
  }
}]);
