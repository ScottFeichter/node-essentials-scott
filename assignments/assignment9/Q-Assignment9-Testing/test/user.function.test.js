require("dotenv").config();
const request = require("supertest");
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const prisma = require("../prisma/db");
let agent;
let saveRes;
const { app, server } = require("../app");

beforeAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  agent = request.agent(app);
});

afterAll(async () => {
  prisma.$disconnect();
  server.close();
});

describe("register a user", () => {
  it("46. it creates the user entry", async () => {
    const newUser = {
      name: "John Deere",
      email: "jdeere@example.com",
      password: "Pa$$word20",
    };
    saveRes = await agent.post("/user").send(newUser);
    expect(saveRes.status).toBe(201);
  });

  it("47. registration returns object with expected name", () => {
    expect(saveRes.body.user.name).toBe("John Deere");
  });

  it("48. returned object includes csrfToken", () => {
    expect(saveRes.body.csrfToken).toBeDefined();
  });

  it("49. can logon as newly registered user", async () => {
    const loginData = {
      email: "jdeere@example.com",
      password: "Pa$$word20",
    };
    const res = await agent.post("/user/logon").send(loginData);
    expect(res.status).toBe(200);
    saveRes = res;
  });

  it("50. can logoff", async () => {
    const csrfToken = saveRes.body.csrfToken;
    const res = await agent
      .post("/user/logoff")
      .set("X-CSRF-TOKEN", csrfToken);
    expect(res.status).toBe(200);
  });
});