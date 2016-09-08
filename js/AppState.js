angular.module('LutterApp')
  .service('AppState', ['$rootScope', '$stateParams', 'Data', function($rootScope, $stateParams, Data) {
    this.selectedProjectId = $stateParams.projectId;
    this.selectedArticleId = $stateParams.projectId;
  }]);
