var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require('./public/js/data-util');
var moment = require('moment');
var _ = require('underscore-node');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

// Load data in to variables
var _RESTAURANTS = dataUtil.loadData('./data/restaurants.json');
var _POST = dataUtil.loadData('./data/post.json');

// Render main page by listing all the post with the newest one on top
app.get('/',function(req,res){
  res.render('home',{
    post: _POST.post
  });
});

// Given an uuid of a post, display that post and that post only
app.get('/post/:uuid', function(req, res) {
  var _uuid = parseInt(req.params.uuid);
  var currentPost = _.findWhere(_POST["post"], {uuid: _uuid});
  // If currentPost is null, render 404 page, else render currentPost
  if (!currentPost) {
    return res.render('404');
  }else {
    // Get map url
    var detail = _.findWhere(_RESTAURANTS["restaurant_detail"], {name: currentPost.location});
    var url = detail["map_url"];
    res.render('post', {
      post: currentPost,
      url: url
    });
  }
});

// Create a new post and added to post.json
app.post('/add', function(req, res) {
  // Set up variables
  var _body = req.body;
  var newPost = {};
  var temp_start_date = moment(_body["start_date"], "MM/DD/YYYY").toDate();
  var temp_end_date = moment(_body["end_date"], "MM/DD/YYYY").toDate();

  // Set up new post object
  newPost.post_date = new Date();
  newPost.start_date = moment(temp_start_date).format("MMM Do, YYYY");
  newPost.end_date = moment(temp_end_date).format("MMM Do, YYYY");
  newPost.type = _body["discount_type"];
  newPost.location = _body["location"];
  newPost.description = _body["post_description"];
  newPost.upvote = 0;
  newPost.downvote = 0;
  newPost.uuid = Date.now();

  // Save new post to post.json
  _POST["post"].push(newPost);
  dataUtil.savePostData(_POST);
  
  // Redirect back to the referer
  res.redirect('back');
});

// Added Heroku ports
app.listen(process.env.PORT || 3000, function() {
  console.log('Listening!');
});