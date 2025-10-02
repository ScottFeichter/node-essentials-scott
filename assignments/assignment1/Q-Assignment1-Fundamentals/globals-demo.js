// Node.js Globals Demo

console.log('=== Node.js Global Objects Demo ===');

// 1. __dirname and __filename
console.log('Current directory:', __dirname);
console.log('Current file:', __filename);

// 2. Process information
console.log('Process ID:', process.pid);
console.log('Platform:', process.platform);
console.log('Node version:', process.version);

// 3. Custom global variable
global.myCustomGlobal = 'This is a custom global variable!';
console.log('Custom global:', global.myCustomGlobal);

// Additional process information
console.log('Current working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV || 'development');