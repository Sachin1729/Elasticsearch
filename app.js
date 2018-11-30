const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const Book = require('./models/book');
const app = express();

mongoose.connect('mongodb://127.0.0.1/Elasticsearch',{ useNewUrlParser: true })
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});


Book.createMapping(function (err, mapping) {
    if (err) {
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    } else {
        console.log('mapping created!');
        console.log(mapping);
    }
});

var stream = Book.synchronize();
var count = 0;

stream.on('data',function(){
    count++;
});

stream.on('close',function(){
    console.log('Indexed ',count,' docs')
});

stream.on('error',function(err){
    console.log(err);
});