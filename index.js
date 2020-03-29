var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require('./data-util');
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
  var currentPost = _.findWhere(_POST.post, {uuid: _uuid});
  // If currentPost is null, render 404 page, else render currentPost
  if (!currentPost) {
    return res.render('404');
  }else {
    res.render('post', currentPost);
  }
});

// Added Heroku ports
app.listen(process.env.PORT || 3000, function() {
  console.log('Listening!');
});