# Week 1 Assignment: Intro to Node.js & Async JavaScript

> **Note:** You need to create a `sample-files` folder inside your `assignment1` directory to store the `.txt` files (such as `demo.txt`, `largefile.txt`, and `sample.txt`) used in the code examples and demos.

## Learning Objectives
- Understand what Node.js is and how it differs from browser JavaScript
- Explore Node.js architecture and the V8 engine
- Use Node.js global objects (`global`, `process`, `__dirname`)
- Identify key use cases for Node.js (APIs, CLIs, real-time apps)
- Understand module systems (CommonJS vs ES Modules)
- Grasp asynchronous JavaScript concepts: blocking vs non-blocking I/O, the event loop, callbacks, promises, async/await
- Work with Node core modules: `fs`, `path`, `os`
- Use file system methods (`fs.readFile`, `fs.writeFile`, `fs.promises`), and understand why streams matter for large files

## Assignment Tasks

### 1. Node.js Fundamentals
- In a markdown file (`node-fundamentals.md`), answer the following:
  - What is Node.js?
  - How does Node.js differ from running JavaScript in the browser?
  - What is the V8 engine, and how does Node use it?
  - What are some key use cases for Node.js?
  - Explain the difference between CommonJS and ES Modules. Give a code example of each.

### 2. Exploring Node Globals
- Create a script (`globals-demo.js`) that logs the following:
  - The value of `__dirname` and `__filename`
  - The current process ID and platform using `process`
  - A custom global variable (attach a property to `global` and log it)

### 3. Asynchronous JavaScript
- Create a script (`async-demo.js`) that:
  - Reads a file asynchronously using `fs.readFile`
  - Demonstrates a callback function and explains callback hell with a code example (in comments)
  - Converts the callback code to use Promises, then async/await
  - Uses `try/catch` for error handling

### 4. Node Core Modules
- Create a script (`core-modules-demo.js`) that:
  - Uses the `os` module to log system information (platform, CPU, memory)
  - Uses the `path` module to join two paths and log the result
  - Uses the `fs.promises` API to write and then read a file
  - (Bonus) Create a (`largefile.txt`) manually and Demonstrate reading a large file using streams and log chunks as they are read

## Submission
- Place all scripts and markdown files in the `assignment1/` folder.
- Add your answers and code as described above.
- Commit and push your changes.

## Resources
- [The Odin Project: Node.js](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs)
- [Node.js Official Docs: V8 Engine](https://nodejs.org/en/learn/getting-started/the-v8-javascript-engine) 