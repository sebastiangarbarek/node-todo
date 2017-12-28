var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, '').toString();
  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

var User = mongoose.model('User', userSchema);

module.export = User;
