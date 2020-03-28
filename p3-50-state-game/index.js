// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
var states = ['Idaho', 'South Dakota', 'Hawaii', 'Alaska', 'Alabama', 'New York'];

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
  'Alabama': '01',
  'Alaska': '02',
  'Arizona': '04',
  'Arkansas': '05',
  'California': '06',
  'Colorado': '08',
  'Connecticut': '09',
  'Delaware': '10',
  'District of Columbia': '11',
  'Florida': '12',
  'Georgia': '13',
  'Hawaii': '15',
  'Idaho': '16',
  'Illinois': '17',
  'Indiana': '18',
  'Iowa': '19',
  'Kansas': '20',
  'Kentucky': '21',
  'Louisiana': '22',
  'Maine': '23',
  'Maryland': '24',
  'Massachusetts': '25',
  'Michigan': '26',
  'Minnesota': '27',
  'Mississippi': '28',
  'Missouri': '29',
  'Montana': '30',
  'Nebraska': '31',
  'Nevada': '32',
  'New Hampshire': '33',
  'New Jersey': '34',
  'New Mexico': '35',
  'New York': '36',
  'North Carolina': '37',
  'North Dakota': '38',
  'Ohio': '39',
  'Oklahoma': '40',
  'Oregon': '41',
  'Pennsylvania': '42',
  'Rhode Island': '44',
  'South Carolina': '45',
  'South Dakota': '46',
  'Tennessee': '47',
  'Texas': '48',
  'Utah': '49',
  'Vermont': '50',
  'Virginia': '51',
  'Washington': '53',
  'West Virginia': '54',
  'Wisconsin': '55',
  'Wyoming': '56',
}

// Global variable
var score = 0;
var win = false;
var correctAnswer = [];
var numberData = {};

// Start function
function start() {
  // Get number of Spanish speakers
  getSpanishSpeakersCount();

  // Disable start div and enable game div
  // Clear and reset input box
  $('#initial').hide();
  $('#start').show();
  $('#info').show();
  $('#input-box').prop('disabled', false);
  $('#input-box').val('');

  // Set and start countdown
  $('.main-text').html('20');

  var timer = setInterval(function() {
    var currentCount = $('.main-text').html();

    if (currentCount > 0) {
      $('.main-text').html(currentCount - 1);
      $(checkInput());

      if (score == Object.keys(abvMap).length) {
        clearInterval(timer);
        $('#input-box').prop('disabled', true);
        end();
      }
    }else {
      clearInterval(timer);
      $('#input-box').prop('disabled', true);
      end();
    }
  }, 1000);

  // Display info on hover
  $(document).on('mouseover', '.answer', function() {
      var info = 'State: ' + $(this).html() + ' Number of Spanish Speakers: ' + numberData[$(this).html()];
      $('#info-display').append('<h1 id="state-number">' + info + '</h1');
  }).on('mouseout', '.answer', function() {
      $('#state-number').remove();
  });
}

// Display result screen
function end() {
  $('#game-box').hide();
  $('#result').show(); 

  if (score == Object.keys(abvMap).length) {
    $('.main-text').html('You Won!');
  }else {
    $('.main-text').html('You Lost!');
    $('#result').append('<p style="font-size: 30px;">Score: ' + score + '</p>');
    $('#result').append('<p style="font-size: 20px">Answers You Missed</p>');
    $('#result').append('<div id="wrong-answer"></div>');

    for (var key in abvMap) {
      if (!correctAnswer.includes(key)) {
        $('#wrong-answer').append('<p class="answer">' + key + '</p>');
      }
    }
  }
}

// Check input 
function checkInput() {
  $('#input-box').on('input', function() {
    var answer = this.value;

    if (answer in abvMap) {
      if (!correctAnswer.includes(answer)) {
        $('#input-box').css({'background-color' : '#B4EEB4'});
        $('#input-box').val('');

        // Add to list of correct answers
        correctAnswer.push(answer);
        $('#correct-answer').append('<p class="answer">' + answer + '</p>');

        // Update score
        score++;
        $('#score').html('Score: ' + score);
        console.log(correctAnswer);
      }
    }else {
      $('#input-box').css({'background-color' : '#F9848A'});
    }
  });
}

// Get number of Spanish speakers from api
function getSpanishSpeakersCount() {
  var url = 'https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:*&LAN=625';

  $.get(url, function(data) {
    for (var i = 1; i < data.length; i++) {
      numberData[data[i][2]] = data[i][0];
    }
  });
}