const { odd, even } = require('./commonJs');
//import { odd, even } from './commonJs';

function checkOddEven(num) {
    if (num % 2) {
        return odd;
    } else {
        return even;
    }
}
console.log(checkOddEven(11))
console.log(checkOddEven(12))