// index.js
// This is the main entry point of our application
const models = require('./models')
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

require('dotenv').config();
const db = require('./db');

const DB_HOST = process.env.DB_HOST;

const typeDefs= gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    },
    type Mutation {
        newNote(content: String!): Note!
    }
    type Query {
        hello: String!
        notes: [Note!]!
        note(id: ID!): Note!
    },
`;

let notes = [
    {
        id: '1', content: 'this is a note', author: 'mike'
    },
    {
        id: '2', content: 'this is another note', author: 'steve'
    },
    {
        id: '3', content: 'this is one more note', author: 'alice'
    },
]

const resolvers = {
    Query: {
        hello: () => 'hello world',
        notes: async () => {
            return await models.Note.find();
        },
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                id: String(notes.length +1),
                content: args.content,
                author: 'Adam Scott',
            });
        }
    }
};

const app = express()
db.connect(DB_HOST);

const server = new ApolloServer( { typeDefs, resolvers })
server.applyMiddleware({app, path: '/api' })

const port = process.env.PORT || 4000
//app.get('/', (req, res) => res.send('hello world, updated!'));

app.listen(port, () => console.log(`graphql listening on port localhost:${port}`))