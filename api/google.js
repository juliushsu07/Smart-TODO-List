const request     = require('request');
const clientKey = process.env.DB_GOOGLE_KEY;

module.exports = function googleAPI(text, callback) {

  request(`https://www.googleapis.com/customsearch/v1?q=${text}&cx=003159225023571024600%3Apw3tqlhkvcu&num=1&key=${clientKey}`
          , function(err, req, body) {
    if(req.statusCode === 200) {
      const lookup = {
        "www.yelp.ca": "eat",
        "www.imdb.com": "watch",
        "www.goodreads.com": "read",
        "www.amazon.ca": "buy"
      };
      callback(null, lookup[JSON.parse(body).items[0].displayLink], JSON.parse(body).items[0].title);
    }
    else {
      console.log(clientKey);
      console.log(JSON.parse(body));
      callback({error: '#google_problems'});
    }
  });
};
