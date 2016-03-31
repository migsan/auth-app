
var mongoose = require('mongoose');
var User = mongoose.model('User');
// Estrategia de autenticación con Twitter
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;

// Api keys are in here
var config = require('./config');

// Exportamos como módulo las funciones de passport, de manera que
// podamos utilizarlas en otras partes de la aplicación.
// De esta manera, mantenemos el código separado en varios archivos
// logrando que sea más manejable.
module.exports = function(passport) {

	console.log(config);

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserializa el objeto usuario almacenado en la sesión para
	// poder utilizarlo
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	// Configuración del autenticado con Twitter
	passport.use(new TwitterStrategy({
		consumerKey: config.twitter.key,
		consumerSecret: config.twitter.secret,
		callbackURL: '/auth/twitter/callback'
	}, function(accessToken, refreshToken, profile, done) {
		// Busca en la base de datos si el usuario ya se autenticó en otro
		// momento y ya está almacenado en ella
		User.findOne({ provider_id: profile.id }, function(err, user) {
			if(err) throw(err);
			// Si existe en la Base de Datos, lo devuelve
			if(!err && user!= null) return done(null, user);

			// Si no existe crea un nuevo objecto usuario
			var user = new User({
				provider_id	: profile.id,
				provider: profile.provider,
				name: profile.displayName,
				photo: profile.photos[0].value
			});
			//...y lo almacena en la base de datos
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));

	passport.use(new GoogleStrategy({
		clientID: config.google.client_id,
		clientSecret: config.google.secret,
		callbackURL: '/auth/google/callback'
	}, function(token, tokenSecret, profile, done) {
		User.findOne({ googleId: profile.id }, function(err, user) {
			if ( err ) {
				throw(err);
			}
			if ( !err && user!=null ) {
				return done(null, user);
			}

			var user = new User({
				provider_id: profile.id,
				provider: profile.provider,
				name: profile.displayName,
				photo: profile.photos[0].value
			});

			user.save(function(err) {
				if ( err ) {
					throw(err);
				}

				done(null, user);
			});
		});
	}));

};
