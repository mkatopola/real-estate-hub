const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  githubId: {
    type: String,
    required: true,
    unique: true 
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  profilePicture: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
