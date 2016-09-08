angular.module('LutterApp')
  .filter('toLetter', function() {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ';
    return function(i) {
      if (i < alphabet.length) {
        return alphabet[i];
      } else {
        return '?';
      }
    };
  });
