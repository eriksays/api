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
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

//define the 'note' model
const Note = mongoose.model('Note', noteSchema);

//export the module
module.exports = Note;