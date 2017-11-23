const request = require('request');
const clientKey = process.env.DB_GOOGLE_KEY;

modules.exports = function googleAPI(text, callback) {

  request(`https://www.googleapis.com/customsearch/v1?q=${text}&cx=003159225023571024600%3Apw3tqlhkvcu&num=1&key=${clientKey}`
    , function(err, req, body) {
    if(req.statusCode === 200) {
      const lookup = {
        "www.yelp.com": "eat",
      };
      callback(null, JSON.parse(body));
    }
    else {
      callback({error: '#google_problems'});
    }
  });
};
