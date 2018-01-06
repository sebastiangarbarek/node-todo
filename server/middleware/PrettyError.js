function PrettyError(name, code, message) {
  this.errorName = name;
  this.errorCode = code;
  this.errorMessage = message;
}

module.exports = PrettyError;
