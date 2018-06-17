const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

let fs = require('fs');
let reloadServer = 


fs.readFile('./index.html', (err, html) => {
    if (err) {
        throw err;
    }
    server = http.createServer((request, response) => {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    }).listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
});

fs.watch('./', (event, file) => {
    console.log('Event ----- ' + event + ' to ----- ' + file);
});

require('./js/lodash.js');
require('./js/mapeador.js');