// index.js
// This is the main entry point of our application
require('dotenv').config();
const db = require('./db');

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');



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
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: String(notes.length +1),
                content: args.content,
                author: 'Adam Scott',
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};

const app = express()

const server = new ApolloServer( { typeDefs, resolvers })
server.applyMiddleware({app, path: '/api' })

const port = process.env.PORT || 4000
app.get('/', (req, res) => res.send('hello world, updated!'));

app.listen(port, () => console.log(`graphql listening on port localhost:${port}`))