const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const postsRouter = require("./routes/posts")

const app = express();

// WlukiVMuA3YSDrxk
const uri = "mongodb+srv://somebody2107:WlukiVMuA3YSDrxk@cluster0.ddqlrcw.mongodb.net/node-angular?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to database')
  })
  .catch((error) => {
    console.log(error);
    console.log('Failed to connect')
  });
app.use(bodyParser.json());
app.use("/images/", express.static(path.join("backend/images")));

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
})

app.use("/api/posts", postsRouter)

module.exports = app;
