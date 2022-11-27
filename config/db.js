const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log(`MongoDB Connected:`.cyan.underline))
        .catch(err => console.error(err));        
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`.red.underline);
        process.exit(1);
    }
}

module.exports = {
    connectDB
}
