const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My Practice Page</title></head>');
    res.write('<body><h1>Hello, this is my practice NodeJS page!</h1></body>');
    res.write('<body><label for="username">Username:</label>');
    res.write(
      '<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/users') {
    res.write('<html>');
    res.write('<head><title>List of Users</title></head>');
    res.write('<body><ul><li>User 1</li><li>User 2</li><li>User 3</li></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const user = parsedBody.split('=')[1];
      fs.writeFile('user.txt', user, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
});

server.listen(3000);
