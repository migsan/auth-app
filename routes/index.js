
// Rutas de la aplicación

exports.index = function(req, res){
  res.render('index', {
    // sending user information and jade locals
    title: 'Authentication app',
    user: req.user
  });
};
