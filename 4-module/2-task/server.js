const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  if (req.method === 'POST') {
    const pathname = url.parse(req.url).pathname.slice(1);
    const paths = pathname.split('/');

    if (paths.length > 1) {
      res.statusCode = 400;
      res.end('400');
    } else {
      const filepath = path.join(__dirname, 'files', pathname);

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('409');
      } else {
        const limitStream = new LimitSizeStream({limit: 2 ** 20});
        const writeStream = fs.createWriteStream(filepath);

        req.once('close', () => {
          if (res.finished) {
            return;
          }

          fs.unlinkSync(filepath);

          writeStream.destroy();
          limitStream.destroy();
        });

        limitStream.once('error', (err) => {
          if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('413');
          } else {
            res.statusCode = 500;
            res.end('500');
          }

          fs.unlinkSync(filepath);

          writeStream.destroy();
          limitStream.destroy();
        });

        writeStream.once('close', () => {
          res.statusCode = 201;
          res.end();
        });

        req.pipe(limitStream).pipe(writeStream);
      }
    }
  } else {
    res.statusCode = 501;
    res.end('Not implemented');
  }
});

module.exports = server;
