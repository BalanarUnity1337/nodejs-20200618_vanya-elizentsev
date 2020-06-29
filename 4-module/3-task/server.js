const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (req.method === 'DELETE') {
    const paths = pathname.split('/');

    if (paths.length > 1) {
      res.statusCode = 400;
      res.end('Вложенные пути не поддерживаются');
    } else {
      const filepath = path.join(__dirname, 'files', pathname);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);

        res.statusCode = 200;
        res.end('Файл успешно удален');
      } else {
        res.statusCode = 404;
        res.end('Такого файла не существует');
      }
    }
  } else {
    res.statusCode = 501;
    res.end('Not implemented');
  }
});

module.exports = server;
