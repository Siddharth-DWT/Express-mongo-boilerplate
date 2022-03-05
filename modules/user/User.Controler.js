const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = require("./User.Model");
const { successResponse, errorResponse, serverErrorResponse, capitalizeAllFirst } = require("../../common/Utils");

exports.register = async (req, res) => {
  const { email, password, name, userType, gender, age, phone } = req.body;
  // add validation of incoming data
  // add autocapitalize to name
  UserModel.find({ email: email })
    .exec()
    .then((user) => {
      user.length && errorResponse(res, null, "User already exist", 409);
      bcrypt.hash(password, 10, (error, hash) => {
        error && serverErrorResponse(res, error);
        const user = new UserModel({
          _id: new mongoose.Types.ObjectId(),
          name: capitalizeAllFirst(name),
          email: email,
          userType: userType,
          gender: gender,
          age: age,
          phone: phone,
          password: hash,
        });
        user
          .save()
          .then((result) => {
            successResponse(res, { user: result }, "User has been created successfully", 201);
          })
          .catch((err) => {
            err.name === "ValidationError" && errorResponse(res, err, err.message, 400);
            serverErrorResponse(res, err);
          });
      });
    });
};

exports.list = async (req, res) => {
  UserModel.find()
    .then((result) => {
      res.status(200).json({
        userData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.signup = async (req, res) => {
  UserModel.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err,
            });
          } else {
            const user = new UserModel({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              userType: req.body.userType,
              gender: req.body.gender,
              age: req.body.age,
              phone: req.body.phone,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(200).json({
                  success: true,
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(500).json({
      message: "User invaild",
    });
  }
  const secret = "this is dummy text";
  const payload = {
    email: user.email,
    id: user._id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });

  user.updateOne({ resetLink: token });
  return res.status(200).json({ success: true, message: "password reset link sent to your email account" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(500).json({
      success: false,
      email: "Email invaild000000",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(501).json({
      success: false,
      password: "Password invaild",
    });
  }
  const token = jwt.sign(
    {
      _id: user._id,
      userType: user.userType,
      email: user.email,
      name: user.name,
    },
    "this is dummy text",
    {
      expiresIn: "24h",
    }
  );
  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      userType: user.userType,
      token,
    },
  });
};

exports.changePasswordById = async (req, res) => {
  const { password, password2 } = req.body;
  if (!password) {
    errorResponse(res, null, "password is not given", 400);
  }
  if (!password2) {
    errorResponse(res, null, "password is not given", 400);
  }
  if (password2 !== password) {
    errorResponse(res, null, "passwords do not match", 400);
  }
  const salt = await bcrypt.genSalt(12);
  if (salt) {
    const hash = await bcrypt.hash(password, salt);
    const result = await UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: { password: hash } });
    successResponse(res, result, "Password is successfully changed", 200);
  } else {
    errorResponse(res, null, "Unexpected error. Try again");
  }
};

exports.resetPasswordById = async (req, res) => {
  const { password1, password2 } = req.body;
  if (!password1 || !password2 || password2 != password1) {
    res.send("Passwords Don't Match !");
  } else {
    var salt = await bcrypt.genSalt(12);
    if (salt) {
      var hash = await bcrypt.hash(password1, salt);
      await UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: { password: hash } });
      res.status(200).json({ success: true, message: "password update sucesss" });
    } else {
      res.render("Unexpected Error Try Again");
    }
  }
};

exports.updateById = (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        userType: req.body.userType,
        gender: req.body.gender,
        age: req.body.age,
        phone: req.body.phone,
      },
    }
  )
    .then(() => {
      res.status(200).json({
        message: "User Updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.getById = (req, res) => {
  UserModel.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteById = (req, res) => {
  UserModel.remove({ _id: req.params.id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
