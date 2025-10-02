const EventEmitter = require('events');

// Create an emitter
const emitter = new EventEmitter();

// Listen for the 'time' event
emitter.on('time', (timeString) => {
  console.log('Time received:', timeString);
});

// Emit a 'time' event every 5 seconds with current time
setInterval(() => {
  const currentTime = new Date().toLocaleString();
  emitter.emit('time', currentTime);
}, 5000);

console.log('Event emitter started. Press Ctrl+C to exit.');
console.log('Emitting time events every 5 seconds...');