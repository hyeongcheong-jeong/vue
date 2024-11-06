const fs = require('fs');
fs.writeFile('./writeMe.txt', '글이 입력됩니다.', (err) => {
  if (err) {
    throw err;
  }
  fs.readFile('./writeMe.txt', (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data.toString());
  });
});