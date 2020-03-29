var fs = require('fs');

// Given a json file, return the data
function loadData(jsonFile) {
    return JSON.parse(fs.readFileSync(jsonFile));
}

// Given new data, save it to post.json
function savePostData(data) {
	var obj = {
		post: data
	};

	fs.writeFileSync('./data/post.json', JSON.stringify(obj));
}

module.exports = {
    loadData: loadData,
    savePostData: savePostData,
}