const { userSchema } = require("../validation/userSchema");
const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

describe("user object validation tests", () => {
  it("1. doesn't permit a trivial password", () => {
    const { error } = userSchema.validate(
      { name: "Bob", email: "bob@sample.com", password: "password" },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "password"),
    ).toBeDefined();
  });

  it("2. requires that an email be specified", () => {
    const { error } = userSchema.validate(
      { name: "Bob", password: "Pa$$word20" },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "email"),
    ).toBeDefined();
  });

  it("3. does not accept an invalid email", () => {
    const { error } = userSchema.validate(
      { name: "Bob", email: "invalid-email", password: "Pa$$word20" },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "email"),
    ).toBeDefined();
  });

  it("4. requires a password", () => {
    const { error } = userSchema.validate(
      { name: "Bob", email: "bob@sample.com" },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "password"),
    ).toBeDefined();
  });

  it("5. requires name", () => {
    const { error } = userSchema.validate(
      { email: "bob@sample.com", password: "Pa$$word20" },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "name"),
    ).toBeDefined();
  });

  it("6. name must be valid (3 to 30 characters)", () => {
    const { error } = userSchema.validate(
      { name: "Bo", email: "bob@sample.com", password: "Pa$$word20" },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "name"),
    ).toBeDefined();
  });

  it("7. validation succeeds with valid user object", () => {
    const { error } = userSchema.validate(
      { name: "Bob", email: "bob@sample.com", password: "Pa$$word20" },
      { abortEarly: false },
    );
    expect(error).toBeFalsy();
  });
});

describe("task schema validation tests", () => {
  it("8. requires a title", () => {
    const { error } = taskSchema.validate(
      { isCompleted: false },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "title"),
    ).toBeDefined();
  });

  it("9. isCompleted value must be valid if specified", () => {
    const { error } = taskSchema.validate(
      { title: "Test task", isCompleted: "invalid" },
      { abortEarly: false },
    );
    expect(
      error.details.find((detail) => detail.context.key == "isCompleted"),
    ).toBeDefined();
  });

  it("10. provides default false for isCompleted if not specified", () => {
    const { error, value } = taskSchema.validate(
      { title: "Test task" },
      { abortEarly: false },
    );
    expect(error).toBeFalsy();
    expect(value.isCompleted).toBe(false);
  });

  it("11. preserves true value for isCompleted", () => {
    const { error, value } = taskSchema.validate(
      { title: "Test task", isCompleted: true },
      { abortEarly: false },
    );
    expect(error).toBeFalsy();
    expect(value.isCompleted).toBe(true);
  });
});

describe("patch task schema validation tests", () => {
  it("12. does not require a title", () => {
    const { error } = patchTaskSchema.validate(
      { isCompleted: true },
      { abortEarly: false },
    );
    expect(error).toBeFalsy();
  });

  it("13. isCompleted remains undefined if not provided", () => {
    const { error, value } = patchTaskSchema.validate(
      { title: "Updated task" },
      { abortEarly: false },
    );
    expect(error).toBeFalsy();
    expect(value.isCompleted).toBeUndefined();
  });
});