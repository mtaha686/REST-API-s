import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const url = "https://bored-api.appbrewery.com/random";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const resp = axios.get(url);
    const result = (await resp).data;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
    res.render("index.ejs", {
      error: "Error fetching activity",
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const { type, participants } = req.body;
    const resp = await axios.get(
      url + `/filter?type=${type}&participants=${participants}`
    );
    const result = resp.data;
    console.log(result);
    res.render("index.eje", {
      data: result[Math.floor(Math.random() * result.length)],
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No activities that match your criteria.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
