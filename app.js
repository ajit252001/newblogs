//jshint esversion:6
 
//requiring the modules : 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
 
const homeStartingContent = "Hello and welcome to my blog website! My name is ajit kumar yadav, and I am excited to share my thoughts, ideas, and experiences with you. I created this blog to connect with like-minded individuals and build a community around our shared interests." ;
const aboutContent = "On this blog, you will find content related to your interests. Whether you are a beginner or an expert in this field, I hope to provide valuable insights and perspectives that will inspire and inform you.";
const contactContent = "I also want this blog to be a platform for creativity and self-expression. I will share personal stories, opinions, and reflections that may not always be directly related to [Your Niche], but that I hope will resonate with you nonetheless. ";
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
 
//Connecting to the database using mongoose.
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://ajitkryadav2511:test-123@cluster0.ejty5fj.mongodb.net/blogDB',{ useNewUrlParser: true });
}
 
//Creating an empty array but we are not using it in this version of the app.
// const posts = [];
 
 
//Creating Schema for the posts 
const postSchema = new mongoose.Schema({
  title : String,
  content: String,
});
 
 
//Creating a mongoose model based on this Schema :
 
const Post = mongoose.model("Post",postSchema);
 
app.get("/", function(req, res) {
 
  // Find all items in the Posts collection and render it into our home page.
 Post.find().then(posts =>{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
});
 
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});
 
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
 
app.get("/compose", function(req, res){
  res.render("compose");
 
 });
 
 //Saved the title and the post into our blogDB database.
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
 
  //We are saving the post through our compose route and redirecting back into the home route. A message will be displayed in our console when a post is being saved.
 
  post.save().then(() => {
 
    console.log('Post added to DB.');
 
    res.redirect('/');
 
  })
 
  .catch(err => {
 
    res.status(400).send("Unable to save post to database.");
 
  });
 
 
});
 
app.get("/posts/:postId", function(req, res){
  //We are storing the _id of our created post in a variable named requestedPostId
  const requestedPostId = req.params.postId;
 
  //Using the find() method and promises (.then and .catch), we have rendered the post into the designated page.
 
  Post.findOne({_id:requestedPostId})
  .then(function (post) {
    res.render("post", {
            title: post.title,
            content: post.content
          });
    })
    .catch(function(err){
      console.log(err);
    })
 
 
});
  
app.listen(port, function(req ,res){
  console.log("Listening on port "+port);
})
  
