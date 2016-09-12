angular.module('LutterApp')
  .service('AudioPlayer', ['$http', '$rootScope', 'Data', function($http, $rootScope, Data, AppState) {
    var audio = new Audio();
    var currentTrack = {};
    var playNextScope = "article";

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
          console.log("Index of track" + i);
          return i;
        }
      }
    };

    var findNextTrackWithAudio = function(tracks) {
      var nextIndex = indexOfTrack(currentTrack, tracks) + 1;
      console.log("Index of next track" + nextIndex);
      for (var i = nextIndex; i < tracks.length; i++) {
        if (trackHasAudio(tracks[i])) {
          return tracks[i];
        }
      }
    };

    var setCurrentTrack = function(track) {
      currentTrack = track;
      console.log("[AudioPlayer] Setting current track: ", currentTrack);
    };

    var setPlayNextScope = function(scope) {
      console.log("play next scope", scope);
      playNextScope = scope;
    };

    var playTrack = function(track) {
      audio.src = track.audioFile;
      // audio.playbackRate = 2.0;
      audio.play();
      setCurrentTrack(track);
    };

    var playSelectedTrack = function(projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play track:", projectId, articleId, trackNum);
      var tracks = Data.articleLocations(projectId, articleId);
      if (tracks.length > trackNum) {
        if (tracks[trackNum].audioFile) {
          playTrack(tracks[trackNum]);
          setPlayNextScope("article");
          return true;
        } else {
          console.log("[AudioPlayer] No audio", projectId, articleId, trackNum);
        }
      } else {
        console.log("[AudioPlayer] No track", projectId, articleId, trackNum);
      }
    };

    var playSelectedArticle = function(projectId, articleId) {
      console.log("[AudioPlayer] Play article:", projectId, articleId);
      var tracks = Data.articleLocations(projectId, articleId);
      if (tracks[0].audioFile) {
        playTrack(tracks[0]);
        setPlayNextScope("article");
        return true;
      } else {
        console.log("[AudioPlayer] No audio", projectId, articleId);
      }
    };

    var playSelectedProject = function(projectId) {
      console.log("[AudioPlayer] Play project:", projectId);
      var tracks = Data.projectLocations(projectId);
      var track = findFirstTrackWithAudio(tracks);
      if (track) {
        playTrack(track);
        setPlayNextScope("project");
        return true;
      } else {
        console.log("[AudioPlayer] No audio", projectId);
      }
    };

    var playSelection = function(projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play:", projectId, articleId, trackNum);
      if (trackNum) {
        playSelectedTrack(projectId, articleId, trackNum);
      } else if (articleId) {
        playSelectedArticle(projectId, articleId);
      } else if (projectId) {
        playSelectedProject(projectId);
      }
    };

    var playNext = function() {
      var tracks = (playNextScope === "project") ? Data.projectLocations(currentTrack.projectId) : Data.articleLocations(currentTrack.projectId, currentTrack.articleId);
      var track = findNextTrackWithAudio(tracks);
      console.log("Next tracks to choose from ", tracks);

      if (!track) {
        return;
      }

      console.log("Next track ", track);

      var message = track.articleId === currentTrack.articleId ? "Ønsker du å høre neste lydklipp fra" : "Ønsker du å lytte til";
      message += " " + track.articleTitle + "?";
      var r = confirm(message);
      if (r === true) {
        playTrack(track);
      }
    };

    var toggle = function() {
      console.log("[AudioPlayer] Toggle:", currentTrack);
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    var playPause = function(projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play/Pause", projectId, articleId, trackNum);
      if (isCurrentSelection(projectId, articleId, trackNum)) {
        toggle();
      } else {
        playSelection(projectId, articleId, trackNum);
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
      playNext();
    });

    return {
      isPlaying: isPlaying,
      playPause: playPause,
      hasAudio: hasAudio
    };
  }]);
