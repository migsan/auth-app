
// Rutas de la aplicación

exports.index = function(req, res){
  res.render('index', {
    // sending user information and jade locals
    title: 'Ejemplo de Passport JS',
    user: req.user
  });
};
