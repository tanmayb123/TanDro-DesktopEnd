var watson = require('watson-developer-cloud');
var request = require('request');
var fs = require('fs');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
require('shelljs/global');
var PythonShell = require('python-shell');

var conversation = watson.conversation({
  username: '286006fb-1ee9-4428-8bfd-2d1c816db12b',
  password: '5psDpUiiZuVN',
  version: 'v1',
  version_date: '2016-09-20'
});

// Replace with the context obtained from the initial request
var context = {};

context.batteryP = -1;
context.droneAltitude = -1;

var lastJSON;

(function getJSON() {
  request('http://192.168.2.4:5000', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      context.batteryP = JSON.parse(body).demo.batteryPercentage;
      context.droneAltitude = JSON.parse(body).demo.altitudeMeters;
    }
  });
  setTimeout(getJSON, 1000);
})();

function prompt(question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}

function convMessage(message) {
  conversation.message({
    workspace_id: '16e8a363-e99b-4379-b4ec-42489c57374f',
    input: {'text': message},
    context: context
  },  function(err, response) {
    if (err) {
      console.log('error:', err);
    } else {
      console.log('Watson: ' + response.output.text[0])

/*      var text_to_speech = new TextToSpeechV1({
        username: '55c6dafd-d277-45f4-8f8d-d8c0f9eefbb2',
        password: 'IoMPlpt7Dl5K'
      });
      var params = {
        text: response.output.text[0],
        voice: 'en-US_MichaelVoice', // Optional voice
        accept: 'audio/wav'
      };
      var stream = text_to_speech.synthesize(params).pipe(fs.createWriteStream('output.wav'));
      stream.on('finish', function() {
        PythonShell.run('play.py', function (err) {
          if (err) throw err;
        });
      })*/

      if (response.intents[0].intent == 'takeoff') {
        request('http://192.168.2.4:5500?action=takeoff', function (error, response, body) {});
      } else if (response.intents[0].intent == 'land') {
        request('http://192.168.2.4:5500?action=land', function (error, response, body) {});
      } else if (response.intents[0].intent == 'rotate') {
        var action;
        var speed;
        for (var i in response.entities) {
          if (response.entities[i].entity == 'rotationdirection') {
            if (response.entities[i].value == 'Clockwise') {
              action = 'clockwise';
            } else if (response.entities[i].value == 'Counter Clockwise') {
              action = 'anticlockwise';
            }
          } else if (response.entities[i].entity == 'speed') {
            speed = parseInt(response.entities[i].value);
          }
        }
        request('http://192.168.2.4:5500?action=' + action + '&speed=' + speed, function (error, response, body) {});
      } else if (response.intents[0].intent == 'updown') {
        var action;
        var speed;
        for (var i in response.entities) {
          if (response.entities[i].entity == 'updowndirection') {
            if (response.entities[i].value == 'up') {
              action = 'up';
            } else if (response.entities[i].value == 'down') {
              action = 'down';
            }
          } else if (response.entities[i].entity == 'speed') {
            speed = parseInt(response.entities[i].value);
          }
        }
        request('http://192.168.2.4:5500?action=' + action + '&speed=' + speed, function (error, response, body) {});
      } else if (response.intents[0].intent == 'stopmovement') {
        request('http://192.168.2.4:5500?action=stop', function (error, response, body) {});
      }

//      console.log(response);

      prompt('You: ', function(input) {
        convMessage(input);
      });

      context = response.context;
    }
  });
}

convMessage('Hi');

/*conversation.message({
  workspace_id: '16e8a363-e99b-4379-b4ec-42489c57374f',
  input: {'text': 'Hi'},
  context: context
},  function(err, response) {
  if (err)
    console.log('error:', err);
  else
    //console.log(JSON.stringify(response.context, null, 2));
    context = response.context;
});

context.batteryP = 0;

conversation.message({
  workspace_id: '16e8a363-e99b-4379-b4ec-42489c57374f',
  input: {'text': 'Battery'},
  context: context
},  function(err, response) {
  if (err)
    console.log('error:', err);
  else
    //console.log(JSON.stringify(response.context, null, 2));
    context = response.context;
});

conversation.message({
  workspace_id: '16e8a363-e99b-4379-b4ec-42489c57374f',
  input: {'text': 'Battery'},
  context: context
},  function(err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response, null, 2));
    context = response.context;
});*/
