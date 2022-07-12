const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require("mongoose");
const {loginPassword} = require("./dbData");
// const cors = require('cors')

const app = express();
const PORT = 3005;

// app.use(cors())

mongoose.connect(loginPassword, {useUnifiedTopology: true});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`))
dbConnection.once('open', err => console.log('Connected to DB'))

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
});