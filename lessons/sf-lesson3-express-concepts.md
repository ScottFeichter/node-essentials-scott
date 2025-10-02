# **Lesson 3 — Express Application Concepts**

## **Lesson Overview**

**Learning objective**:  Students will get some foundational knowledge of Internet protocols, REST APIs, and JSON.  Students will learn more about what Express is and how it augments Node to make an easy and comprehensive framework for the development of web applications. Students will learn the basic elements of an Express application and the purpose of each.

**Topics**

1. Review: What is Express?
2. Internet Basics
3. HTTP
4. REST and JSON
5. What do Route Handlers Do In Express?
6.  Middleware Functions, Route Handlers, and Error Handling
7. Parsing an HTTP Request
8. Debugging an Express Application

## **3.1 Review: What is Express**

As we have seen, all of the elements needed to create a web application are provided by Node, including network API access, the HTTP server, event handlers, streams, etc.  Express assembles these in an easy to use framework, where the flow of control is easily understood and where each of the elements is compact and easily created. Express is very widely used, and as a result, it has a comprehensive ecosystem of additional plug-in packages that facilitate data exchange, HTTP request parsing, and the construction of HTTP responses for the applications you create.  But, to use it effectively, you need to understand the protocols and data flows involved, so this lesson describes them.

## **3.2 Internet Basics**

All Internet traffic is based on layers of protocols.  The Internet runs on IP: Internet Protocol.  When data is sent over the Internet, it is broken up into packets.  Each packet has a source address, a destination address, a protocol and a port.  The addresses are four part numbers like 9.28.147.56.  The protocol is also a number, indicating what kind of packet it is, and the port is also a number, which endpoints use to figure out which process on a machine should get the packet.  A network of routers figures out where the destination machine is and forwards the packet.  

For REST, you will use a protocol on top of IP called TCP, which stands for Transmission Control Protocol.  TCP has reliable connections, where "reliable" means that each TCP endpoint sends acknowledgements when a packet arrives, and if the acknowledgement is slow in arriving, the source machine sends the packet again.  Retries continue until the acknowledgement arrives or a timeout occurs.  TCP connections have a server, which listens for connection requests, and a client, which initiates them.  Your browser is a client.  Servers and clients communicate over TCP using a programming interface called sockets, but sockets are just a programming interface of the operating system. Servers typically have a DNS name, like www.widgets.com.  DNS stands for Domain Name Service, and a network of domain name servers keep track of the names so that each endpoint can look them up.  TCP connections can be augmented with SSL, which stands for Secure Sockets Layer.  There are two advantages to SSL.  First, all the data sent by either end of the the connection is encrypted so that no one can listen in.  Second, when the SSL connection is established, the server proves, by means of a cryptographic exchange, that it really is www.widgets.com, and not some impostor.

Remember all of this.  It might come up during trivia night at your local bar.

## **3.3 HTTP**

REST requests flow over a protocol called HTTP, which stands for Hypertext Transfer Protocol.  HTTP over an SSL connection is called HTTPS.  Each HTTP request uses one of a small number of methods.

- GET
- POST
- PUT
- PATCH
- DELETE
- HEAD
- OPTIONS
- CONNECT
- TRACE

For REST requests, GET, POST, PUT, PATCH, and DELETE are used.  Each HTTP request packet has various parts, most of which are optional:

- A method.  This is always present.

- A path, like "/info/dogs", which comes from the URL.  This is always present.

- Query parameters, like "name="Spot".  If present, these come from the URL, for example as in "http://info/dogs?name=Spot&owner=Frank.  These are often used in REST requests.

- URL or path parameters.  If present, these are additional parameters parsed from the URL.

- Headers.  These are key-value pairs.  For REST requests, the "Content-Type" header is always used, and it typicallyoften has the value "application/json".  There are many other headers.

- A body.  POST, PUT and PATCH requests often have a body. Responses for each of the methods also often have a body.  For REST, the body is usually JSON.  By convention, POST operations are used to create some data on the back end, PATCH to update that data, and PUT to replace that data.  Never use GET requests to change data!

For every HTTP request, there is exactly one HTTP response (although the body of the response, if it is long, might be broken up into chunks.  Each HTTP response packet also has components:

- Headers
- A result code
- Often, a body.

Pay attention to this part.  You will use all the REST operations.  You will need to specify the path, the query parameters, a header, JSON in the body, and even a cookie, to complete your final project.

### **Stuff the Browser Keeps Track Of**

Not all HTTP requests originate at a browser, but for those that do, the browser keeps track of information associated with the request.  The browser keeps track of the origin for a request.  This is the address and port for the URL that is the target of the request.  When a browser application makes a REST request, that may go to the origin from which the application was loaded, or it might be a fetch() call to a different origin.  If it goes to a different origin, that's a cross origin request.

The browser also keeps track of cookies, which are key-value pairs.  These are set because a Set-Cookie header was sent in a server response, and they store data, typically small amounts, but certainly less than 4k.  They also have various flags.  Browsers have policies for which Set-Cookie headers will be honored, and silently discard the rest.  Cookies can be sent on subsequent requests from the browser application, depending on the request and also on the browser policies, until such time as the cookie expires.  Cookie content is available to the JavaScript in the browser application, unless it is an HttpOnly cookie.  A server sets an HttpOnly cookie to store information about the client, such as whether the user has logged on and who that user is.  Cookies are not usually used unless the requesting application is running in a browser.

## **3.4 REST and JSON**

REST stands for Representational State Transfer, which is a pretty opaque name for a standard.  What it means is that HTTP requests and responses are exchanged, and management of the state of the conversation and the security governing the exchange is not a part of the REST protocol itself.

JSON stands for JavaScript Object Notation.  You need to know JSON.  Here is a [video introduction to JSON](https://www.youtube.com/watch?v=iiADhChRriM). Below is a summary.

The types in JSON are:

- Number, either an integer or a decimal.
- String, always in Unicode
- Boolean, either true or false
- Array, which is an ordered list of any of these datatypes.
- Object, a collection of name-value pairs.  The names are always strings.  The values can be any of these datatypes.
- null.

You can put objects in objects, objects in arrays, arrays in objects, and so on, nesting as much as you like, so as to make the document as complicated as necessary.  A JSON document must either be an object or an array.  Here is an example from Wikipedia:

```JSON
{
  "first_name": "John",
  "last_name": "Smith",
  "is_alive": true,
  "age": 27,
  "address": {
    "street_address": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postal_code": "10021-3100"
  },
  "phone_numbers": [
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "office",
      "number": "646 555-4567"
    }
  ],
  "children": [
    "Catherine",
    "Thomas",
    "Trevor"
  ],
  "spouse": null
}
```

A JSON document is not a JavaScript object.  The keys in a JSON object are always strings in double quotes.  The string values in a JSON object are always specified in double quotes.  In JavaScript, a JSON document is just a string.  The following JavaScript functions are often used with JSON:

```js
const anObject = JSON.parse(aJSONString);  // convert from a JSON string to a JavaScript object.
const aJSONString = JSON.stringify(anObject);  // convert from a JavaScript object to a JSON string.
```

Of course, not all JavaScript objects can be converted to JSON.  If the object contains functions, for example, they are omitted from the resulting JSON string, and this also happens with other JavaScript types.

Binary objects like JPEGs are never sent in JSON.  You can still do a REST request for these datatypes, but you use a different content type.

JSON objects can be parsed or created in any modern computer programming language: Python, Java, Rust, C++, etc..  In some NoSQL databases like MongoDB, every entry in the database is basically a JSON object.

## **3.5 What do Route Handlers Do In Express?**

For each HTTP request sent to a server, there must be exactly one response.  If no response is sent, a user might be waiting at the browser for a timeout.  If several responses are sent for one request, Express reports an error instead of sending the second one.  A route is specified by a **method** (GET, POST, PUT, PATCH, DELETE, and several others) and a **path**, a part of the URL after the host and port, but before the query parameters, something like `/info/books`.

Associated with each route in Express is a route handler, the function that Express calls to interpret the request and send back the response.  Route handlers may retrieve data and send it back to the caller. Or, they may store, modify, or delete data, and report the success or failure to the caller.  Or, they may manage the session state of the caller, as would happen, for example, with a logon.  The data accessed by route handlers may be in a database, or it may be accessed via some network request.  When sending the response, a route handler might send plain text, HTML, or JSON, or any number of other content types.  A route handler must either send a response or call the error handler to send a response.  Otherwise the request from the caller will wait until timeout.

Route handlers and middleware functions frequently do asynchronous operations, often for database access.  While the async request is being processed, other requests may come to the server, and they are dispatched as usual.  Route handlers and middleware may be declared as async, so that the async/await style of programming can be used.  These functions don't return a value of interest -- the interesting stuff is in the response, not the return value.

## **3.6 Middleware Functions, Route Handlers, and Error Handling**

Let's sum up common characteristics of middleware functions and response handlers.  Let's also explain how errors are handled.

1. They are each called with the parameters req and res, or possibly req, res, and next.  They may be declared as async functions.

2. Once they are called, these functions do processing based on the information in the req object: method, path, path parameters, query parameters, headers, cookies, the body.  Every request has a method and path, but the other request attributes may or may not be present.

3. These functions must do one of the following, or the request times out:

- Send a response.
- Call next().
- Throw an error.

Even route handlers sometimes call `next(error)` to pass the error to the error handler.  Middleware functions often call next() withouut parameters, to call the next middleware in the chain or the route handler for the request, but they also might call `next(error)` in some cases.

4. If `next(error)` is called or an error is thrown, the error handler is called and passed the error.  An error might be thrown from the code of the middleware function or route handler. Or it might be thrown by one of the function calls that the middleware function or route handler makes.  In the latter case, if it is a known type of error, the middleware function or route handler may catch the error and send an appropriate response to the requester.  But if it is not an error of known type, it is a 500: an internal server error.  Route handlers and middleware functions don't need to catch unknown error types, and if they do, they can just throw them again.

The Express 5 error handler catches all the errors thrown by middleware functions and route handlers, and also receives all errors that are reported to it using `next(error)`.  This happens even if the error is thrown by an asynchronous function call.

**However, please note:** Middleware functions and route handlers sometimes call functions that have callbacks.  They may send responses or call next() from within the callback.  That works fine.  But they must **never** throw an error from within a callback.  That would crash the server.  They must call `next(error)` instead.

## **3.7 Parsing an HTTP Request**

One very common piece of middleware is the following:

```js
app.use(express.json())
```

This middleware parses the body of a request that has content-type "application/json".  The resulting object is stored in req.body.  There are other body parsers to be used in other circumstances, for example to catch data that is posted from an HTML form.

### **The req and res Objects**

You can access the following elements of the req:

req.method
req.path
req.params  HTML path parameters, if any.  When you configure a route with a route handler, you can tell Express where these are in the URL.
req.query  query parameters of the request, if any
req.body    The body of the request, if any
req.host    The host that this Express app is running on

There are many more.

The req.get(headerName) function returns the value of a header associated with the request, if that header is present.
`req.cookies[cookiename]` returns the cookie of that name associated with request, if one is present.

The res object has the following methods:

res.status()  This sets the HTTP status code
res.cookie()  Causes a Set-Cookie header to be attached to the response.
res.setHeader() Sets a header in the response
res.json()    When passed a JavaScript object, this method converts the object to JSON and sends it back to the originator of the request
res.send()    This sends plain text data, or perhaps HTML.

## **3.8 Debugging an Express Application**

There are various techniques to debug an Express application.

First, you should try to produce the error condition.  You do this one of two ways.  You may send a browser request to the application, in which case the network tab of browser developer tools will show you exactly what was sent and received for each request.  Or, you may use Postman to send requests, and Postman will show you exactly what was sent and received.

Second, if you have a hunch what is causing the error, you put console.log() or console.info() or console.debug() statements.  You would do this, in particular, if an error condition is happening in test or production that you can't duplicate.  When the tester or user triggers the error, your log may tell you what is going on.  You'll use this technique plenty in development too.

Third, you can write debugging middleware that can identify and log the error condition.  Your middleware function could report the content of the request, and perhaps some information about the response.  In some cases, you could insert a middleware function that is to be called after the middleware you want to debug, to see if that is working correctly.

Fourth, you could use the debugger built into VSCode.  

### **Using the VSCode Debugger**

1. Edit your node-homework `.vscode/launch.json`.  Here is one configuration you could use:

```js
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Express App",
      "runtimeExecutable": "nodemon",
      "runtimeArgs": [
        "--inspect-brk",
        "app.js"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "restart": true,
      "env": {
        "NODE_ENV": "development",
        "PORT": "3000"
      }
    }
  ]
}
```

2. Edit a source code file, such as app.js.  There are line numbers for each line in the file.  If you click just to the left of the line number, a little red dot appears.  This is a breakpoint.  You can put them whereever you like in your code.  Click again to remove the breakpoint.

3. At the top of your VSCode window, there is a Run tab.  Click on this and select "start debugging".

Voilà.  Your program runs to the first breakpoint.  Your source file is displayed, and the program statement that is to run next is highlighted.  On the left side of your VSCode window, you see the debugger screen. The Variables section shows all the variables that are active in the context.  You can edit the values associated with each.  You can add variable names to the Watch section, so you can see how they change as you step through your program.  If you open the Call Stack section, you see the call stack.  An entry in the call stack will say `paused` or `paused on breakpoint`.  If you hover your mouse pointer over that, you see icons for continue, step over, step into, step out of, restart, and stop.  If the next line is a function call, step over runs the entire function call, step into goes into the function, and step out of runs all instructions until the return from the current function has completed.  If you do hit the continue button, it will run the program, and your Call Stack section will display a pause button that is usually ineffective.  You should first set a breakpoint before you hit continue, or add a breakpoint as it runs and then send a Postman request that will cause the breakpoint to be reached.  At the top of your VSCode window is a red square.  You click on that to end the debug session.

### **Sample Middleware for Debugging**

The following middleware function might be helpful.

```js
app.use((req, res, next) => {
    res.on('finish', () => {
// Here you'd log information that might be helpful to know about the req and/or the res.
    });
    next();
});
```
The "finish" event fires after the response has been sent to the requester.  You'd put this middleware function into the chain before any middleware function or request handler you are trying to debug.  You have to register the res.on() finish event callback before the response is actually sent, or it won't catch anything.

This middleware can log whatever is interesting in the req and res objects, with one exception.  You can get the headers and result code from the response, but you can't get the body of the response.  The body will already have been streamed to the network in response to the request.

### **Check for Understanding**

1. What are the parameters always passed to a route handler?  What are they for?

2. What must a route handler always do?

3. How does a middleware function differ from a route handler?

4. If you do an await in a route handler, who has to wait?

5. You add a middleware function or router to the chain with an app.use() statement.  You add a route handler to the chain with an app.get() or similar statement.  Each of these has filter conditions.  How do the filter conditions differ?

### **Answers**

1. A route handler always gets the req and res objects.  The req object contains information from the request, perhaps with additional attributes added by middleware functions.  The res object has methods including res.send() and res.json() that enable the route handler to respond to the request.

2. A route hander must either respond to the request with res.send() or res.json(), or call the error handler with next(error), or throw the error.

3. A middleware function may or may not respond to the request.  Instead it may call next() to pass control to the next handler or middleware function in the chain.  It must either respond to the request or call next, or perhaps throw an error.

4. If you do an await in a route handler, the caller for the request has to wait.  You might be waiting, for example, on a response from the database.  You need the database response before you can send the HTTP response to the caller.  On the other hand, other callers don't have to wait, unless they make a request that ends up at an await statement.

5. An app.use() statement has an optional parameter, which is the path prefix.  You might have a statement like app.use("/api", middlewareFunction), and then middlewareFunction would be called for every request with a path starting with "/api", no matter if it is a GET, a POST, or whatever.  If the path prefix is omitted, the middleware function is called for every request.  An app.get() statement, on the other hand, calls the corresponding route handler only if the path matches exactly and the method is a GET.  In either case, you can pass additional middleware functions as parameters to be called in order, like:

```js
app.use("/api", middleware1, middleware2, middleware3);
app.get("/info", middleware1, infoHandler);
```