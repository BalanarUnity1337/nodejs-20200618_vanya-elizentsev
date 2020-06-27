const {Transform} = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends Transform {
  constructor(options) {
    super(options);

    this.setEncoding(options.defaultEncoding);
    this._limit = options.limit;
    this._fullLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this._fullLength += chunk.toString().length;

    if (this._fullLength > this._limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
