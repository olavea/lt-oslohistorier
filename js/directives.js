angular.module('LutterApp')
.directive('playButton', ['AudioPlayer', function(AudioPlayer) {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      function setIconClass() {
        scope.iconClass = 'fa-play';
        if(AudioPlayer.isLoading(attr.projectId, attr.articleId, attr.trackNum)) {
          scope.iconClass = 'fa-spinner fa-spin';
        } else if (AudioPlayer.isPlaying(attr.projectId, attr.articleId, attr.trackNum)) {
          scope.iconClass = 'fa-pause';
        }
      }

      function setOpacity() {
        var showButton = AudioPlayer.hasAudio(attr.projectId, attr.articleId, attr.trackNum);
        element.css({
          opacity: showButton ? '1' : '0'
        });
      }

      element.on('click', function(event) {
        AudioPlayer.playPause(attr.playNextScope, attr.projectId, attr.articleId, attr.trackNum);
        event.stopPropagation();
      });

      scope.$on('audio.stateChanged', function(r, date) {
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
      trackNum: '=',
      playNextScope: '='
    },
    template: '<button class="btn btn-primary"><i class="fa {{ iconClass }}")}"></i></button>'
  };
}]);
