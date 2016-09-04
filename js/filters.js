angular.module('LutterApp')
  .filter('toLetter', function () {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ';
    return function (i) {
      return (i >= alphabet.length ? idOf((i / alphabet.length >> 0) - 1) : '') +
        alphabet[i % alphabet.length >> 0];
    };
  });
