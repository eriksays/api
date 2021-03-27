const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError,
}= require ('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');
const { serializeUser } = require('passport');

module.exports = {
    newNote: async (parent, args, { models, user }) => {
        if (!user) {
            throw new Error("you must be signed in");
        }
        return await models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id),
        });
    },
    updateNote: async (parent, { content, id}, { models, user }) => {
        if (!user) {
            throw new AuthenticationError("you must be signed in to perform this action");
        }
        const note = await models.Note.findById(id);
        if (note && String(note.author) !== user.id) {
            throw new AuthenticationError("you do not have permissions");
        }
        return await models.Note.findOneAndUpdate(
            {
                _id: id, 
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
        
        
    },
    deleteNote: async (parent, { id }, {models, user}) => {
        if (!user) {
            throw new AuthenticationError("you must be signed in to perform this action");
        }
        const note = await models.Note.findById(id);
        if (note && String(note.author) !== user.id) {
            throw new AuthenticationError("you do not have permissions");
        }
        try {
            await note.remove();
            console.log(`deleted :${id}`)
            return true;
        } catch(err) {
            console.log(`could not delete :${id}`)
            return false;
        }
        
    },
    toggleFavorite: async (parent, {id}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError("you must be signed in to perform this action");
        }
        let noteCheck = await models.Note.findById(id);
        console.log('here is note')
        console.log(noteCheck);
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);
        
        if(hasUser >= 0) {
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    new: true
                }
            )
        } else {
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    new: true
                }
            )
        }
    },
    signUp: async ( parent, { username, email, password }, { models }) => {
        email = email.trim().toLowerCase();
        const hashed = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });

            return jwt.sign( 
                {
                    id: user._id 
                },
                process.env.JWT_SECRET
            );
        } catch (err) {
            console.log(err)
            throw new Error('Error creating account');
        }

    },
    signIn: async ( parent, { username, email, password }, { models }) => {
        if (email) {
            email = email.trim().toLowerCase();
        }

        const user = await models.User.findOne({
            $or: [{ email }, {username}]
        });

        if (!user) {
            throw new Error('Error signing in'); 
        }

        const valid = bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Error validating password'); 
        }

        
        return jwt.sign( 
            {
                id: user._id 
            },
            process.env.JWT_SECRET
        );

    }
}
