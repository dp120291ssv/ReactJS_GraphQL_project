const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLBoolean } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');
const {GraphQLNonNull} = require("graphql");

/**
 * Mock data
 * */
// const movies = [
//     { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: 1 },
//     { id: '2', name: '1984', genre: 'Sci-Fi', directorId: 2 },
//     { id: 3, name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: 3 },
//     { id: "4", name: 'Snatch', genre: 'Crime-Comedy', directorId: "4" },
//     { id: '5', name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
//     { id: '6', name: "The Hateful Eight", genre: "Crime", directorId: "1" },
//     { id: '7', name: "Inglourious Basterds", genre: "Crime", directorId: "1" },
//     { id: '8', name: "Lock, Stock and Two Smoking Barrels", genre: "Crime-Comedy", directorId: "4" },
// ];
//
// const directors = [
//     { id: '1', name: 'Quentin Tarantino', age: 55 },
//     { id: '2', name: 'Michael Radford', age: 72 },
//     { id: '3', name: 'James McTeigue', age: 51 },
//     { id: '4', name: 'Guy Ritchie', age: 50 },
// ];


const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        rate: { type: GraphQLInt },
        watched: { type: GraphQLBoolean },
        director: {
            type: DirectorType,
            resolve(parent, args){
                // return directors.find(director => director.id == parent.directorId);
                return Directors.findById(parent.directorId);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId == parent.id);
                return Movies.find({ directorId: parent.id });
            },
        },
    }),
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { name, age }) {
                const director = new Directors({
                    name,
                    age,
                });
                return director.save();
            },
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
            },
            resolve(parent, { name, genre, directorId, watched, rate }) {
                const movie = new Movies({
                    name,
                    genre,
                    directorId,
                    watched,
                    rate,
                });
                return movie.save();
            },
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Directors.findByIdAndRemove(id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Movies.findByIdAndRemove(id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { id, name, age }) {
                return Directors.findByIdAndUpdate(
                    id,
                    { $set: { name, age } },
                    { new: true },
                );
            },
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
            },
            resolve(parent, { id, name, genre, directorId, watched, rate }) {
                return Movies.findByIdAndUpdate(
                    id,
                    { $set: { name, genre, directorId, watched, rate } },
                    { new: true },
                );
            },
        },
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id == args.id);
                return Movies.findById(args.id);
            },
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id == args.id);
                return Directors.findById(args.id);
            },
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies;
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors;
                return Directors.find({});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});