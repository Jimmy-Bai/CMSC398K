var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var moment = require('moment');
var cron = require("node-cron");
var _ = require('underscore-node');
var dataUtil = require('./public/js/data-util');

// Start app using express
var app = express();

// Register Handlebars helper
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  helpers: require('./public/js/handlebars-helper.js')
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

// Load data in to variables and define required variables
var _RESTAURANTS = dataUtil.loadData('./data/restaurants.json');
var _POST = dataUtil.loadData('./data/post.json');
var _ERROR_MSG = {
  "main": 'There are current no discounts/freebies. Come check back later!',
  "search": 'Oh no! The location you are looking for does not exist!',
  "filter": 'Oh no! There are currently no posts with this filter!',
  "post": 'On no! The post you are looking for does not exist!'
};

// Render main page by listing all the post with the newest one on top
app.get('/', function (req, res) {
  // Render all posts in chronological order (most recently posted is first)
  res.render('post_list', {
    post: _POST.post,
    code: _ERROR_MSG.main
  });
});

// Given an uuid of a post, display that post and that post only
app.get('/post/:uuid', function (req, res) {
  var _uuid = parseInt(req.params.uuid);
  var currentPost = _.findWhere(_POST.post, { uuid: _uuid });
  var url;

  // If currentPost is not null, get map details and update the number of views
  if (currentPost) {
    // Get map url
    var detail = _.findWhere(_RESTAURANTS["restaurant_detail"], { name: currentPost.location });
    url = detail["map_url"];

    // Update post views and save
    currentPost.views = currentPost.views + 1;
    dataUtil.savePostData(_POST);
  }

  // Render page
  res.render('post', {
    post: currentPost,
    url: url,
    code: _ERROR_MSG.post
  });
});

// Redirect to a random post
app.get('/random', function (req, res) {
  var index = Math.floor(Math.random() * _POST.post.length);
  var postId = _POST.post[index].uuid;

  // Redirect to /post/:uuid
  res.redirect('/post/' + postId);
});

// Create a new post and added to post.json
app.post('/add', function (req, res) {
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
  newPost.views = 0;
  newPost.uuid = Date.now();

  // Save new post to the beginning post.json, keeping the chronological order
  _POST.post.unshift(newPost);
  dataUtil.savePostData(_POST);

  // Redirect back to the referer
  res.redirect('back');
});

// Given a restaurant location, list all of the restaurants that has that code
app.get('/search/:location', function (req, res) {
  var _name = req.params.location;

  // Filter posts
  var search = _.where(_POST.post, { location: _name });

  // Render page
  res.render('post_list', {
    post: search,
    code: _ERROR_MSG.search
  });
});

// Given a filter type, list all of the restaurants with that filter
app.get('/filter/:filter_type', function (req, res) {
  var _filter_type = req.params.filter_type;
  var filter = [];
  var mToday = new moment(new Date());
  var current = '';

  // Filter by hot, ending soon, discount and freebies
  if (_filter_type === 'hot') {
    // Return a list of recent posts sorted by the number of views
    var mLimit = moment.duration(5, 'days').asMilliseconds();

    // Loop through all the post
    _POST.post.forEach(function (currPost) {
      var mDuration = moment.duration(moment(currPost.post_date).diff(mToday));

      // Add the post to the list if it 
      if (Math.abs(mDuration.asMilliseconds()) <= mLimit) {
        filter.push(currPost);
      }
    });

    // Sort the list in ascending order by views
    var filter = _.sortBy(filter, 'views').reverse();

    // Set current
    current = 'hot';
  } else if (_filter_type === 'ending_soon') {
    // Return a list of posts filter by the end date that is closest to today's date within 3 days
    var mLimit = moment.duration(3, 'days').asMilliseconds();

    // Loop through all the post
    _POST.post.forEach(function (currPost) {
      var mCurrEndDate = new moment(moment(currPost.end_date, "MMM Do, YYYY").toDate());
      var mDuration = moment.duration(mCurrEndDate.diff(mToday));

      // Add the post to the list if it 
      if (Math.abs(mDuration.asMilliseconds()) <= mLimit) {
        filter.push(currPost);
      }
    });

    // Sort the list in ascending order
    var filter = _.sortBy(filter, function (post) {
      var mTempEndDate = moment(post.end_date, "MMM Do, YYYY").toDate();
      return moment(mTempEndDate).format('x');
    });

    // Set current
    current = 'ending_soon';
  } else if (_filter_type === 'discount') {
    // Filter all posts by type 'Discount'
    filter = _.where(_POST.post, { type: 'Discount' });

    // Set current
    current = 'discount';
  } else if (_filter_type === 'free') {
    // Filter all posts by type 'Freebies'
    filter = _.where(_POST.post, { type: 'Freebies' });

    // Set current
    current = 'free';
  }

  // Render page
  res.render('post_list', {
    post: filter,
    code: _ERROR_MSG.filter,
    current: current
  });
});

// Runs cron job every day at 00:00
// Cleans out old post where end dates are before todays date
cron.schedule("0 0 * * *", function () {
  var mToday = new moment(new Date());
  var result = [];

  // Loop through all the post
  _POST.post.forEach(function (currPost) {
    var mCurrEndDate = new moment(moment(currPost.end_date, "MMM Do, YYYY").toDate());
    var mDuration = moment.duration(mCurrEndDate.diff(mToday));

    if (mDuration < 0) {
      result.push(currPost);
    }
  });

  _POST.post = result;
  dataUtil.savePostData(_POST);
});

// Render 404 on all failed link
app.use(function (req, res) {
  res.status(404).render('404');
});

// Added Heroku ports
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening!');
});