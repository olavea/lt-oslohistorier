angular.module('LutterApp')
.directive('playButton', ['AudioPlayer', function(AudioPlayer) {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      function setIconClass() {
        scope.iconClass = AudioPlayer.isPlaying(attr.projectId, attr.articleId, attr.trackNum) ? 'fa-pause' : 'fa-play';
      }

      function setOpacity() {
        var showButton = AudioPlayer.hasAudio(attr.projectId, attr.articleId, attr.trackNum);
        element.css({
          opacity: showButton ? '1' : '0'
        });
      }

      element.on('click', function(event) {
        AudioPlayer.playPause(attr.projectId, attr.articleId, attr.trackNum);
        event.stopPropagation();
      });

      scope.$on('audio.stateChanged', function(r, date) {
        console.log("[playButton] State changed");
        scope.$apply(function() {
          setIconClass();
        });
      });

      setIconClass();
      setOpacity();
    },
    scope: {
      projectId: '=',
      articleId: '=',
      trackNum: '='
    },
    template: '<button class="btn btn-primary"><i class="fa {{ iconClass }}")}"></i></button>'
  };
}]);