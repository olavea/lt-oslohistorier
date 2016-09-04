angular.module('LutterApp')
  .controller('MapController', ['$scope', '$state', 'Data', 'AppState', 'toLetterFilter', function ($scope, $state, Data, AppState, toLetterFilter) {

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

    function replaceMarkers(markersData) {
      $scope.markers = {};

      angular.forEach(markersData, function(marker, key) {
        console.log("Adding marker", marker.position, marker.title);
        $scope.markers['marker' + key] = {
          lat: marker.lat,
          lng: marker.lng,
          projectId: marker.projectId,
          articleId: marker.articleId,
          icon: {
            type: 'div',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            className: 'marker',
            html: '<div class="badge badge-primary ' + AppState.selectedProjectId + '" style="background-color: ' + marker.color + '"><span>' + toLetterFilter(marker.position) +'</span></div>'
          }
        }
      });
    }

    $scope.$watch('state.selectedProjectId', function(newProjectId, oldProjectId) {
      if(newProjectId !== oldProjectId) {
        var markersData = [];
        if(newProjectId === "all") {
          angular.forEach(Data, function(projectMarkers) {
            markersData = markersData.concat(projectMarkers);
          });
        } else {
          markersData =  newProjectId ? Data[newProjectId] : [];
        }
        replaceMarkers(markersData);
      }

    });

    $scope.$on('leafletDirectiveMarker.click', function(event, args){
      console.log(event, args);
      $state.go('project.article', { projectId: args.model.projectId, articleId: args.model.articleId });
    });

    $scope.$on('leafletDirectiveMap.click', function(event, args){
      // Can be annoying if one misses one of the points
      //$state.go('home');
    });

   }]);
