var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  task: {
    type: String,
    required: true,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  },
  doneAt: {
    type: Number,
    default: null
  }
});

module.exports = Todo;
