const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      isAsync: false,
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
}, {
  usePushEach: true
});

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';

  var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString();

  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.removeAuthToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

userSchema.statics.findByToken = function (token) {
  var decoded;

  try {
    decoded = jwt.verify(token, 'secret');
  } catch (err) {
    // Forces a catch in the caller.
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  return User.findOne({email}).then((user) => {
    if (!user) {
      // Forces a catch in the caller.
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) resolve(user); else reject();
      });
    });
  });
};

// Mongoose middleware called before the save function.
userSchema.pre('save', function (next) {
  var user = this;

  // Check to prevent hashing the hash.
  if (user.isModified('password')) {
    bcrypt.genSalt((err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Overridden method.
userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
