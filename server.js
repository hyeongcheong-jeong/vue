const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {}

http.createServer(async (req, res) => {
    try {
        console.log(req);
        console.log(req.method);
        const data = await fs.readFile('./index.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        return res.end(data);
    } catch(err) {
        console.error(err);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(err.message);
    }
})
.listen(8080, () => {
    console.log('8080포트 대기중입니다.');
})