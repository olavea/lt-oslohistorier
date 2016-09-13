angular.module('LutterApp')
  .service('AudioPlayer', ['$http', '$rootScope', '$sce', 'Data', 'ngToast', function($http, $rootScope, $sce, Data, ngToast) {
    var audio = new Audio();
    var currentTrack = {};
    var playNextScope = "article";
    var playNextTrack = {};

    var isCurrentSelection = function(projectId, articleId, trackNum) {
      var isSameProject = currentTrack.projectId === projectId || projectId === undefined;
      var isSameArticle = currentTrack.articleId === articleId || articleId === undefined;
      var isSameTrack = parseInt(currentTrack.trackNum, 10) === parseInt(trackNum, 10) || trackNum === undefined;
      return isSameProject && isSameArticle && isSameTrack;
    };

    var isSameTrack = function(trackA, trackB) {
      var isSameProject = trackA.projectId === trackB.projectId;
      var isSameArticle = trackA.articleId === trackB.articleId;
      var isSameTrack = parseInt(trackA.trackNum, 10) === parseInt(trackB.trackNum, 10);
      return isSameProject && isSameArticle && isSameTrack;
    };

    var trackHasAudio = function(track) {
      return track.audioFile && track.audioFile !== "";
    };

    var findFirstTrackWithAudio = function(tracks) {
      for (var i = 0; i < tracks.length; i++) {
        if (trackHasAudio(tracks[i])) {
          return tracks[i];
        }
      }
    };

    var indexOfTrack = function(track, tracks) {
      for (var i = 0; i < tracks.length; i++) {
        if (isSameTrack(currentTrack, tracks[i])) {
          return i;
        }
      }
    };

    var findNextTrackWithAudio = function(tracks) {
      var nextIndex = indexOfTrack(currentTrack, tracks) + 1;
      for (var i = nextIndex; i < tracks.length; i++) {
        if (trackHasAudio(tracks[i])) {
          return tracks[i];
        }
      }
    };

    var setNextTrack = function() {
      var tracks = [];
      if (playNextScope === "project") {
        tracks = Data.projectLocations(currentTrack.projectId);
      } else {
        tracks = Data.articleLocations(currentTrack.projectId, currentTrack.articleId);
      }
      playNextTrack = findNextTrackWithAudio(tracks);
      console.log("[AudioPlayer] Setting next track:", playNextTrack);
    };

    var setCurrentTrack = function(track) {
      currentTrack = track;
      console.log("[AudioPlayer] Setting current track:", currentTrack);
    };

    var setPlayNextScope = function(scope) {
      playNextScope = scope;
      console.log("[AudioPlayer] Setting play next scope:", playNextScope);
    };

    var playTrack = function(track) {
      if (trackHasAudio(track)) {
        audio.src = track.audioFile;
        audio.playbackRate = 100.0;
        audio.play();
      }
      setCurrentTrack(track);
      setNextTrack();
    };

    var playNextTrack = function() {
      playTrack(playNextTrack);
    }

    var playSelectedTrack = function(playNextScope, projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play track:", projectId, articleId, trackNum);
      var tracks = Data.articleLocations(projectId, articleId);
      if (tracks.length > trackNum) {
        if (trackHasAudio(tracks[trackNum])) {
          playTrack(tracks[trackNum]);
          setPlayNextScope(playNextScope);
          return true;
        } else {
          console.log("[AudioPlayer] No audio:", projectId, articleId, trackNum);
        }
      } else {
        console.log("[AudioPlayer] No track", projectId, articleId, trackNum);
      }
    };

    var playSelectedArticle = function(playNextScope, projectId, articleId) {
      console.log("[AudioPlayer] Play article:", projectId, articleId);
      var tracks = Data.articleLocations(projectId, articleId);
      if (tracks[0].audioFile) {
        playTrack(tracks[0]);
        setPlayNextScope(playNextScope);
        return true;
      } else {
        console.log("[AudioPlayer] No audio:", projectId, articleId);
      }
    };

    var playSelectedProject = function(playNextScope, projectId) {
      console.log("[AudioPlayer] Play project:", projectId);
      var tracks = Data.projectLocations(projectId);
      var track = findFirstTrackWithAudio(tracks);
      if (track) {
        playTrack(track);
        setPlayNextScope(playNextScope);
        return true;
      } else {
        console.log("[AudioPlayer] No audio:", projectId);
      }
    };

    var playSelection = function(playNextScope, projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play:", projectId, articleId, trackNum);
      if (trackNum) {
        playSelectedTrack(playNextScope, projectId, articleId, trackNum);
      } else if (articleId) {
        playSelectedArticle(playNextScope, projectId, articleId);
      } else if (projectId) {
        playSelectedProject(playNextScope, projectId);
      }
    };

    var toggle = function(playNextScope) {
      console.log("[AudioPlayer] Toggle:", currentTrack);
      if (audio.paused) {
        audio.play();
        setPlayNextScope(playNextScope);
      } else {
        audio.pause();
      }
    };

    var playPause = function(playNextScope, projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play/Pause:", playNextScope, projectId, articleId, trackNum);
      if (isCurrentSelection(projectId, articleId, trackNum)) {
        toggle(playNextScope);
      } else {
        playSelection(playNextScope, projectId, articleId, trackNum);
      }
    };

    var isPlaying = function(projectId, articleId, trackNum) {
      if (isCurrentSelection(projectId, articleId, trackNum) && !audio.paused) {
      }
      return isCurrentSelection(projectId, articleId, trackNum) && !audio.paused;
    };

    var hasAudio = function(projectId, articleId, trackNum) {
      var tracks = [];
      if (trackNum) {
        tracks.push(Data.articleLocations(projectId, articleId)[trackNum]);
      } else if (articleId) {
        tracks = Data.articleLocations(projectId, articleId);
      } else if (projectId) {
        tracks = Data.projectLocations(projectId);
      }

      return findFirstTrackWithAudio(tracks);
    };

    // listen for audio-element events, and broadcast stuff
    audio.addEventListener('play', function() {
      console.log("[Audio] Played:", currentTrack);
      $rootScope.$broadcast('audio.stateChanged', currentTrack);
    });
    audio.addEventListener('pause', function() {
      console.log("[Audio] Paused:", currentTrack);
      $rootScope.$broadcast('audio.stateChanged', currentTrack);
    });
    audio.addEventListener('ended', function() {
      console.log("[Audio] Ended:", currentTrack);
      $rootScope.$broadcast('audio.stateChanged', currentTrack);
      if (playNextTrack) {
        var message = playNextTrack.articleId === currentTrack.articleId ? "Ønsker du å høre neste lydklipp fra" : "Ønsker du å lytte til";
        message += ' "' + playNextTrack.articleTitle + '"?';
        $rootScope.$broadcast('audio.playNextAvailable', playNextTrack.projectId, message);
      }
      setCurrentTrack({});
    });

    return {
      isPlaying: isPlaying,
      playPause: playPause,
      hasAudio: hasAudio,
      playNext: playNextTrack
    };
  }]);
