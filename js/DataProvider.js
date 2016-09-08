angular.module('LutterApp')
  .provider('Data', [function() {
    var data = {};

    this.setData = function(newData) {
      console.log("Setting data");
      data = newData;
    };

    function getAllLocations() {
      var allLocations = [];
      angular.forEach(data, function(projectLocations) {
        allLocations = allLocations.concat(projectLocations);
      });
      return allLocations;
    }

    function getProjectLocations(projectId) {
      if (data.hasOwnProperty(projectId)) {
        return data[projectId];
      }
      return [];
    }

    function getArticleLocations(projectId, articleId) {
      var projectLocations = getProjectLocations(projectId);
      var articleLocations = [];
      angular.forEach(projectLocations, function(location) {
        if (location.articleId === articleId) {
          articleLocations.push(location);
        }
      }, articleLocations);
      return articleLocations;
    }

    this.$get = [function() {
      return {
        allLocations: getAllLocations,
        projectLocations: getProjectLocations,
        articleLocations: getArticleLocations
      };
    }];
  }]);
