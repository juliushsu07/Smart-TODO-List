
const request   = require('request');
const clientKey = process.env.GOODREADS_KEY;

function goodreadsAPI(text, callback) {

  request(`https://www.goodreads.com/search/index.xml?q=harry+potter&key=oYQ4Rnj1luJbD352YA3Q`
          , function(err, req, body) {
    if(req.statusCode === 200) {
      console.log(body);
    }
    else {
      console.log(clientKey);
      console.log(err);
      callback({error: '#google_problems'});
    }
  });
};

goodreadsAPI('harry potter', console.log);

module.exports = goodreadsAPI;
