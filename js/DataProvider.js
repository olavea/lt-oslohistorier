angular.module('LutterApp')
  .provider('Data', [function() {
    var data = null;

    this.setData = function(newData) {
      console.log("Setting data");
      data = newData;
    };

    this.$get = [function() {
      return data;
    }];
  }]);
