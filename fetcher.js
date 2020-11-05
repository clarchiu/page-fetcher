const request = require('request');
const fs = require('fs');
const readline = require('readline');

const url = process.argv[2] || '';
const path = process.argv[3] || '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const start = function(url, path) {
  if (fs.existsSync(path)) {
    rl.question('file exists at path. overwrite? (Y) ', (answer) => {
      if (answer.toUpperCase() !== 'Y') {
        console.log('process will exit');
        process.exit();
      }
      readFileFromURL(url, path);
    });
  } else {
    readFileFromURL(url, path);
  }
}

const readFileFromURL = function(url, path) {
  if (!url) {
    console.log('please enter url and path as arguments');
    return;
  } 

  request(url, (error, response, body) => {
    if (error) {
      console.log('invalid url');
      return;
    }
    if (response.statusCode !== 200) {
      console.log('error. response status: ' + response.statusCode);
      return;
    }
    fs.writeFile(path, body, (err) => {
      if (err) return console.log('error writing file');
      const fileSizeInBytes = fs.statSync(path)['size'];
      console.log('Downloaded and saved ' + fileSizeInBytes + ' bytes to ' + path);
      rl.close();
    })
  });
}

start(url, path);