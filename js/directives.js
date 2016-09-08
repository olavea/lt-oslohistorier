angular.module('LutterApp')
.directive('playButton', ['AudioPlayer', function(AudioPlayer) {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      element.on('click', function(event) {
        AudioPlayer.playPause(attr.projectId, attr.articleId, attr.trackNum);
        event.stopPropagation();
      });

      function setIconClass() {
        scope.iconClass = AudioPlayer.isPlaying(attr.projectId, attr.articleId, attr.trackNum) ? 'fa-pause' : 'fa-play';
      }

      scope.$on('audio.stateChanged', function(r, date) {
        console.log("[playButton] State changed");
        scope.$apply(function() {
          setIconClass();
        });
      });

      setIconClass();
    },
    scope: {
      projectId: '=',
      articleId: '=',
      trackNum: '='
    },
    template: '<button class="btn btn-primary"><i class="fa {{ iconClass }}")}"></i></button>'
  };
}]);
