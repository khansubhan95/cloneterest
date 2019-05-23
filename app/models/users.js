var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	twitter: {
		id: String,
		displayName: String,
		userName: String,
		profilePicture: String,
	}
})

module.exports = userSchema