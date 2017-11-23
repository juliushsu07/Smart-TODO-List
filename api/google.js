const request = require('request');

require('dotenv').config();
const clientKey = process.env.DB_GOOGLE_KEY;

console.log(clientKey);

// googleAPI = function(text) {
//   request
//   .get(`https://www.googleapis.com/customsearch/v1?q=${text}&cx=003159225023571024600%3Apw3tqlhkvcu&num=1&key=${clientKey}`)
//   .on('response', function (response) {
//     console.log(response.body);
//   });
//   };

// googleAPI('Dunkirk')


function googleAPI(text, callback) {
  let requestOptions = {
    url : `https://www.googleapis.com/customsearch/v1?q=${text}&cx=003159225023571024600%3Apw3tqlhkvcu&num=1&key=${clientKey}`
  };

  console.log('sending...')
  request(requestOptions, function(err, req, body) {
    if(req.statusCode === 200) {
      console.log('OK');
      callback(JSON.parse(body));
    }
    else {
      console.log('Status Code: ', req.statusCode);
      if (req.statusCode === 404) {
        console.log('404 ERROR');
      } else if (req.statusCode === 401) {
        console.log('ERROR 401');
      }
    }
  });
}

googleAPI('Shantaram', console.log)

