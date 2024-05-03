import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://universities.hipolabs.com");
    const universities = response.data;
    res.render("search.ejs", { universities });
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/search", async (req, res) => {
  try {
    const country = req.body.country;
    const response = await axios.get(
      `http://universities.hipolabs.com/search?country=${country}`
    );
    const universities = response.data;
    res.render("search.ejs", { universities });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("search.ejs", {
      error: "No universities found for the given country.",
    });
  }
});

app.listen(port, "localhost", () => {
  console.log(`http://localhost:${port}`);
});
