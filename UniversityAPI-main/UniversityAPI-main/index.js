import express from "express";
import request from "request";
import fs from "fs";

const app = express()

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

app.set("views", "./views");
app.set("view engine", "pug");

app.get('/', (req, res)=>{
    res.redirect("home");
})

app.get('/home', (req, res)=>{
    res.render("home");
})

app.get('/see_country_universities', (req, res)=>{
    res.render("country",{
        country: "",
        count: 0,
        unis: []
    });
})

app.get('/search_university', (req, res)=>{
    res.render("university",{
        unis: []
    });
})

app.get('/country-form', (req, res)=>{
    let name = req.query.country;
    let url = "http://universities.hipolabs.com/search?country="+name;
    fs.appendFileSync("log.txt",getTime() + ": Searched Universities in "+name+"\n")
    console.log(getTime() + ": Searched Universities in "+name+"\n");
    request(url, { json: true }, (err, response, data) => {
        if (err) { return console.log(err); }
        let unis = []
        for(let d of data){
            unis.push({
                name: d.name
            })
        }
        let text = ""
        for(let uni of unis){
            text += JSON.stringify(uni)
        }
        fs.appendFileSync("log.txt",getTime() + ": Universities = "+text+"\n")
        console.log(getTime() + ": Universities = "+text+"\n");
        fs.appendFileSync("log.txt",getTime() + ": Total Universities = "+unis.length+"\n")
        console.log(getTime() + ": Total Universities = "+unis.length+"\n");
        res.render("country",{
            country: name,
            count: unis.length,
            unis: unis
        });
    });
})

app.get('/university-form', (req, res)=>{
    let name = req.query.university;
    let url = "http://universities.hipolabs.com/search?name="+name;
    fs.appendFileSync("log.txt",getTime() + ": Searched University = "+name+"\n")
    console.log(getTime() + ": Searched University = "+name+"\n");
    request(url, { json: true }, (err, response, data) => {
        if (err) { return console.log(err); }
        let unis = []
        for(let d of data){
            unis.push({
                name: d.name,
                webpage: d.web_pages[0]
            })
        }
        let text = ""
        for(let uni of unis){
            text += JSON.stringify(uni)
        }
        fs.appendFileSync("log.txt",getTime() + ": University Found = "+text+"\n")
        console.log(getTime() + ": University Found = "+text+"\n");
        res.render("university",{
            unis: unis
        });
    });
})

app.listen(8080, ()=>{
    fs.appendFileSync("log.txt",getTime() + ": Server Started\n")
    console.log(getTime() + ": Server Started");
})