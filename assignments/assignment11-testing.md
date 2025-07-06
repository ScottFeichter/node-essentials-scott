# **Assignment 11: Automated Testing**

## **Assignment Instructions**

This assignment is to be added to node-homework.  Be sure to create an assignment11 branch for your work, and to create it from your assignment10 branch, so that you have access to your previous work.  This assignment requires the following packages, most of which have already been installed:

- jest
- supertest
- node-mocks-http
- eslint-plugin-jest
- globals
- cookies

Do an `npm install --save-dev`  of each of them, to make sure you have them.  You have, we hope, been using eslint to check your code for problems.  Jest confuses eslint, because when you run a jest test, you have various globals like `expect()` and `describe()` that you don't declare anywhere.  Add the following to your `eslint.config.js` at the bottom of the `defineConfig` array to fix this problem:

```js
    {
    // update this to match your test files
    files: ['**/*.spec.js', '**/*.test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
```

Create a `test` directory inside of the `node-homework` folder.  Then update your `package.json` so that the scripts stanza includes:

```json
    "test": "jest --verbose --roots ./test",
```

This configuration runs the tests you create, but not the TDD provided with the course.  You can now do `npm run test` but it won't do anything, of course, because you don't have any tests.

Within the tests direcory, create a file called `validation.test.js`.  All of your test files should end with `.test.js` so that `jest` will find them.  This test file is for testing your validation schema. Accordingly, it should start:

```js
const { userSchema } = require("../validation/userSchema");
const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
```

### **An Aside on JavaScript Destructuring**

You will do a good bit of object destructuring in this assignment, but you have to be careful when reusing variable names. The following code:

```js
let {error, value} = userSchema.validate(object1)
console.log("got here")
{error, value } = userSchema.validate(object2)
```

will give an error.  You can get a little further by adding parentheses:

```js
let {error, value} = userSchema.validate(object1)
console.log("got here")
({error, value } = userSchema.validate(object2))
```

But you'll find, at this point, that the JavaScript language parser is completely confused, and your program won't run, failing in peculiar ways.  But this will work:

```js
let {error, value} = userSchema.validate(object1)
console.log("got here");
({error, value } = userSchema.validate(object2))
```

This is a case where you **need** that semicolon.  If you already knew about this, forgive the digression.

## **First Test**

We want to test whether the user object validation will accept a trivial password.

Create a stanza as follows:

```js
describe("user object validation tests", ()=>{
    it("1: doesn't permit a trivial password", ()=>{
        const {error, value} = userSchema.validate(
            { name: "Bob",
              email: "bob@sample.com",
              password: "password",
            }.
            { abortEarly: false }
        )
    })
})
```

If the schema is working right, this should return an error, and the error should flag the fact that the password is inadequate.  The `error` returned should have a array of `detail` objects , each having a `context`, and there should be one with a key of `password`.  So we can modify the above code to read:

```js
describe("user object validation tests", ()=>{
    it("1: doesn't permit a trivial password", ()=>{
        const {error, value} = userSchema.validate(
            { name: "Bob",
              email: "bob@sample.com",
              password: "password",
            }.
            { abortEarly: false }
        )
        expect(error.details.find((detail) => detail.context.key == "password"),
             ).toBeDefined();
    })
})
```

Here, the `toBeDefined()` is a matcher provided with jest.  You'll need to know the avaiable matchers to use.  They are described at this link: [https://jestjs.io/docs/using-matchers](https://jestjs.io/docs/using-matchers).  Two possible problems could occur.  First, the error might be returned, but without a detail.context with a key of password.  Then the matcher would flag a test failure.  The rest of the test within the `it()` block would proceed, in case there are other problems to find.  The other possible error is that the validation call found no problems with the object, and returned a value instead of an error.  In this case, the reference to `error.details` would fail, because `error` would be null.  So an exception would occur, all processing within this `it()` block would stop.  In either case, we get the result we want: a test failure is reported.  If there are other `it()` blocks within the `describe()` or elsewhere in the file, they'll still run.

### **Style Requirements**

In creating your tests, follow these guidelines.

1. Do only one `expect()` within each `it()` block.  Note that you could have objects that are used within multiple `it()` blocks, provided that they are declared in a way that keeps them in scope, perhaps within the `describe()`.

2. Number the `it()` statement with the number of the test case, followed by a colon.  The test case spec will give the numbers you should use.

These requirements are just to allow the TDD to work, so that you and your assignment reviewers can know if your work is correct.

Now, run `npm run test`.  The test should succeed.

## **More Validation Tests**

Create the following additional tests within the first describe() block, each in its own it() block:

2. The user schema requires that an email be specified.

3. The user schema does not accept an invalid email.

4. The user schema requires a password.

5. The user schema requires name.

6. The name must be valid (3 to 30 characters).

Create another describe stanza for taskSchema, with the following tests:

7. The task schema requires a title.

8. The title must be valid.

9. If an `isCompleted` value is specified, it must be valid.

10. If an `isCompleted` value is not specified but the rest of the object is valid, a default of `false` is provided by validation.

11. If `isCompleted` in the provided object has the value `true`, it remains `true` after validation.

Create another describe() stanza for the patchTaskSchema.

12. Test that the title is not required in this case.

13. Test that if no value is provided for `isCompleted`, that this remains undefined in the returned value.

Do another `npm run test`.  All tests should succeed.  If a test fails, the error might be in the code you are testing, and it might be in the test.

### **Check for Understanding**

What other validation errors might occur that wouldn't be caught by these tests?

## **Controller Testing for the Task Controller**

Next, you need to test `controllers/taskController.js`.  When you test a controller, the controller actually reads from and writes to the database.  Therefore, you have to be careful about two things:

1. You only access the test database.

2. You set the database to a known state before testing.  We are just going to delete everything, but it is more common to populate it with known data.

Within your test folder, create a file called `taskController.test.js`.  This should start as follows:

```js
require("dotenv").config({path: "../.env"});
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const { PrismaClient } = require("@prisma/client");
const { createUser } = require("../services/userService");
const httpMocks = require("node-mocks-http");
const {
  index,
  show,
  create,
  update,
  deleteTask,
} = require("../controllers/taskController");
const prisma = new PrismaClient();
let user1 = null;
let user2 = null;
```

The call to `dotenv` is needed to get the database URLs.  But **before** you load the Prisma client, and **before** you load any code that loads the Prisma client, you have to set the environmnet variable to point to the test database.  You are going to use the `createUser()` function from your user service.  You want to use this to create the user records you need in the database, because if you call the Prisma client directly, the password would not be hashed.

Jest provides a number of useful hooks:

- beforeAll
- beforeEach
- afterAll
- afterEach

In this case, the `beforeAll()` hook will be used to empty the database and to create the user records needed.  So the next part of the test file looks like this:

```js
beforeAll(async () => {
  // clear database
  await prisma.Task.deleteMany(); // delete all tasks
  await prisma.User.deleteMany(); // delete all users
  user1 = await createUser({
    email: "bob@sample.com",
    password: "Pa$$word20",
    name: "Bob",
  });
  user2 = await createUser({
    email: "alice@sample.com",
    password: "Pa$$word20",
    name: "Alice",
  });
});
```

Clearly you would not want to do this step unless you are pointing to the test database.  When you pass a function to `beforeAll()` or `it()` or other jest functions, you can declare it as async so that you can use await, and so that jest will wait for async operations to complete.

Why do we need the user records? Each task record has a foreign key, the userId.  If this is not provided or if it doesn't correspond to a real user record, you get a constraint violation from the database.

### **The First Test**

We want to call the task controller `create` method.  That method takes two parameters, the `req` and the `res`.  We need to simulate those.  To that end, we have the `node-http-mocks` package.

Our first test looks like this:

```js

describe("testing task creation", () => {
    it("14: create a task", async () => {
        req = httpMocks.createRequest({
            method: "POST",
            body: { title: "first task" },
        });
        let res = httpMocks.createResponse();
        await create(req, res);
        expect(res.statusCode).toBe(201);
    });
})
```

OK, all looks good.  This is a valid task object for creation.  So, run the test.  Whoa! That failed.  Have a look at the log to figure out why.  What do you see?  Ah, of course, `req.user` is not set!  In the app, task creation is behind the `auth` middleware, and that is what sets up req.user.  So, we still have a valid test, but we need to rename it and catch the error, as follows:

```js
    it("14: cant create a task without userId", async () => {
        expect.assertions(1)
        req = httpMocks.createRequest({
            method: "POST",
            body: { title: "first task" },
        });
        let res = httpMocks.createResponse();
        try {
            await create(req, res);
        } catch (e) {
            expect(e.name).toBe("TypeError");
        }
    });
```

Now run the test again.  Ah, that's better! But, the test case still isn't right.  If the error is not thrown, the test case would not identify the problem.  You definitely want the error to be thrown, and the test should make sure that it is.  This is done with the `expect.assertions()` method.  In this case, we expect that one assertion, one expect() statement, will be satisfied, and we want the test to fail if that doesn't happen.

## **More Tests of the Tasks Controller**

Now you know that for the create() call to succeed, you need to have `req.user = { id: user1.id }`.  

Create more controller tests:

15. Test that you can't create a task with a bogus user id.

16. Test that if you have a valid user id, create() succeeds (res.status should be 201).

17. Test that the object returned from the create() call has the expected title.  To do this, you need to do `const data = res._getJSONData()`.

18. Test that the object has the right value for `isCompleted`.

19. Test that the returned object does not have any value for userId (`.not.isDefined()`)

Note: if you declare a res that is in the describe scope, test 16 could make the create() call, and tests 17, 18, and 19 could just check to see if the returned data is correct.

Create a new describe stanza called "test getting created tasks".

20. Test that you can't get a list of tasks without a user id.

21. Test that if you use user1's id, the call succeeds.

22. Test that the returned JSON is an array of length 1.

23. Test that the title in the first array object is as expected.

24. Test that the first array object does not contain a userId.

25. Test that if you use the userId from user2, you get a 404.  (This is a security test for access control!  You do not want Alice to access Bob's data!)

26. Test that you can retrieve the first array object using the `show()` method of the controller.

27. Test that user2 can't retrieve this object. (Why test this? We don't use this operation in the app -- but we have to test it, as it could be a back door.)

Now create another stanza for testing the update and delete of tasks.

28. Test that user1 can set the task to `isCompleted: true`.

29. Test that user2 can't do this.

30. Test that user2 can't delete this task.

31. Test that user1 can delete this task.

32. Test that retrieving user1's tasks now returns a 404.

You have created quite a few tests so far, but none of them are very long.  A complicated project will have a test suite of thousands of test cases.  This example is to show you all the things you need to test in a typical test suite.  For the balance of the assignment, we won't write as many tests.

Run the tests, and make sure all of them pass.

## **Tests of the User Controller**

Create another file in the test directory called `user.controller.test.js`.  This should start:

```js
require("dotenv").config({path: "../.env"});
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const { PrismaClient } = require("@prisma/client");
const { createUser } = require("../services/userService");
const httpMocks = require("node-mocks-http");
const {
  index,
  show,
  create,
  update,
  deleteTask,
} = require("../controllers/taskController");
const prisma = new PrismaClient();
let user1 = null;
let user2 = null;

beforeAll(async () => {
  // clear database
  await prisma.Task.deleteMany(); // delete all tasks
  await prisma.User.deleteMany(); // delete all users
  user1 = await createUser({
    email: "bob@sample.com",
    password: "Pa$$word20",
    name: "Bob",
  });
  user2 = await createUser({
    email: "alice@sample.com",
    password: "Pa$$word20",
    name: "Alice",
  });
});
```

We want to test logon.  But, we have a couple of problems.  The login method sets a cookie.  If that cookie is not set, things aren't working.  A res object returned by `httpMocks.createResponse()` doesn't keep track of cookies.  The second problem is that, within the login method is a call to passport, with a callback inside.  The res.json() call only happens within the callback.  So, if your test code does an `await login(req,res)`, that will return before the res object is updated, and the test will fail.  You will likely get an error message from jest that you are not handling asynchronous operations correctly.  Now, one could ask the author of the login method to wrapper the call to passport within a promise.  But, it's considered poor form to ask for product code changes just to enable a test, at least if those aren't really necessary.

So, we create an enhanced version of the mock res object.  This one keeps track of 'Set-Cookie' operations, and it also provides a means of waiting on a promise that will resolve when the `res.json()` call occurs.  Here's that code:

```js
const cookie = require("cookie");
function MockResponseWithCookies() {
  const res = httpMocks.createResponse();
  res.cookie = (name, value, options = {}) => {
    const serialized = cookie.serialize(name, String(value), options);
    let currentHeader = res.getHeader("Set-Cookie");
    if (currentHeader === undefined) {
      currentHeader = [];
    }
    currentHeader.push(serialized);
    res.setHeader("Set-Cookie", currentHeader);
  };

  res.jsonPromise = () => {
    return new Promise(resolve => {
      res.oldJsonMethod = res.json
      res.json = (...args) => {
        res.oldJsonMethod(...args)
        res.json = res.oldJsonMethod
        resolve()
      }
    })
  }

  return res;
}
```

We are adding a `cookie()` function to keep track of the "Set-Cookie" operations, performing appropriate serialization and storing them in an array.  We are also putting a promise wrapper around the `res.json()` function so that we know when it has been called.  We only need that one for `login()`.

Ok, so now one can create the logon test:

```js
describe("testing login, register, and logoff", ()=>{
    let res=null; // we declare it here, so we can use it in subsequent tests
    it("33: The user is logged on", async()=>{
        const req = httpMocks.createRequest({
                method: "POST",
            body: { email: "bob@sample.com", name: "Bob", password: "Pa$$word20" },
         });
        res = MockResponseWithCookies()
        const jsonPromise = res.jsonPromise()
        login(req,res) // no need for await here
        await jsonPromise // because we do it here, after everything is done
        expect(res.status).toBe(200) // success!
    })
})
```

It is convenient to declare `res` outside of the individual test, so that one can write multiple tests that inspect its contents.  But! Do not use the same res for multiple controller calls.  There will be garbage state preserved.  Create a new one when you do a subsequent controller call.

One can now add some subsequent tests, without sending another request.  These tests just check the data and cookies.  The response header needed for the test is obtained via:

```js
const setCookieArray = res.get("Set-Cookie")
```

Add the following tests:  

34. Verify that the setCookieArray has a length of 1.

35. Verify that the first string in that array starts with "jwt=".

36. Verify that that string contains "HttpOnly;".  (This is a security test!)

37. Verify that the returned data contains a name.

38. Verify that the returned data contains a csrfToken.

39. Verify that a logon attempt with a bad password returns a 401.

40. Test that one can't register with an email address that is already registered.

41. Test that one can register an additional user.

42. Test that one can logon as that new user.

43. Test that one can logoff.

45. Test that the logoff has cleared the cookie.  The cookie string should contain "Jan 1970".  Cookies are cleared by setting the expiration date to some time in the past.

Verify that "npm run test" runs all these tests successfully.

## **Testing Actual Network Operations**

One could write similar tests for the routers and the middleware, but at some point, you need to link these, to see if they all work together. For this, we use supertest.  Create another file in the test directory called `user.function.test.js`.  This is to call the user functions.  You will need to change `app.js` as follows:

```js
let server = null;
try {
  server = app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`),
  );
} catch (error) {
  console.log(error);
}

module.exports = { app, server };
```

The new test file should start out as follows:

```js
require("dotenv").config({path: "../.env"});
const request = require("supertest")
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const {app, server} = require("../app")
const agent = request.agent(app)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

beforeAll(async () => {
  // clear databaseS
  await prisma.Task.deleteMany(); // delete all tasks
  await prisma.User.deleteMany(); // delete all users
});

afterAll(async () => {
    server.close()
}
```

Let's explain this code.  As usual, we load the environment variables we need, and make sure we are pointing to the test database from the start.  We are using cookie based security, so we have to keep track of the cookies.  Fortunately, the supertest agent does that for us.  We configure the agent with the app so that the actual operations can be sent to the app.  As usual, we clean the database.  We want to stop the server at the end of the test, and we do that in the afterAll() hook.

Now for the first test of this type:

```js
describe("register a user ", () => {
  let res = null // we'll declare this out here, so that we can reference it in several tests
  it("46: it creates the user entry", async () => {
    const newUser = {
      name: "John Deere",
      email: "jdeere@example.com",
      password: "Pa$$word20",
    };
    const res = await agent.post("/user/register", newUser).send(newUser);
    expect(res.status).toBe(201);
  })
})
```

We are using a particular async/await style here, which is what I recommend.  You can instead do things like:

```js
it('should access a restricted page after sign-in', function (done) {
    agent
        .get('/tasks')
        .expect(200) // Expect a successful response after authentication
        .end(done);
});
```

But, that's old style: not recommended!

Run this test to make sure it works.  You can run this individual test as follows: 

```bash
npx jest test/user.function.test.js
```

Then, add the following additional tests:

47. Test that the returned object includes the expected name.  Note: For supertest, you can get the body of the request with just `res.body`.

48. Test that the returned object includes a csrfToken.

49. Test that one can logon as the newly registered user.  Note: You don't have to worry about the asynchronous call to passport here.  That will have completed as soon as the call to the agent returns.

50. Test that one can logoff.  Hint: The logoff route is protected.  What do you need to put in the request header?

Then verify that all your tests run without error.

## **On Making Tests Comprehensive**

As you go further up the stack, your tests don't have to be quite as granular.  When you create your controller function tests, you don't have to test all the ways that a task or user object might not pass validation, because your validation tests handle that.  But, you probably ought to test at least one way in which the validation should fail, so that you know that the validation is actually being performed.  Similarly, when you test the actual network tests with supertest, you don't have to test all the things that the controller unit tests do.  On the other hand, it is very important to have comprehensive unit tests.  In theory, you could test every case with supertest -- but then someone would have to analyze **why** the test failed, and **where** in the whole stack the actual bug resides.

You can check code coverage as follows:

```bash
npx jest --roots ./test --coverage
```

How far did you get towards 100%?

If your code is robust, it will handle lots of unlikely errors in data or requests or race conditions or the like.  However, some of these conditions may be hard to duplicate in test -- so a test suite with 100% code coverage is rarely achieved.

Whenever software is provided to a customer or end user, there is an implicit contract:

- This software is robust and does not fail under normal use, or even under hostile attack.
- The results returned by this software are correct.
- This software does not lose the data it stores.
- This software is secure, and does not divulge sensitive information.
- This software won't be broken as it is maintained or enhanced.

The purpose of testing is to meet the terms of the contract.

### **Check For Understanding**

1. You shouldn't be able to logoff if you are already logged off.  Why?  Do you need a test for this?

2. Suppose you want to write a function test for task operations using supertest.  How would you go about it?

3. How do you know if you have enough supertest cases?

4. Give one example of a kind of security test that was not covered in this assignment.

### **Answers**

1. Logoff is a post operation that could be triggered by cross site request forgery.  It is important to include a csrf token with the request to protect against this.  A test is needed to verify that this protection is in place.

2. To do a task operations functional test, one would first check that none of the task operations can be performed without being logged on.  Then, one would do a logon.  Then, one would check that none of the task operations that change data, those being POST, PATCH, and DELETE, can be done without a CSRF token.  Then, each of the task operations: POST /tasks, PATCH /task/:id, GET /tasks, GET /tasks/:id, and DELETE /tasks/:id, should be tested for correct responses.  One should also check that PATCH, GET, and DELETE operations don't give access to data that doesn't belong to the currently logged on user.  This is the minimum, but might suffice if there are adequate unit tests.

3. The short answer is, you can never know for sure that you have enough supertest cases, but every operation that a user might reasonably perform should be tested.  Also, for security, every known attack angle that an attacker might use should be tested.

4. One kind of attack is to try to put cross site scripting sequences into the stored data.  The back end is not vulnerable to cross site scripting, because it isn't running in a browser.  The risk is that an attacker could insert hostile scripts into data stored by the back end that the front end subsequently displays.  The sanitizer package included in the app is intended to protect against this, but there should be a test case that it is actually present and working.

## **Code Coverage**

## **Runnng the Test of the Tests**

To be done.  Not sure if I'll really do this.

## **Submit Your Assignment on GitHub**

📌 **Follow these steps to submit your work:**

#### **1️⃣ Add, Commit, and Push Your Changes**

- Within your node-homework folder, do a git add and a git commit for the files you have created, so that they are added to the `assignment11` branch.
- Push that branch to GitHub.

#### **2️⃣ Create a Pull Request**

- Log on to your GitHub account.
- Open your `node-homework` repository.
- Select your `assignment11` branch. It should be one or several commits ahead of your main branch.
- Create a pull request.

#### **3️⃣ Submit Your GitHub Link**

- Your browser now has the link to your pull request. Copy that link.
- Paste the URL into the **assignment submission form**.
