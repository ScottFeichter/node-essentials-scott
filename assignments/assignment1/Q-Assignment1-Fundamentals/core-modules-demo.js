const os = require('os');
const path = require('path');
const fs = require('fs');

console.log('=== Node Core Modules Demo ===');

// 1. OS Module - System Information
console.log('\n1. System Information (os module):');
console.log('Platform:', os.platform());
console.log('CPU Architecture:', os.arch());
console.log('CPU Count:', os.cpus().length);
console.log('Total Memory:', Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB');
console.log('Free Memory:', Math.round(os.freemem() / 1024 / 1024 / 1024) + ' GB');
console.log('Uptime:', Math.round(os.uptime() / 3600) + ' hours');

// 2. Path Module - Path Operations
console.log('\n2. Path Operations (path module):');
const dir1 = '/users/documents';
const dir2 = 'projects/node-app';
const joinedPath = path.join(dir1, dir2);
console.log('Joined Path:', joinedPath);
console.log('File Extension:', path.extname('app.js'));
console.log('Base Name:', path.basename('/users/documents/app.js'));

// 3. File System Operations with Promises
console.log('\n3. File System Operations (fs.promises):');

const demoAsync = async () => {
  try {
    // Write to demo.txt
    const demoContent = 'This is a demo file created with fs.promises!';
    await fs.promises.writeFile(path.join(__dirname, 'sample-files', 'demo.txt'), demoContent);
    console.log('Successfully wrote to demo.txt');

    // Read from demo.txt
    const data = await fs.promises.readFile(path.join(__dirname, 'sample-files', 'demo.txt'), 'utf8');
    console.log('Read from demo.txt:', data);

    // Create large file for streaming demo
    await createLargeFile();
    
    // Demonstrate streaming
    await streamLargeFile();

  } catch (error) {
    console.error('File operation error:', error);
  }
};

// Create a large file for streaming demonstration
const createLargeFile = async () => {
  const largePath = path.join(__dirname, 'sample-files', 'largefile.txt');
  let content = '';
  
  for (let i = 1; i <= 100; i++) {
    content += `This is line ${i} of the large file. It contains some sample text to make it bigger.\n`;
  }
  
  await fs.promises.writeFile(largePath, content);
  console.log('Created largefile.txt with 100 lines');
};

// Demonstrate reading large file with streams
const streamLargeFile = () => {
  return new Promise((resolve, reject) => {
    console.log('\n4. Streaming Large File (fs.createReadStream):');
    
    const largePath = path.join(__dirname, 'sample-files', 'largefile.txt');
    const readStream = fs.createReadStream(largePath, { 
      encoding: 'utf8',
      highWaterMark: 1024 // 1KB chunks
    });

    let chunkCount = 0;

    readStream.on('data', (chunk) => {
      chunkCount++;
      const preview = chunk.substring(0, 40).replace(/\n/g, ' ');
      console.log(`Chunk ${chunkCount}: ${preview}...`);
    });

    readStream.on('end', () => {
      console.log(`Finished reading large file with streams. Total chunks: ${chunkCount}`);
      resolve();
    });

    readStream.on('error', (error) => {
      console.error('Stream error:', error);
      reject(error);
    });
  });
};

// Run the demo
demoAsync();