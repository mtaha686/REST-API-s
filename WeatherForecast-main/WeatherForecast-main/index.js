import express from "express";
import request from "request";
import fs from "fs";

function getTime(){
    let today = new Date();
    let time = today.getHours().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) + ":" + today.getMinutes().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    return time;
}

let API_KEY = '23aa513e231ad565af58e636729d8307';

function forecast(location, email, phone) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=12&appid=${API_KEY}&units=metric`
	request({ url: url, json: true }, function (error, response) {
		if (error) {
			fs.appendFileSync("log.txt",getTime() + ": Unable to connect to Forecast API\n")
            console.log(getTime() + ": Unable to connect to Forecast API\n");
		}
		else {
            const result = response.body.list[0].main;
			const text = `Location: ${location}\nTemperature: ${result.temp}°C\tFeels Like: ${result.feels_like}°C\tMin Temp: ${result.temp_min}°C\tMax Temp: ${result.temp_max}°C\tHumidity: ${result.humidity}%`
            fs.appendFileSync("log.txt",getTime() + ": Data Fetched from Forecast API\t"+text+"\n")
            console.log(getTime() + ": Data Fetched from Forecast API\t"+text+"\n");
            const emailoptions = {
                method: 'POST',
                url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
                headers: {
                  'content-type': 'application/json',
                  'X-RapidAPI-Key': '598e3bd4d6msh8cb1730f9402126p1d2660jsn218a1ea76503',
                  'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com',
                  useQueryString: true
                },
                body: {
                  personalizations: [{to: [{email: email}], subject: 'Weather Forecast'}],
                  from: {email: 'abdulrehman@gmail.com'},
                  content: [{type: 'text/plain', value: text}]
                },
                json: true
              };
              
              request(emailoptions, function (errr, result, body) {
                  if (errr){
                    fs.appendFileSync("log.txt",getTime() + ": Error Occured! = "+errr+"\n")
                    console.log(getTime() + ": Error Occured! = "+errr+"\n");
                  }
                  else{
                    fs.appendFileSync("log.txt",getTime() + ": Email Sent!\n")
                    console.log(getTime() + ": Email Sent!\n");
                  }
              });
              const smsoptions = {
                method: 'POST',
                url: 'https://sms77io.p.rapidapi.com/sms',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'X-RapidAPI-Key': '598e3bd4d6msh8cb1730f9402126p1d2660jsn218a1ea76503',
                  'X-RapidAPI-Host': 'sms77io.p.rapidapi.com',
                  useQueryString: true
                },
                form: {
                  to: phone,
                  p: 'UsHn7eplcesQPGOXOrdzqY1O7KvP5fxah0ixxMAqn3YZoLhdur9oQLCiczig6PW6',
                  text: text
                }
              };
              
              request(smsoptions, function (errr, result, body) {
                  if (errr){
                    fs.appendFileSync("log.txt",getTime() + ": Error Occured! = "+errr+"\n")
                    console.log(getTime() + ": Error Occured! = "+errr+"\n");
                    throw new Error(errr);
                  }
                  else{
                    fs.appendFileSync("log.txt",getTime() + ": SMS Sent!\n")
                    console.log(getTime() + ": SMS Sent!\n");
                  }
              });
		}
	})
}

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.get('/', (req, res)=>{
    res.render("index",{
        message: ""
    });
})

app.get('/weather-form', (req, res)=>{
    let loc = req.query.location;
    let email = req.query.email;
    let phone = req.query.phone;
    fs.appendFileSync("log.txt",getTime() + ": Weather Update Subscription for Location = "+loc+" Email = "+email+" Phone = "+phone+"\n")
    console.log(getTime() + ": Weather Update Subscription for Location = "+loc+" Email = "+email+" Phone = "+phone+"\n");
    forecast(loc, email, phone);
    res.render("index",{
        message: "Subscribed Successfully!"
    })
})

app.listen(8080, ()=>{
    fs.appendFileSync("log.txt",getTime() + ": Server Started\n")
    console.log(getTime() + ": Server Started");
})