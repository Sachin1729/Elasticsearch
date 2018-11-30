var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title : {type : String, es_type: 'text' , es_indexed: true},
    type : {type : String, es_type: 'text' , es_indexed: true},
    description : String,
    author : String
});

bookSchema.plugin(mongoosastic, {
    hosts: [
      'localhost:9200'
    ]
});

module.exports = mongoose.model('Book', bookSchema);