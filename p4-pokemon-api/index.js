var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Main url
app.get("/", function(req, res) {
    var contents = "";

    // List each pokemon name and link it to their page
    _.each(_DATA, function(pokemon) {
        contents += `<tr><td></td><td><a href="/pokemon/${pokemon.id}">${pokemon.name}</a></td></tr>\n`;
    });

    var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

// Given a pokemon ID, return all the information for that pokemon
app.get("/pokemon/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var pokemonData = _.findWhere(_DATA, {id: _id});
    var contents = "";

    // For each key and value, list the key then value
    _.each(pokemonData, function(val, key) {
        contents += `<tr><td>${key}</td><td>${JSON.stringify(val)}</td></tr>\n`;
    });

    var html = `<html>\n<body>\n<table>${contents}</table>\n</body>\n</html>`;
    res.send(html);
});

// Given a pokemon ID, return the image link
app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var pokemonData = _.findWhere(_DATA, {id: _id});
    var html = `<html>\n<body>\n<img src="${pokemonData.img}">\n</body>\n</html>`;
    res.send(html);
});

// Given a pokemon ID, return a json
app.get("/api/id/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, {id: _id});
    if (!result) return res.json({});
    res.json(result);
});

// Given a pokemon name, return an array of evolution for that pokemon
app.get("/api/evochain/:pokemon_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var pokemonData = _.findWhere(_DATA, {name: _name});
    var evochain = [];

    // Check if pokemon exist, return empty array if it does not exist
    if (!pokemonData) {
        res.send(evochain);
    }else {
        evochain.push(_name);

        if ('prev_evolution' in pokemonData) {
            _.each(pokemonData.prev_evolution, function(evolution) {
                evochain.push(evolution.name);
            });
        }

        if ('next_evolution' in pokemonData) {
            _.each(pokemonData.next_evolution, function(evolution) {
                evochain.push(evolution.name);
            });
        }

        res.send(evochain.sort());
    }
});

// Given a type, list all of the pokemon of that type
app.get("/api/type/:type", function(req, res) {
    var _type = req.params.type;
    var pokemonWithType = [];

    // Get all pokemon that matches that type
    _.each(_DATA, function(pokemon) {
        if (pokemon.type.includes(_type)) {
            pokemonWithType.push(pokemon.name);
        }
    });

    res.send(pokemonWithType);
});

// Given a type, list the pokemon that is the heaviest in that type
app.get("/api/type/:type/heaviest", function(req, res) {
    var _type = req.params.type;
    var pokemonWithTypeWeight = [];

    // Get all pokemon and their weight that matches that type
    _.each(_DATA, function(pokemon) {
        if (pokemon.type.includes(_type)) {
            var pokemonWeight = {};
            var weight = parseFloat(pokemon.weight.match(/(\d+\.\d+)\skg/));

            pokemonWeight['name'] = pokemon.name;
            pokemonWeight['weight'] = weight;

            pokemonWithTypeWeight.push(pokemonWeight);
        }
    });

    if (pokemonWithTypeWeight.length == 0) {
        res.send({});
    }else {
        var sorted = _.sortBy(pokemonWithTypeWeight, 'weight').reverse();
        res.send(sorted[0]);
    }
});

// Given a pokemon name and weakness, add that weakness to that pokemon
app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var _weakness = req.params.weakness_name;
    var pokemon = _.findWhere(_DATA, {name: _name});
    var pokemonWeakness = {};

    if (pokemon) {
        var weaknessArray = pokemon.weaknesses;

        // Update weaknesses array if there is no repeat
        if (!weaknessArray.includes(_weakness)) {
            weaknessArray.push(_weakness);
        }

        pokemonWeakness['name'] = pokemon.name;
        pokemonWeakness['weaknesses'] = weaknessArray;

        // Save changes to poke.json
        pokeDataUtil.saveData(_DATA);
    }
    
    res.send(pokemonWeakness);
});

// Given a pokemon name and weakness, remove that weakness from the pokemon
app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var _weakness = req.params.weakness_name;
    var pokemon = _.findWhere(_DATA, {name: _name});
    var pokemonWeakness = {};

    if (pokemon) {
        var weaknessArray = pokemon.weaknesses;
        var filterArray;

        // Delete weakness from weakness array if it exists
        if (weaknessArray.includes(_weakness)) {
            weaknessArray = weaknessArray.filter(weakness => weakness != _weakness);
            pokemon.weaknesses = weaknessArray;
        }

        pokemonWeakness['name'] = pokemon.name;
        pokemonWeakness['weaknesses'] = weaknessArray;

        // Save changes to poke.json
        pokeDataUtil.saveData(_DATA);
    }
    
    res.send(pokemonWeakness);
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
