const {Transform} = require('stream');
const os = require('os');

class LineSplitStream extends Transform {
  constructor(options) {
    super(options);

    this.setEncoding(options.defaultEncoding);
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString();
    const EOLBuffer = Buffer.from(os.EOL);
    const EOLIndex = Buffer.compare(chunk, EOLBuffer);

    for (let i = 0; i < chunkString.length; i++) {
      if (i === EOLIndex) {
        if (EOLBuffer.length === 2) {
          i++;
        }

        this._flushBuffer(callback);
      } else {
        this.buffer += chunkString[i];

        if (chunkString.length === 1) {
          callback(null);
        }
      }
    }
  }

  _flush(callback) {
    callback(null, this.buffer);
  }

  _flushBuffer(callback) {
    callback(null, this.buffer);

    this.buffer = '';
  }
}

module.exports = LineSplitStream;
