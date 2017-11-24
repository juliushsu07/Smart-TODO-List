require('dotenv').config()
const request   = require('request');
const associateID = process.env.DB_AMAZON_ASSOCIATE_ID
const accessKey = process.env.DB_AMAZON_ACCESS_KEY
const secretKey = process.env.DB_AMAZON_SECRET_KEY
const {parseString} = require('xml2js');
const amazon = require('amazon-product-api');


const client = amazon.createClient({
  awsId:`${accessKey}`,
  awsSecret:`${secretKey}`,
  awsTag:`${associateID}`
});


function amazonAPI(text, callback) {

client.itemSearch({
    keywords: `${text}`,
    responseGroup: 'ItemAttributes,Offers,Images',
    domain: 'webservices.amazon.ca'
  })
  .then(function(results) {
    console.log(results)
  }).catch(function(err) {
    console.log(err['Error'][0]['Message'])
  })
}


amazonAPI("PlayStation", null)

module.exports = amazonAPI

