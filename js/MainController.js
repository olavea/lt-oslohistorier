angular.module('LutterApp')
  .controller('MainController', ['$scope', '$state', 'AudioPlayer', function($scope, $state, AudioPlayer) {
    $scope.goTo = function(projectId, articleId) {
      if (articleId) {
        $state.go('project.article', {projectId: projectId, articleId: articleId});
      } else if (projectId) {
        $state.go('project', {projectId: projectId});
      }
    };
  }]);
