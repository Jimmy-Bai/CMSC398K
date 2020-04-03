var moment = require('moment');

// Calulate the time difference and return that difference
function timeDifference (input) {
  // Calulate difference and convert to moment.duration()
  var currentTime = new Date();
  var postTime = new Date(input);
  var mDuration = moment.duration(Math.abs(currentTime - postTime));

  // Prettify output
  var months = (mDuration.months() != 0) ? (mDuration.months() + ' months ') : '';
  var days = (mDuration.days() != 0) ? (mDuration.days() + ' days ') : '';
  var hours = (mDuration.hours() != 0) ? (mDuration.hours() + ' hours ') : '';
  var minutes = (mDuration.minutes() > 3) ? (mDuration.minutes() + ' minutes ') : ' moments ';

  // Final output
  var result = ' - Posted ' + months + days + hours + minutes + 'ago';

  // Attach to span
  return result;
}

// Return 'active' if current page is the same as input
function isActive (input, current) {
  return (input === current) ? (' active') : ('');
}

// Check if current 
// Exporting Handlebars helper
module.exports = {
  timeDifference: timeDifference,
  isActive: isActive
}