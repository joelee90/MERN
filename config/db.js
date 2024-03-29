const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('mongoDB connected');
    } catch (err) {
        console.log('err in db', err.message);
        process.exit(1);
        // exits process with failure
    }
};

module.exports = connectDB;
