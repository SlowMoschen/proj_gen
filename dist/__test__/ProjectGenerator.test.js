var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        test("should resolve to undefined", () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield projectGenerator.run()).toBeUndefined();
        }));
    });
});
