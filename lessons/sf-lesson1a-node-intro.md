# **Lesson 1 — Introduction to Node**

## **Lesson Overview**

**Learning objective**:

- Node vs Browser
- Node event loop
- File system access
- HTTP servers
- Asynchronous programming

**Topics**:

1. What is Node?
2. Running Node
3. Syntax differences between Node and browser side JavaScript
4. Other Important Differences between Node and Browser JavaScript
5. File System Access with Async Operations
6. More on Async Functions

## **1.0 What is Node**

JavaScript (JS) is a programming language created to run inside the browser to enhance web applications with responsiveness.

Code run in the browser is loaded from the Internet and therefore can't be trusted.

As such, JS is restricted when running in the browser - for example it cannot access the local file system.

Node.js is an application created to run JS on your machine outside the browser.

This allows JS to be used for many more tasks beyond responsive web applications.

With Node, one can with JS do essentially anything that can be done in other programming languages, subject only to the security protections provided by the operating system.

## **1.1 Asynchronous Programming**

### The Call Stack

Computer code is merely a sequence of instruction steps.

The sequence of instructions when run utilizing Node.js is referred to as the call stack.

A stack is a data structure like a stack of pancakes.

Instructions are put on the stack then run from the most recent (top) and down to the bottom of the stack.

This is called Last In First Out (LIFO) order.

Node cannot run multiple instructions simultaneously; however there is a clever work around.

Any task that cannot be immediately completed can be moved off the call stack to the Event Loop.

### The Event Loop

The event loop is a holding area for instructions that are pending.

When a pending instruction is ready to be processed it is put in to a queue.

A queue is a data structure just like the waiting line that forms when you go to the bank.

The sequence of a queue is First In First Out (FIFO).

In node when the call stack finishes all of it's instructions it then begins processing instructions from the queues in the event loop.

### Non Blocking

Even though node can only run one instruction at a time the event loop prevents pending operations from blocking the program.

The event loop allows many instructions performed asynchronously.

This makes the node environment more performant for some things than would be in Python or Ruby.

When the stack of pancakes is finished the queue from the line at the bank starts to move (until a new pancake is added).

Here is a basic video summary of node capabilities: [What is Node.js?](https://youtu.be/uVwtVBpw7RQ)


## **1.2 Running Node**

Node is an application just like other applications you are familiar with.

Photoshop edits photos, browsers browse websites (and run JS), Node.js runs JS.

A difference with node is that it does not have a graphical user interface.

Therefore to utilize it directly you must use the command line.

At your terminal, type `Node` and press return.  (You should have completed the setup assignment.  If this command doesn't do anything, go back and do the setup.)

This starts the environment, and you can enter and run JS statements in the terminal.

"4 + 4" is valid JS so go ahead and type it then press return.


### undefined

Now type "let eight = 4 + 4;" and press enter.

When you use Node in the terminal you will often see "undefined" when you press return.

This occurs when the JS you entered does not have a return statement.

Often you will ignore this undefined.

Now enter "console.log(eight);" and press return.

You will get the value 8 then below it the word undefined.

When you entered "4 + 4" and pressed return you only got 8 (not undefined).

This is because 4 + 4 is an operation that returns the sum.

This undefined that occurs often when running Node in terminal is just a quirky part of the program.

Sometimes the undefined is telling you something important (that a value returns to undefined).

But often it is merely an inconsequential courtesy that occurs for reasons not worth bothering with right now.


### Node.js Environment

We have established that Node.js runs JS on your machine outside the browser.

In other words it is a JS run time environment.

In your terminal in the node environment try a console.log().

You may notice one difference from the browser environment.

Where does the output appear? It appears in your terminal.  Obvious, right?

However, if you open up the console in your browser developer tools, you will not see the output for Node console.log() statements.


### Node.js vs The Browser

The browser and node are environments with notable differences:

Browser:
    - mostly interacts with the DOM or Web Platform APIs ie Cookies
    - the document, window, and other objects provided by the browser
    - all of these do not exist in node
Node.js:
    - APIs via modules ie filesystem
    - those do not exist in browser

With Node.js you control the environment, not chrome, not firefox, not edge.

For example you decide which version of node to use and other variables of the environment.

There are also some small differences in JS syntax when using node as we'll learn.

### Running a File with Node

Create a file called myFirstNode.js.

Inside the file enter the following:

"This is my first program with node!"

console.log(No wait, THIS is my first program with node!!!);

Save the file.

Find the file path.


## .exit

## **1.3 Misc**

## General Language Info

A common pattern you will find is that each language has similar components.

Some common components are a run time environment, a package manager, an installer, and code libraries.

Each language tends to have it's own thematic naming convention for these components but they relate to the language basically the same.

As we learned, the preferred Node installer is npm. Libraries of code are referred to as packages. The package manager is usually npm.

There are other package managers that can be used with Node such as yarn and pnpm - we don't use them in this course and it is not critical to know them just that they exist.

And to compare the naming theme of node components to Ruby language Ruby has the RubyGems installer which would be it's equivalent of nvm.

Another example the Rust programming language calls its code libraries crates which would be equivalent to packages in node.

## Scripting Languages
