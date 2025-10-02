# Node.js Fundamentals

## What is Node.js?

Node.js is a JavaScript runtime environment built on Chrome's V8 JavaScript engine that allows developers to run JavaScript code outside of a web browser. It enables server-side JavaScript development and provides access to system resources like the file system, network, and operating system.

## How does Node.js differ from running JavaScript in the browser?

- **Environment**: Browser JavaScript runs in a sandboxed environment with limited access to system resources, while Node.js has full access to the operating system
- **Global Objects**: Browser has `window` object, Node.js has `global` object
- **APIs**: Browser provides DOM APIs, Node.js provides file system, networking, and OS APIs
- **Module System**: Browser uses ES modules or script tags, Node.js traditionally uses CommonJS modules
- **Security**: Browser JavaScript is restricted for security, Node.js has full system privileges

## What is the V8 engine, and how does Node use it?

The V8 engine is Google's open-source JavaScript engine written in C++ that compiles JavaScript to native machine code. Node.js uses V8 to:
- Parse and execute JavaScript code
- Provide just-in-time (JIT) compilation for performance
- Handle memory management and garbage collection
- Enable JavaScript to interact with C++ bindings for system operations

## What are some key use cases for Node.js?

- **Web APIs and REST services**: Building scalable backend services
- **Real-time applications**: Chat applications, live updates, WebSocket servers
- **Command-line tools**: Build tools, utilities, and CLI applications
- **Microservices**: Lightweight, scalable service architectures
- **IoT applications**: Handling sensor data and device communication
- **Build tools**: Webpack, Gulp, npm scripts

## Difference between CommonJS and ES Modules

### CommonJS (Traditional Node.js)
```javascript
// Exporting
const myFunction = () => {
  return "Hello from CommonJS";
};
module.exports = { myFunction };

// Importing
const { myFunction } = require('./myModule');
```

### ES Modules (Modern JavaScript)
```javascript
// Exporting
export const myFunction = () => {
  return "Hello from ES Modules";
};

// Importing
import { myFunction } from './myModule.js';
```

**Key Differences:**
- CommonJS uses `require()` and `module.exports`, ES Modules use `import` and `export`
- CommonJS is synchronous, ES Modules are asynchronous
- ES Modules have static analysis capabilities for better tree-shaking
- ES Modules are the standard for modern JavaScript development