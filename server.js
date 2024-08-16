const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.gif')) {

        res.setHeader('Content-Type', 'image/jpeg'); // or image/png, image/gif, etc.
     
      }
    }
  }));

  app.get("/", async (req, res) => {
    try {
      const response = await axios.get(
        "https://newsapi.org/v2/top-headlines?country=in&apiKey=2d5dcd7ffe8347f2a5786ed207d31c4d",
      );
      const articles = response.data.articles;
      res.render("index", { news: articles });
    } catch (error) {
      console.error("Error fetching news articles:", error);
      res.status(500).send("Error fetching news articles. Please try again later.");
    }
  });

app.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=2d5dcd7ffe8347f2a5786ed207d31c4d`
    );
    const data = response.data.articles;

    const news = data.filter((dataItem) => dataItem.title?.toLowerCase().includes(searchTerm?.toLowerCase()));

    res.render("index", { news });
  } catch (error) {
    console.error("Error fetching search results:", error);
    res
      .status(500)
      .send("Error fetching search results. Please try again later.");
  }
});


app.get("/news-by-date", async (req, res) => {
  try {
    const date = req.query.date;
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=*&from=${date}&to=${date}&sortBy=popularity&apiKey=2d5dcd7ffe8347f2a5786ed207d31c4d`
    );
    const data = response.data.articles;

    res.render("index", { news: data });
  } catch (error) {
    console.error("Error fetching news by date:", error);
    res.status(500).send("Error fetching news by date. Please try again later.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});