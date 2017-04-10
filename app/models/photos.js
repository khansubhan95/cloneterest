var mongoose = require('mongoose')

var photoSchema = new mongoose.Schema({
	url: String,
	description: String,
	userId: String,
	userName: String
})

module.exports = photoSchema