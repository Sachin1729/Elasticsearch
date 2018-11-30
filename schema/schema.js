const graphql = require('graphql');
const Book = require('../models/book');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        type: { type: GraphQLString },
        description: { type: GraphQLString },
        author: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        searchBook: {
            type: new GraphQLList(BookType),
            args: {
                keyword: { type: GraphQLString }
            },
            async resolve(root, params) {
                var books = await new Promise(function (resolve, reject) {
                    Book.search(
                        { query_string: { query: params.keyword } }, { hydrate: true }, function (err, results) {
                            console.log(results);
                            if (results != undefined) {
                                resolve(results.hits.hits);
                            }
                            else {
                                resolve(err)
                            }
                        });
                });

                if (!books) {
                    throw new Error('Error getting books')
                }
                return books;
            }

        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                type: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                author: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let book = new Book({
                    title: args.title,
                    type: args.type,
                    description: args.description,
                    author: args.author
                });
                return book.save();
            }
        }
    }
});









module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});