const request = require('request');
const { parseString } = require('xml2js');

const clientKey = process.env.GOODREADS_KEY;


function goodreadsAPI(text, callback) {

  request(`https://www.goodreads.com/search/index.xml?q=${text}&key=${clientKey}`, function(err, req, body) {
    if (req.statusCode === 200) {
      parseString(body, callback);
    } else {
      callback({ error: '#goodreads_problems' });
    }
  });
};

module.exports = goodreadsAPI;
