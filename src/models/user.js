//require the mongoose library
const mongoose = require('mongoose');

//define the database schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

//define the 'note' model
const User = mongoose.model('User', userSchema);

//export the module
module.exports = User;