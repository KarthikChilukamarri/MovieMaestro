// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express'),
    imdb = require('imdb-api');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const MOVIE_ACTION = 'give_rating';
const MOVIE_ARGUMENT = 'movieName';
const MORE_ACTION = 'give_more_info';
const MORE_ARGUMENT = 'userInput';

console.log("Starting");


/*let movie;
 
imdb.getReq({ name: MOVIE_ARGUMENT }, (err, things) => {
    movie = things;
});*/
 
// Promises! 
//imdb.get('The Toxic Avenger').then(console.log);
//imdb.getById('tt0090190').then(console.log);
//imdb.getReq({ name: 'The Toxic Avenger' }).then(console.log);


app.get('/', function (req, res){
  console.log("Get Method");
  let rating;
  imdb.getReq({ name: "Boumchakalaka" }, (err, data) => {
        //rating = data.rating;

        console.log("Rating: "+data);
        res.status(200).send(data);
    });

})

// [START SillyNameMaker]
app.post('/', function (req, res) {
  console.log("inside post");
  console.log("body",req.body);
  const assistant = new Assistant({request: req, response: res});
  //console.log('Request headers: ' + JSON.stringify(req.headers));
  //console.log('Request body: ' + JSON.stringify(req.body));

  // Make a silly name
  function getRating (assistant) {
    let movie = assistant.getArgument(MOVIE_ARGUMENT);
    console.log("Movie: "+movie);
    let rating;
    let rating2;
    imdb.getReq({name: movie}, (err, data) => {
      rating2 = data.rating;
    });
    console.log(rating2);
    imdb.getReq({ name: movie }, (err, data) => {
      if(err){
        assistant.ask("I couldn't find the movie you're asking for. Would you like to try with another movie?");

      }
      else if (data){
        rating = data.rating;
        console.log("Rating: "+rating);
        if(rating == "N/A"){
          assistant.ask('The IMDB rating for the movie '+movie+' is unavailable! Say yes, if you would like to know the rating for another movie. Otherwise, say no. You can also respond with a movie name to save time.');
        }
        else{
        assistant.ask('The IMDB rating for the movie '+movie+' is '+
      rating+
      '! Say yes, if you would like to know the rating for another movie. Otherwise, say no. You can also respond with a movie name to save time.');
      }
    }
  });
}
    

  function handleMore (assistant) {
    let condition = assistant.getArgument(MORE_ARGUMENT);
    let context = assistant.getContexts();
    console.log(context);
    console.log("condition");
    if(condition == "no"){
      assistant.tell("Thank you for using Movie Maestro!");
    }

    else if(condition == "yes"){
      assistant.ask("Which movie would you like the rating for?");
    }

    else {
      assistant.ask("Sorry! I didn't get that! Would you like to know the rating for another movie?")
    }
  }

  let actionMap = new Map();
  actionMap.set(MOVIE_ACTION, getRating);
  actionMap.set(MORE_ACTION, handleMore);

  assistant.handleRequest(actionMap);
});
// [END SillyNameMaker]

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    //console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
