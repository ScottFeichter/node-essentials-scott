const os = require('os');
const path = require('path');
const fs = require('fs');

// OS module
console.log('Platform:', os.platform());
console.log('CPU:', os.cpus()[0].model);
console.log('Total Memory:', os.totalmem());

// Path module
const joinedPath = path.join(__dirname, 'sample-files', 'folder', 'file.txt');
console.log('Joined path:', joinedPath);

// fs.promises API
(async () => {
  const filePath = path.join(__dirname, 'sample-files', 'demo.txt');
  await fs.promises.writeFile(filePath, 'Hello from fs.promises!');
  const content = await fs.promises.readFile(filePath, 'utf8');
  console.log('fs.promises read:', content);
})();

// Bonus: Streams for large files
const largeFilePath = path.join(__dirname, 'sample-files', 'largefile.txt');
// Create a large file for demonstration (if not exists)
if (!fs.existsSync(largeFilePath)) {
  const stream = fs.createWriteStream(largeFilePath);
  for (let i = 0; i < 1e5; i++) {
    stream.write('This is a line in a large file.\n');
  }
  stream.end();
}

const readStream = fs.createReadStream(largeFilePath, { encoding: 'utf8', highWaterMark: 1024 });
readStream.on('data', chunk => {
  console.log('Read chunk:', chunk.slice(0, 40) + '...'); // Log first 40 chars of each chunk
});
readStream.on('end', () => {
  console.log('Finished reading large file with streams.');
}); 