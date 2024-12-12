const express = require("express");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");

mongoose
  .connect("mongodb://127.0.0.1:27017/metadata")
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("connection fail");
  });

const Schema = mongoose.Schema;

const metadataSchema = new Schema({
  fileName: String,
  fileType: String,
  size: Number,
});

const Metadata = mongoose.model("Metadata", metadataSchema);

const path = require("path");
const upload = require("./lib/multer");
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const allFiles = await Metadata.find({});
    res.render("list", { allFiles: allFiles });
  } catch (err) {
    console.log(`oops you had an error ${err.message}`);
  }
});

app.post("/upload", upload.single("fileHolder"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("no file uploaded");
    }
    console.log(req.file.originalname);
    const metadataSchema = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size,
    };
    const savedMetadata = await Metadata.create(metadataSchema);
    res.status(200).json({
      fileName: savedMetadata.fileName,
      fileType: savedMetadata.fileType,
      size: savedMetadata.size,
    });
  } catch (err) {
    console.log("oops got an error" + err.message);
  }
});

app.get("*", (req, res) => {
  res.send("not found");
});
app.listen(3000, () => {
  console.log("server has been started");
});
