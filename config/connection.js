const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://bradfh:brad@cluster1.ieklju5.mongodb.net/");

module.exports = mongoose.connection;
