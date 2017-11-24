const request = require('request');
const clientKey = process.env.GOODREADS_KEY;
const { parseString } = require('xml2js');




function goodreadsAPI(text, callback) {

  request(`https://www.goodreads.com/search/index.xml?q=${text}&key=${clientKey}`, function(err, req, body) {
    if (req.statusCode === 200) {
      parseString(body, callback);
    } else {
      callback({ error: '#goodreads_problems' });
    }
  });
};

// goodreadsAPI('harry potter', console.log);

module.exports = goodreadsAPI;
