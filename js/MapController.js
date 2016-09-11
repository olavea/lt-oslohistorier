angular.module('LutterApp')
  .controller('MapController', ['$scope', '$state', 'leafletBoundsHelpers', 'Data', 'AppState', 'toLetterFilter', 'AudioPlayer', function($scope, $state, leafletBoundsHelpers, Data, AppState, toLetterFilter, AudioPlayer) {
    $scope.state = AppState;

    angular.extend($scope, {
      // Setting temporary center to Oslo
      center: {
        lat: 59.914831,
        lng: 10.767347,
        zoom: 14
      },
      tiles: {
        name: 'Positron',
        url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        type: 'xyz'
      },
      markers: {}
    });

    function goToMarkerProject(marker) {
      $state.go('project', {projectId: marker.projectId});
    }

    function goToMarkerArticle(marker) {
      $state.go('project.article', {projectId: marker.projectId, articleId: marker.articleId});
    }

    function createMarkerKey(marker) {
      return String(marker.projectId) + String(marker.position) + String(marker.trackNum);
    }

    function zIndexOffset(marker) {
      if (AudioPlayer.isPlaying(marker.projectId, marker.articleId, marker.trackNum)) {
        return 1500;
      } else if (AppState.selectedArticleId === marker.articleId) {
        console.log("IS selected article");
        return 1000;
      }
      return 0;
    }

    function createIcon(marker) {
      var isPlaying = AudioPlayer.isPlaying(marker.projectId, marker.articleId, marker.trackNum);
      var iconClasses = String(AppState.selectedProjectId) + (isPlaying ? " playing" : "");
      iconClasses += " " + marker.projectId;
      iconClasses += " " + marker.articleId;
      var icon = {
        type: 'div',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        className: 'marker',
        html: '<div class="badge badge-primary ' + iconClasses + '"><span>' + toLetterFilter(marker.position) + '</span></div>'
      };
      return icon;
    }

    function updateBounds() {
      var latLongArray = [];
      angular.forEach($scope.markers, function(marker) {
        if (marker.lat && marker.lng) {
          latLongArray.push(L.latLng(marker.lat, marker.lng));
        }
      });
      var bounds = L.latLngBounds(latLongArray);
      $scope.bounds = {southWest: bounds.getSouthWest(), northEast: bounds.getNorthEast()};
      $scope.center = {};
    }

    function updateMarkers() {
      angular.forEach($scope.markers, function(marker) {
        marker.icon = createIcon(marker);
        marker.zIndexOffset = zIndexOffset(marker);
      });
    }

    function replaceMarkers(markersData) {
      $scope.markers = {};

      for (var i = 0; i < markersData.length; i++) {
        var marker = markersData[i];
        var markerKey = createMarkerKey(marker);
        $scope.markers[markerKey] = {
          lat: marker.lat,
          lng: marker.lng,
          trackNum: marker.trackNum,
          projectId: marker.projectId,
          articleId: marker.articleId,
          position: marker.position,
          zIndexOffset: zIndexOffset(marker),
          icon: createIcon(marker)
        };
      }
    }

    $scope.$watch('state.selectedProjectId', function(newProjectId, oldProjectId) {
      if (newProjectId !== oldProjectId) {
        var markersData = [];
        if (newProjectId === "all") {
          markersData = Data.allLocations();
          console.log("[Map Controller] display all markers");
        } else if (newProjectId) {
          markersData = Data.projectLocations(newProjectId);
          console.log("[Map Controller] display project markers", newProjectId);
        }
        replaceMarkers(markersData);
        updateBounds();
      }
    });

    $scope.$watch('state.selectedArticleId', function(newArticleId, oldArticleId) {
      console.log("[MapController] selectedArticleId changed", newArticleId, oldArticleId);
      if (newArticleId !== oldArticleId) {
        updateMarkers();
      }
    });

    $scope.$on('leafletDirectiveMarker.click', function(event, args) {
      if (AppState.selectedProjectId === "all") {
        goToMarkerProject(args.model);
      } else {
        goToMarkerArticle(args.model);
      }
    });

    $scope.$on('audio.stateChanged', function(r, data) {
      $scope.$apply(function() {
        updateMarkers();
      });
    });

    $scope.$on('leafletDirectiveMap.click', function(event, args) {
      // Can be annoying if one misses one of the points
      // $state.go('home');
    });
  }]);
