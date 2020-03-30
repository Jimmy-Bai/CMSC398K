var moment = require('moment');

var restaurant_array = [
  "Arby's",
  "Aroy Thai Restaurant",
  "Bagel Place",
  "Blaze Pizza",
  "Burger King",
  "C.B Chinese Grill",
  "Casey's Coffee",
  "CAVA",
  "Chick-fil-A",
  "Chipotle Mexican Grill",
  "Class 520",
  "Cluck U Chicken",
  "Cold Stone Creamery",
  "College Park Grill",
  "Cornerstone Grill & Loft",
  "cranberry lemonade",
  "Denny's",
  "Domino's Pizza",
  "Dunkin'",
  "Five Guys",
  "Food Factory",
  "Gongcha",
  "Hanami Japanese Restaurant",
  "Insomnia Cookies",
  "Ivy Noodles",
  "Jason's Deli",
  "Jimmy John's",
  "Jumbo Jumbo Cafe",
  "Kangnam BBQ",
  "King Kong Restaurant",
  "Krazi Burrito",
  "Krazi Kebob",
  "Kung Fu Tea",
  "Looney's Pub",
  "LOTSA Stone Fired Pizza",
  "Marathon Deli",
  "Marathon Deli",
  "Maryland Dairy",
  "McDonald's",
  "MilkBoy ArtHouse",
  "Moby Dick House of Kabob",
  "Nando's Peri-Peri",
  "Noodles and Company",
  "North Campus Diner",
  "Northwest Chinese Food",
  "NuVegan Cafe",
  "Old Maryland Grill",
  "Panda Express",
  "Papa John's Pizza",
  "Pho D'Lite",
  "Pho Thom",
  "Pizza Kingdom",
  "POH-YO Charcoal Chicken",
  "Popeyes Louisiana Kitchen",
  "Potbelly Sandwich Shop",
  "Qdoba",
  "QU JAPAN",
  "RJ Bentley's Restaurant",
  "Saburo Ramen Bar",
  "Saladworks",
  "Samovar",
  "Sbarro",
  "Seoul Spice",
  "Shanghai Cafe",
  "Shanghai Tokyo Cafe",
  "South Campus Diner",
  "Starbucks",
  "Subway",
  "Sushinado & Teriyaki",
  "sweetgreen",
  "taco Bell",
  "Taqueria Habanero",
  "Ten Ren's Tea Time",
  "Terrapin's Turf",
  "The Board and Brew",
  "The Common",
  "The Original ledo Restaurant",
  "The Red Boat Asian Fusion",
  "The Spot Mini",
  "Wasabi Bistro",
  "Wings Over",
  "Zhang's Noodles"
];

// Date picker function
$(function() {
  $(".datepicker").datepicker();
});

// Autocomplete attaching to modal
$(function() {
  $("#autocomplete-modal").autocomplete({
    source: function(request, response) {
      var limit = $.ui.autocomplete.filter(restaurant_array, request.term);
      response(limit.slice(0, 10));
    },
    appendTo: ".modal"
  });
});

// Autocomplete attaching to search bar
$(function() {
  $("#autocomplete-nav").autocomplete({
    source: function(request, response) {
      var limit = $.ui.autocomplete.filter(restaurant_array, request.term);
      response(limit.slice(0, 10));
    }
  });
});

// Calulate the time difference and return that difference
function timeDifference(input, uuid) {
  // Calulate difference and convert to moment.duration()
  var currentTime = new Date();
  var postTime = new Date(input);
  var mDuration = moment.duration(Math.abs(currentTime - postTime));

  // Prettify output
  var months = (mDuration.months() != 0) ? (mDuration.months() + ' months ') : '';
  var days = (mDuration.days() != 0) ? (mDuration.days() + ' days ') : '';
  var hours = (mDuration.hours() != 0) ? (mDuration.hours() + ' hours ') : '';
  var minutes = (mDuration.minutes() != 0) ? (mDuration.minutes() + ' minutes ') : '';

  // Final output
  var result = ' - Posted ' + months + days + hours + minutes + 'ago';

  // Attach to span
  $("#" + uuid).html(result);
}