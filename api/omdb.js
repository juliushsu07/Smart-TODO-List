const request     = require('request');
require('dotenv').config()
const clientKey = process.env.DB_OMDB_KEY;





function omdbAPI(text,callback) {

request(`http://www.omdbapi.com/?apikey=${clientKey}&t=${text}`,
  function(err, req, body) {
    if(req.statusCode === 200) {
        console.log(JSON.parse(body))
    }
    else {
      console.log(clientKey);
      console.log(JSON.parse(body));
      callback({error: '#google_problems'});
    }
  });
}


omdbAPI("Porco Rosso", console.log)


module.exports =  omdbAPI;









