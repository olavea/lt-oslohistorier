angular.module('LutterApp')
  .service('AudioPlayer', ['$http', '$rootScope', 'Data', function($http, $rootScope, Data, AppState) {
    var audio = new Audio();
    var currentTrack = {};

    var isCurrentTrack = function(projectId, articleId, trackNum) {
      var isSameProject = currentTrack.projectId === projectId || projectId === undefined;
      var isSameArticle = currentTrack.articleId === articleId || articleId === undefined;
      var isSameTrack = parseInt(currentTrack.trackNum, 10) === parseInt(trackNum, 10) || trackNum === undefined;
      return isSameProject && isSameArticle && isSameTrack;
    };

    var findFirstTrackWithAudio = function(tracks) {
      for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].audioFile && tracks[i].audioFile !== "") {
          return tracks[i];
        }
      }
    };

    var setCurrentTrack = function(projectId, articleId, trackNum) {
      currentTrack = {
        projectId: projectId,
        articleId: articleId,
        trackNum: trackNum
      };
      console.log("[AudioPlayer] Setting current track: ", currentTrack);
    };

    var playTrack = function(projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play track:", projectId, articleId, trackNum);
      var tracks = Data.articleLocations(projectId, articleId);
      if (tracks.length > trackNum) {
        if (tracks[trackNum].audioFile) {
          audio.src = tracks[trackNum].audioFile;
          audio.play();
          setCurrentTrack(projectId, articleId, trackNum);
          return true;
        } else {
          console.log("[AudioPlayer] No audio", projectId, articleId, trackNum);
        }
      } else {
        console.log("[AudioPlayer] No track", projectId, articleId, trackNum);
      }
    };

    var playArticle = function(projectId, articleId) {
      console.log("[AudioPlayer] Play article:", projectId, articleId);
      var tracks = Data.articleLocations(projectId, articleId);
      if (tracks[0].audioFile) {
        audio.src = tracks[0].audioFile;
        audio.play();
        setCurrentTrack(projectId, articleId, 0);
        return true;
      } else {
        console.log("[AudioPlayer] No audio", projectId, articleId);
      }
    };

    var playProject = function(projectId) {
      console.log("[AudioPlayer] Play project:", projectId);
      var tracks = Data.projectLocations(projectId);
      var track = findFirstTrackWithAudio(tracks);
      if (track) {
        audio.src = track.audioFile;
        audio.play();
        setCurrentTrack(projectId, track.articleId, track.trackNum);
        return true;
      } else {
        console.log("[AudioPlayer] No audio", projectId);
      }
    };

    var play = function(projectId, articleId, trackNum) {
      console.log("[AudioPlayer] Play:", projectId, articleId, trackNum);
      if (trackNum) {
        playTrack(projectId, articleId, trackNum);
      } else if (articleId) {
        playArticle(projectId, articleId);
      } else if (projectId) {
        playProject(projectId);
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
      if (isCurrentTrack(projectId, articleId, trackNum)) {
        toggle();
      } else {
        play(projectId, articleId, trackNum);
      }
    };

    var isPlaying = function(projectId, articleId, trackNum) {
      if (isCurrentTrack(projectId, articleId, trackNum) && !audio.paused) {
      }
      return isCurrentTrack(projectId, articleId, trackNum) && !audio.paused;
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
      $rootScope.$broadcast('audio.stateChanged', this);
    });
    audio.addEventListener('pause', function() {
      console.log("[Audio] Paused:", currentTrack);
      $rootScope.$broadcast('audio.stateChanged', this);
    });
    audio.addEventListener('ended', function() {
      console.log("[Audio] Ended:", currentTrack);
      $rootScope.$broadcast('audio.stateChanged', this);
    });

    return {
      isPlaying: isPlaying,
      playPause: playPause,
      hasAudio: hasAudio
    };
  }]);
