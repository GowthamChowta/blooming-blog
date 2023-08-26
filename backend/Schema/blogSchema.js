const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: Date,
  isActive: Boolean,
  content: String
});

module.exports = mongoose.model('blogs', blogSchema);
