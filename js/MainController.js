angular.module('LutterApp')
  .controller('MainController', ['$scope', '$state', 'AudioPlayer', function($scope, $state, AudioPlayer) {
    $scope.goTo = function(projectId, articleId) {
      if (articleId) {
        $state.go('project.article', {projectId: projectId, articleId: articleId});
      } else if (projectId) {
        $state.go('project', {projectId: projectId});
      }
    };

    $scope.playPause = function(projectId, articleId, trackNumber) {
      return AudioPlayer.playPause(projectId, articleId, trackNumber);
    };

    $scope.isPlaying = function(projectId, articleId, trackNumber) {
      return AudioPlayer.isPlaying(projectId, articleId, trackNumber);
    };

    $scope.$on('audio.stateChanged', function(r, date) {
      console.log("[MainController] State changed");
      $scope.$apply();
    });
  }]);
