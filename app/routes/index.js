var mongoose = require('mongoose')
var bodyParser = require('body-parser')

var photoSchema = require('../models/photos')
var Photo = mongoose.model('Photo', photoSchema)

var urlencodedParser = bodyParser.urlencoded({extended:false})

module.exports = function(app, passport) {
	app.get('/', function(req, res) {

		Photo.find({}, function(err, doc) {
			if (err) console.log(err);

			if(req.isAuthenticated()) {
				res.render('list', {symbol: twitterProfileImage(req.user.twitter.profilePicture), loggedIn: true, photos: doc})
			}
			var symbol = '<li class="twitter"><a href="/login" class="btn btn-block btn-social btn-twitter btn-lg"><i class="fa fa-twitter"></i>Sign in with Twitter</a></li>'
			res.render('list', {symbol: symbol, loggedIn: false, photos: doc})

		})
	})
	
	app.get('/mypics', isLoggedIn, function(req, res) {
		Photo.find({'userId': req.user.twitter.id}, function(err, doc) {
			if (err) console.log(err);

			res.render('mypics', {symbol: twitterProfileImage(req.user.twitter.profilePicture), loggedIn: true, photos: doc})
		})
	})

	app.get('/mypics/delete/:id', isLoggedIn, function(req, res) {
		var id = req.params.id
		Photo.findOne({_id: id}, function(err, doc) {
			if (err) console.log(err);

			else {
				if(req.user.twitter.id != doc.userId) {
					res.redirect('/')
				}

				else {
					Photo.remove({_id: id}, function(err, doc) {
						if(err) console.log(err);

						res.redirect('/mypics')
					})
				}
			}
			
		})
	})

	app.get('/mypics/new', isLoggedIn, function(req, res) {
		res.render('new', {symbol: twitterProfileImage(req.user.twitter.profilePicture)})
	})

	app.post('/mypics/new', isLoggedIn, urlencodedParser, function(req, res) {
		var url = req.body.url
		var description = req.body.description

		var newPhoto = new Photo
		newPhoto.url = url
		newPhoto.description = description
		newPhoto.userId = req.user.twitter.id
		newPhoto.userName = req.user.twitter.userName
		newPhoto.save(function(err, doc) {
			if (err) console.log(err);

			res.redirect('/mypics')
		})

	})

	app.get('/login', isNotLoggedIn, function(req, res) {
		console.log('reached here');
		res.redirect('/auth/twitter')
	})

	app.get('/logout', isLoggedIn, function(req, res) {
		req.logout()
		res.redirect('/')
	})

	app.get('/auth/twitter', passport.authenticate('twitter'))

	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect: '/',
		failureRedirect: '/login'
	}))

	app.use(function(req, res, next) {
		if (req.accepts('html')) {
			res.render('404', { url: req.url });
		}
	})
}

/**
 * Custom middleware, if user clicks on /logout while logged out redirect to /
 * @param  {req}   req  A request object
 * @param  {response}   res  A response object
 * @param  {Function} next The next statements to execute
 * @return {Function}       The next object
 */
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next()
	res.redirect('/')
}

/**
 * Custom middleware, if user clicks on /login while already logged in redirect to /
 * @param  {req}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {Boolean}       [description]
 */
function isNotLoggedIn (req, res, next) {
	if (!req.isAuthenticated())
		return next()
	res.redirect('/')
}

/**
 * Returns html element for twitter profile image
 * @param  {string} userName twitter username
 * @return {html string}          An html element string representing the twitter user profile image
 */
function twitterProfileImage(picUrl) {
	var pic = '<img src="' + picUrl + '" />'
	return pic
}