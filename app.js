const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = new express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res)=>{
  var fname = req.body.first_name;
  var lname = req.body.last_name;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);
  const url = 'https://us11.api.mailchimp.com/3.0/lists/b8202fa17b';
  const options = {
    method: 'POST',
    auth: 'thomas:00482a9e44b757cdfa5f168f21b7c47b-us11'
  };
  const request = https.request(url, options, (response)=>{
    response.on('data', (data)=>{
      //console.log(JSON.parse(data))
      var resCode = response.statusCode;
      if(resCode == 200){
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }
    })
  })
  request.write(jsonData);
  request.end();
})

app.post('/failure', (req, res)=>{
  res.redirect('/');
})






app.listen(3000, ()=>{
  console.log('Listening on port 3000...')
})
// List ID: b8202fa17b
// API kay
// 00482a9e44b757cdfa5f168f21b7c47b-us11
