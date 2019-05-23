var mongoose = require('mongoose')
var TwitterStrategy = require('passport-twitter').Strategy
var configAuth = require('./auth')
var userSchema = require('../models/users')
var User = mongoose.model('User', userSchema)

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		done(null, user.id)
	})

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user)
		})
	})

	passport.use(new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL,
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function(){
			User.findOne({'twitter.id':profile.id}, function(err, user){
				console.log('reached here');
				if (err) return done(err)

				if (user) return done(null, user)

				else {
					var newUser = new User()
					console.log(profile);
					newUser.twitter.id = profile.id
					newUser.twitter.userName = profile.username
					newUser.twitter.displayName = profile.displayName
					newUser.twitter.profilePicture = profile.photos[0].value

					newUser.save(function(err) {
						if (err) console.log(err);
						return done(null, newUser)
					})
				}
			})
		})
	}
	))
}