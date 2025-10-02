# Lesson 12: Server-Side Rendering with EJS

## Learning Objectives
- Learn about embedded JavaScript (EJS) and how it works with server-side rendering

## Lesson Materials

In this lesson, you learn EJS (Embedded Javascript), a templating language for Express. The templates contain embedded JavaScript, which is executed on the server side. This constructs an ordinary HTML page, but with dynamic content. Because the embedded JavaScript runs on the server, before the page is sent to the client, dynamic content can be delivered, such as information from a database.

This allows you as a developer to directly insert data and functionality into your HTML. This is called "server-side rendering". The templates are ordinary HTML files, which may be combined with CSS and client-side JavaScript.

Server-side rendering is in some respects easier for you as the developer than writing first an API and then a front end for it, where the front end makes fetch calls to the API. On the other hand, if you don't create an API, you can't access the data via React or other front ends that run outside the application itself. There are other advantages and disadvantages. Frequently, an application will use both methods, using some server-side rendering for the administrator user interface and front-end/back-end for the end-user interface.

## EJS Syntax Tags

After creating a `.ejs` file, you will primarily use these syntax tags (also known as scriplets or squids) to inject data and functionality into your HTML:

- `<%- include 'filename' %>` - Include other templates
- `<% no-output code ie. conditionals %>` - Execute code without output
- `<%= output code or retrieved data %>` - Execute code and output result

## Example EJS Template

In the file (template) itself it might look something like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
 <% if(typeof user !== 'undefined'){ %>
      <button> Log In!
      </button>
  <% } else { %>

<%- 'partials/user-navbar' %>

 <% } %>

<p> Here is the hike trail: <%- 'views/trail' %></p>

<% let items = ['backpack', 'flashlight', 'canteen', 'tent', 'compass'] %>

<% for(let i = 1; i < items.length; i++) { %>

  <p>You will need: <%= items[i] %></p>

<% } %>

<%- 'partials/footer' %>

</body>
</html>
```

## EJS Tag Types

All are encased in the `<% %>` sequence. Using these scriplets you can include:

### `<%-` "includes" other templates
So that you can have headers, footers, and other partials without repeating surrounding HTML

### `<%` executes code but does not return any change to the HTML
This is used for logic statements, such as if statements and for loops.

### `<%=` executes code and returns the result in line as HTML

## JavaScript Execution Context

Please be sure that you understand where each piece of JavaScript executes!

The JavaScript for your controllers, routes, middleware, etc. executes on the **server side**. If you do a `console.log` for this code, it appears in the server terminal. The code you put into an EJS file also executes on the **server side**, to customize the page with variable data before it is sent to the browser.

However, you can also put JavaScript into an HTML or EJS page, or load it from a script, where the JavaScript is not within the EJS `<% %>` enclosure. That JavaScript is loaded by the browser and runs in the **browser context**, which means that it has access to the window and the DOM, but it does not have access to server side data and the database. Anything logged by `console.log` in that case would appear in the browser DevTools console.