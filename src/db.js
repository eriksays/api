const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);

        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        //connect to the db
        mongoose.set(DB_HOST);
        //log an error
        mongoose.connect.on('error', err => {
            console.log(err)
            console.log(
                'mongodo connection error. please make sure mongodb is running'
            );
            process.exit();
        })
    },

    close: () => {
        mongoose.connection.close();
    }
}