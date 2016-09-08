angular.module('LutterApp')
  .controller('MainController', ['$scope', 'AudioPlayer', function($scope, AudioPlayer) {
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
