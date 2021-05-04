import { createServer } from 'http';

const server = createServer((req, res) => {
    if (req.url === '/') {
        res.write('Hello, World!');
        res.end();
    }

    if (req.url === '/api/books') {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});

server.listen(3000);

console.log('Listening port 3000...');
