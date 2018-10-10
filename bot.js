require('dotenv').config();
const Mastodon = require('mastodon-api');
const https = require('https');

const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    api_url: 'https://botsin.space/api/v1/', // optional, defaults to https://mastodon.social/api/v1/
  })

getBitcoinPrice()
setInterval(getBitcoinPrice, 60*60*1000)

  function postBitcoinPrice(price){
    
    const params = {
        status: ` The price of one Bitcoin right now is ${price} USD`
      }
      M.post('statuses', params, (error, data) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`ID: ${data.id} and timestamp: ${data.created_at}`);
          console.log(data.content);
        }
      });
  }

  function getBitcoinPrice(){
    https.get('https://api.coindesk.com/v1/bpi/currentprice.json', (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try{
                postBitcoinPrice(JSON.parse(data).bpi.USD.rate);
            }
            catch(error){
                console.log("Couldn't get bitcoin price.")
            }
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
  }



