const fs = require('fs');
const path = require('path');

console.log('=== Asynchronous JavaScript Demo ===');

const filePath = path.join(__dirname, 'sample-files', 'sample.txt');

// 1. Callback Pattern
console.log('\n1. Using Callbacks:');
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Callback Error:', err);
    return;
  }
  console.log('Callback Result:', data);
});

/*
Callback Hell Example:
fs.readFile('file1.txt', (err, data1) => {
  if (err) throw err;
  fs.readFile('file2.txt', (err, data2) => {
    if (err) throw err;
    fs.readFile('file3.txt', (err, data3) => {
      if (err) throw err;
      // This nesting can go on and on, creating "callback hell"
      console.log(data1, data2, data3);
    });
  });
});
*/

// 2. Promise Pattern
console.log('\n2. Using Promises:');
const readFilePromise = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

readFilePromise(filePath)
  .then(data => {
    console.log('Promise Result:', data);
  })
  .catch(err => {
    console.error('Promise Error:', err);
  });

// 3. Async/Await Pattern
console.log('\n3. Using Async/Await:');
const readFileAsync = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    console.log('Async/Await Result:', data);
  } catch (err) {
    console.error('Async/Await Error:', err);
  }
};

readFileAsync();