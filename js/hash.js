const crypto = require('node:crypto');
//단방향 암호화
console.log('base64', crypto.createHash('sha256').update('alice').digest('base64'))
//양방향 (암호화)
const algorithm = 'abc-256';
const key = 'aaaadaseeebdadf112dsf';
const iv = '2265513512';

const cipher = crypto.createCipheriv(algorithm, key, iv);
let result = cipher.update('사용자 지정 암호', 'utf8', 'base64');
console.log(result);