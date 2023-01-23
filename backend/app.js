const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

// WlukiVMuA3YSDrxk
const uri = "mongodb+srv://somebody2107:WlukiVMuA3YSDrxk@cluster0.ddqlrcw.mongodb.net/node-angular?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => {
    console.log('Failed to connect')
  });
app.use(bodyParser.json());

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

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save().then((createdPost) => {
    res.status(201).json({
      message: 'Post added successfully',
      post: createdPost
    })
  });
})

app.get('/api/posts',(req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: "Fetch posts successfully",
        posts: documents
      })
    })
    .catch((err) => {
      console.log(err);
    })

});

app.delete('/api/posts/:id',(req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(() => {
      res.status(201).json({ message: "Post Deleted" })
    })
});

module.exports = app;