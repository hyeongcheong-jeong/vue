import dns from 'dns/promises';

const ip = await dns.lookup('gilbut.co.kr');
console.log(ip);