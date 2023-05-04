const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/google_book_search', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = mongoose.connection;
