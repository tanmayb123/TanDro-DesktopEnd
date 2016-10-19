var request = require('request');

var lastJSON;

(function getJSON() {
  request('http://192.168.0.16:5000', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      lastJSON = JSON.parse(body);
      console.log(lastJSON);
      setTimeout(getJSON, 1000);
    }
  });
})();
