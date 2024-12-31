const express = require("express");
const path = require('path')
const app = express();
require('dotenv').config()
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
// Serve static files from the React app 
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use("/files", express.static("files"));
//mongodb connection----------------------------------------------
const uri = process.env.MONGO_URI
mongoose.set('strictQuery', false);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));
//multer------------------------------------------------------------
const multer = require("multer");
``
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().toISOString().split('T')[0].replace(/-/g, "_")+"_csm";
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./model/pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

// Serve React app 

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/build', 'index.html')); });

//apis----------------------------------------------------------------
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

app.listen(5000, () => {
  console.log("Server Started");
});
