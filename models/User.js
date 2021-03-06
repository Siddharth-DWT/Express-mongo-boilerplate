const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  userType: {
    type: String,
  },

  gender: {
    type: String,
    required: true,
  },

  age: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  resetLink: {
    type: String,
  },

  img: {
    contentType: String,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
