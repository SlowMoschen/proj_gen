import { test, assert, expect, describe } from "vitest";
import { ProjectGenerator } from "../ProjectGenerator";

test("ProjectGenerator", () => {
  const projectGenerator = new ProjectGenerator();

  assert.isDefined(projectGenerator);

  describe("run method", () => {
    test("should be a function", () => {
      assert.isFunction(projectGenerator.run);
    });

    test("should return a promise", () => {
      expect(projectGenerator.run()).toBeInstanceOf(Promise);
    });

    test("should resolve to undefined", async () => {
      expect(await projectGenerator.run()).toBeUndefined();
    });
  });
});
