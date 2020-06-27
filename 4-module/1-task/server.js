const url = require('url');
const http = require('http');
const path = require('path');
const {createReadStream} = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (req.method === 'GET') {
    const paths = pathname.split('/');

    if (paths.length > 1) {
      res.statusCode = 400;
      res.end('400');
    } else {
      const filepath = path.join(__dirname, 'files', pathname);
      const readStream = createReadStream(filepath);

      readStream.once('error', () => {
        res.statusCode = 404;
        res.end('404');
      });

      let file = '';

      const onData = (chunk) => {
        file += chunk.toString();
      };

      readStream.on('data', onData);

      readStream.once('close', () => {
        res.statusCode = 200;
        res.end(file);
      });
    }
  } else {
    res.statusCode = 501;
    res.end('Not implemented');
  }
});

module.exports = server;
