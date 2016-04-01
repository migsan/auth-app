var mongoose = require('mongoose');
var boxSchema = require('./models/boxes');

var Block = mongoose.model('Block', boxSchema);

module.exports = {
    postData: function(data, callback) {
        console.log('----- inside db_handler postData');
        console.log(data);

        var block = new Block({
            columns: data.columns,
            name: data.name,
            boxes: data.boxes
        });

        block.save(function(err) {
            if ( err ) {
                throw err;
            }
            callback(null, block);
        })
    }
}
