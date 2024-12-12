const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortUrl = require("./models/main");

app.use(express.urlencoded({ extended: false }));
mongoose
  .connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log(`an error too place ${err.message}`);
  });

app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});
app.post("/shortUrl", async (req, res) => {
  await shortUrl.create({ fullUrl: req.body.fullUrl });
  res.redirect("/");
});
app.get("/:short", async (req, res) => {
  const activeShort = await shortUrl.findOne({ shortUrl: req.params.short });
  if (activeShort == null) return res.sendStatus(404);

  activeShort.click++;
  activeShort.save();
  res.redirect(activeShort.fullUrl);
});
app.listen(8000, () => {
  console.log("server has been started");
});
