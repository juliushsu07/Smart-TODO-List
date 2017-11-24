
const request   = require('request');
const clientKey = process.env.GOODREADS_KEY;

module.exports = function googleAPI(text, callback) {

  request(`https://www.goodreads.com/search/index.xml?q=harry+potter&key=oYQ4Rnj1luJbD352YA3Q`
          , function(err, req, body) {
    if(req.statusCode === 200) {

      callback(null, lookup[JSON.parse(body).items[0].displayLink], JSON.parse(body).items[0].title);
    }
    else {
      console.log(clientKey);
      console.log(JSON.parse(body));
      callback({error: '#google_problems'});
    }
  });
};
