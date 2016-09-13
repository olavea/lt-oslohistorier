angular.module('LutterApp')
  .controller('MainController', ['$scope', '$state', '$sce', 'ngToast', 'AudioPlayer', function($scope, $state, $sce, ngToast, AudioPlayer) {
    function playNextToast(projectId, message) {
      ngToast.create({
        className: projectId,
        content: $sce.trustAsHtml(message + '<div class="alert-options"><button class="btn btn-link" ng-click="dismissToast()">NEI</button><button class="btn btn-primary" ng-click="playNext()">JA</button></div>'),
        compileContent: true,
        dismissButton: false,
        dismissOnTimeout: false,
        dismissOnClick: false
      });
    }

    $scope.playNext = function() {
      console.log("play next");
      AudioPlayer.playNext();
    };

    $scope.dismissToast = function() {
      ngToast.dismiss();
    };

    $scope.$on('audio.playNextAvailable', function(r, projectId, message) {
      $scope.$apply(function() {
        playNextToast(projectId, message);
      });
    });

    $scope.$on('audio.stateChanged', function() {
      $scope.$apply(function() {
        ngToast.dismiss();
      });
    });

    $scope.goTo = function(projectId, articleId) {
      if (articleId) {
        $state.go('project.article', {projectId: projectId, articleId: articleId});
      } else if (projectId) {
        $state.go('project', {projectId: projectId});
      }
    };
  }]);
