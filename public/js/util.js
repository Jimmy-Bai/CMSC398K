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

// An object containing error messages
var error_msg = {
  "dateEndBeforeStart": "Error! The end date you enter is before the start date!",
  "dateEndBeforeToday": "Error! The end date you enter is before today's date!",
  "noLocation": "Error! The location you enter does not exist!"
};

// Date picker function
$(function () {
  $(".datepicker").datepicker();
});

// Autocomplete attaching to modal
$(function () {
  $("#autocomplete-modal").autocomplete({
    source: function (request, response) {
      var limit = $.ui.autocomplete.filter(restaurant_array, request.term);
      response(limit.slice(0, 10));
    },
    response: function(event, ui) {
      // If no result match, display "No results found!"
      if (ui.content.length === 0) {
        $("#no-match").text("No results found!");
        $("#no-match").removeAttr('hidden');

      }else {
        $("#no-match").empty();
        $("#no-match").attr('hidden', true);
      }
    },
    appendTo: ".modal"
  });
});

// Autocomplete attaching to search bar
$(function () {
  $("#autocomplete-nav").autocomplete({
    source: function (request, response) {
      var limit = $.ui.autocomplete.filter(restaurant_array, request.term);
      response(limit.slice(0, 10));
    }
  });
});

// Get location from search name and look for the restaurant code
// Then call the search url
$(document).ready(function () {
  $('#search-button').click(function () {
    var searchTerm = $('#autocomplete-nav').val();
    var encode = encodeURI(searchTerm);
    console.log(encode);

    // Sent to app
    $.get('/search/' + encode);
    window.location.href = '/search/' + encode;
  });
});

// Validate form before submitting
// If form is validated, sent to server and redirect
// Else, reject form
function validateForm() {
  var _form = document.forms["add_post"];

  // Check date
  // End date cannot be less then start date
  // End date cannot be less then today's date
  var mStartDate = new moment(moment(_form.elements["start_date"].value, "MM/DD/YYYY").toDate());
  var mEndDate = new moment(moment(_form.elements["end_date"].value, "MM/DD/YYYY").toDate());
  var mToday = new moment(new Date());
  var mEndStartDur = moment.duration(mEndDate.diff(mStartDate)).asMilliseconds();
  var mEndTodayDur = moment.duration(mEndDate.diff(mToday)).asMilliseconds();

  // Check location
  var locationMatched = $('#no-match').text();

  // Check if end date is before start date 
  if (mEndStartDur < 0) {
    createToast("dateEndBeforeStart");
    return false;
  }

  // Check if end date is before today's date
  if (mEndTodayDur < 0) {
    createToast("dateEndBeforeToday");
    return false;
  }

  // Check if location exist
  if (locationMatched != "") {
    createToast("noLocation");
    return false;
  }

  return true;
}

// Given a message, create toast and append to toast container
function createToast(msgCode) {
  // Create a random ID
  var id = Date.now();

  // Create toast
  var toastBody = '<div class="toast-body">' + error_msg[msgCode] + '</div>';
  var closeIcon = '<i class="fas fa-times close-icon" aria-hidden="true"></i>';
  var button = '<button type="button" class="mx-2 my-1 close" data-dismiss="toast" aria-label="Close">' + closeIcon + '</button>';
  var toast = '<div id="' + id + '" class="toast ml-auto w-25" role="alert" data-delay="2500" data-autohide="true">' + button + toastBody + '</div>';

  // Append
  $(toast).appendTo("#container-toast");
  $("#" + id).toast('show');

  // Remove div after toast is hidden
  $("#" + id).on('hidden.bs.toast', function (e) {
    e.preventDefault();
    $("#" + id).remove();
  });
}







