require('dotenv').config();

const axios = require('axios');

const userEmailAddress = process.env.USER_EMAIL_ADDRESS;
const userPassword = process.env.USER_PASSWORD;
const loginUrl = process.env.LOGIN_URL;
const leagueUrl = process.env.LEAGUE_URL;

// Send a POST request to the login endpoint
axios({
    method: 'post',
    url: loginUrl,
    data: {
        email: userEmailAddress,
        password: userPassword,
        ext: 'false'
    },
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}).then((response) => {
    var userLoginResponse = response.data;
    var leagueId = userLoginResponse.leagues[0].id
    var cookieToken = userLoginResponse.token;

    // Check if there is currently a gift available
    axios({
        method: 'get',
        url: `${leagueUrl} ${leagueId} /currentgift`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `kkstrauth=${cookieToken}`
        }
    }).then((response) => {
        var giftResponse = response.data;

        // If there is an availabe gift, collect it
        if (giftResponse.isAvailable == false) {
            console.log('There is currently no gift available.');
        } else {
            console.log(`The following gift is currently available:\nAmount: ${giftData.amount}\nLevel: ${giftData.level}`);
            console.log('\nTrying to collect the gift...');

            axios({
                method: 'post',
                url: `${leagueUrl} ${leagueId} /collectgift`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': `kkstrauth=${cookieToken}`
                }
            }).then((response) => {
                var giftCollectResponse = response.data;
                console.log(`Gift collected successfully.\nAmount: ${giftCollectResponse.amount}\nLevel: ${giftCollectResponse.level}`);
            }).catch((error) => {
                if (error.response) {
                     // Request made and server responded
                     console.log(error.response.data);
                     console.log(error.response.status);
                     console.log(error.response.headers);
                } else if (error.request){
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
        }
    }).catch((error) => {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
       } else if (error.request){
           // The request was made but no response was received
           console.log(error.request);
       } else {
           // Something happened in setting up the request that triggered an Error
           console.log('Error', error.message);
       }
    });
}).catch((error) => {
    if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
   } else if (error.request){
       // The request was made but no response was received
       console.log(error.request);
   } else {
       // Something happened in setting up the request that triggered an Error
       console.log('Error', error.message);
   }
});