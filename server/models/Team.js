const mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
  _admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
  members: [{
    _member: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }],
  todos: [{
    _todo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }]
});

var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
