const mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
  _admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
  name: {
    type: String,
    required: [true, 'A team name is required']
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
