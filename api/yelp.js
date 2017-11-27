'use strict';
const yelp = require('yelp-fusion');

const clientId = process.env.DB_YELP_CLIENT_ID;
const clientSecret = process.env.DB_YELP_CLIENT_SECRET;



module.exports = function yelpAPI(term, callback) {

  const searchRequest = {
    term: term,
    location: 'Toronto, ON'
  };

  yelp.accessToken(clientId, clientSecret).then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    client.search(searchRequest).then(response => {
      const firstResult = response.jsonBody.businesses[0];
      callback(firstResult);
    });
  }).catch(e => {
    console.log(e);
  });

};




