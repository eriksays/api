// index.js
// This is the main entry point of our application
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');
const models = require('./models')
const typeDefs= require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            throw new Error('session invalid');
        }
    }
}




const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express()
db.connect(DB_HOST);

const server = new ApolloServer( { 
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization;
        console.log("here is token")
        console.log(token);
        const user = getUser(token);
        console.log("here is user")
        console.log(user);
        //return db models
        return { models, user };
    }

})
server.applyMiddleware({app, path: '/api' })

app.listen(port, () => console.log(`graphql listening on port localhost:${port}`))