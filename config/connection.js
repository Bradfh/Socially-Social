const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://bradfh:brad@cluster1.ieklju5.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});


module.exports = mongoose.connection;
