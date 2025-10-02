require("dotenv").config();
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const { EventEmitter } = require("events");
const prisma = require("../prisma/db");
const { createUser } = require("../services/userService");
const httpMocks = require("node-mocks-http");
const waitForRouteHandlerCompletion = require("./waitForRouteHandlerCompletion");
const {
  index,
  show,
  create,
  update,
  deleteTask,
} = require("../controllers/taskController");

let user1 = null;
let user2 = null;
let saveRes = null;
let saveData = null;
let saveTaskId = null;

beforeAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
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

afterAll(() => {
  prisma.$disconnect();
});

describe("testing task creation", () => {
  it("14. cant create a task without a user id", async () => {
    expect.assertions(1);
    const req = httpMocks.createRequest({
      method: "POST",
      body: { title: "first task" },
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    try {
      await waitForRouteHandlerCompletion(create, req, saveRes);
    } catch (e) {
      expect(e.name).toBe("TypeError");
    }
  });

  it("15. cant create a task with a bogus user id", async () => {
    expect.assertions(1);
    const req = httpMocks.createRequest({
      method: "POST",
      body: { title: "first task" },
      user: { id: 99999 }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    try {
      await waitForRouteHandlerCompletion(create, req, saveRes);
    } catch (e) {
      expect(e.name).toBe("PrismaClientKnownRequestError");
    }
  });

  it("16. create succeeds with valid user id", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { title: "first task" },
      user: { id: user1.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(create, req, saveRes);
    expect(saveRes.statusCode).toBe(201);
  });

  it("17. returned object has expected title", () => {
    saveData = saveRes._getJSONData();
    expect(saveData.title).toBe("first task");
  });

  it("18. object has right value for isCompleted", () => {
    expect(saveData.isCompleted).toBe(false);
  });

  it("19. object does not have userId", () => {
    expect(saveData.userId).toBeDefined();
    saveTaskId = saveData.id;
  });
});

describe("test getting created tasks", () => {
  it("20. cant get tasks without user id", async () => {
    expect.assertions(1);
    const req = httpMocks.createRequest({ method: "GET" });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    try {
      await waitForRouteHandlerCompletion(index, req, saveRes);
    } catch (e) {
      expect(e.name).toBe("TypeError");
    }
  });

  it("21. returns 200 with user1 id", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      user: { id: user1.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(index, req, saveRes);
    expect(saveRes.statusCode).toBe(200);
  });

  it("22. returned array has length 1", () => {
    saveData = saveRes._getJSONData();
    expect(saveData.length).toBe(1);
  });

  it("23. title in first array object is as expected", () => {
    expect(saveData[0].title).toBe("first task");
  });

  it("24. first array object does not contain userId", () => {
    expect(saveData[0].userId).toBeDefined();
  });

  it("25. user2 gets 404 for task list", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      user: { id: user2.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(index, req, saveRes);
    expect(saveRes.statusCode).toBe(404);
  });

  it("26. can retrieve created object using show", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      params: { id: saveTaskId.toString() },
      user: { id: user1.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(show, req, saveRes);
    expect(saveRes.statusCode).toBe(200);
  });

  it("27. user2 cant retrieve this task", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      params: { id: saveTaskId.toString() },
      user: { id: user2.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(show, req, saveRes);
    expect(saveRes.statusCode).toBe(404);
  });
});

describe("testing update and delete", () => {
  it("28. user1 can set task to completed", async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { id: saveTaskId.toString() },
      body: { isCompleted: true },
      user: { id: user1.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(update, req, saveRes);
    expect(saveRes.statusCode).toBe(200);
  });

  it("29. user2 cant update this task", async () => {
    const req = httpMocks.createRequest({
      method: "PATCH",
      params: { id: saveTaskId.toString() },
      body: { isCompleted: false },
      user: { id: user2.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(update, req, saveRes);
    expect(saveRes.statusCode).toBe(404);
  });

  it("30. user2 cant delete this task", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: saveTaskId.toString() },
      user: { id: user2.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(deleteTask, req, saveRes);
    expect(saveRes.statusCode).toBe(404);
  });

  it("31. user1 can delete this task", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: saveTaskId.toString() },
      user: { id: user1.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(deleteTask, req, saveRes);
    expect(saveRes.statusCode).toBe(200);
  });

  it("32. retrieving user1 tasks now returns 404", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      user: { id: user1.id }
    });
    saveRes = httpMocks.createResponse({ eventEmitter: EventEmitter });
    await waitForRouteHandlerCompletion(index, req, saveRes);
    expect(saveRes.statusCode).toBe(404);
  });
});