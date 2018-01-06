const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  task: {
    type: String,
    required: [true, 'A task is required'],
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  },
  doneAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = Todo;
