const mongoose = require("mongoose");

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
  },
  userType: {
    type: String,
    enum: { values: ["admin", "user"], message: "{VALUE} is not supported" },
  },
  gender: {
    type: String,
    enum: { values: ["male", "female"], message: "{VALUE} is not supported" },
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
    minlength: 6,
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
