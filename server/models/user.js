var mongoose = require('mongoose');
var validator = require('validator');

var User = mongoose.model('User', {
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
  tokens = [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }];
});

module.export = User;
