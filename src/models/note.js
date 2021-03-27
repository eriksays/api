//require the mongoose library
const mongoose = require('mongoose');

//define the database schema
const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        favoriteCount: {
            type: Number,
            default: 0,
        },
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
);

//define the 'note' model
const Note = mongoose.model('Note', noteSchema);

//export the module
module.exports = Note;