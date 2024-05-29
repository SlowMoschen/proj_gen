import { test, assert, expect, describe } from "vitest";
import { TemplateGenerator } from "../TemplateGenerator";
test("TemplateGenerator", () => {
    const templateGenerator = new TemplateGenerator();
    assert.isDefined(templateGenerator);
    describe("getHTMLTemplate method", () => {
        test("should return a string", () => {
            const result = templateGenerator.getHTMLTemplate("Test");
            expect(typeof result).toBe("string");
        });
        test("should contain the provided name", () => {
            const name = "Test";
            const result = templateGenerator.getHTMLTemplate(name);
            expect(result).toContain(name);
        });
        test("should contain the HTML structure", () => {
            const result = templateGenerator.getHTMLTemplate("Test");
            expect(result).toContain("<!DOCTYPE html>");
            expect(result).toContain('<html lang="en">');
            expect(result).toContain("<head>");
            expect(result).toContain('<meta charset="UTF-8">');
            expect(result).toContain("<title>Test</title>");
            expect(result).toContain("</head>");
            expect(result).toContain("<body>");
            expect(result).toContain("<h1>Test</h1>");
            expect(result).toContain('<script src="./index.js"></script>');
            expect(result).toContain("</body>");
            expect(result).toContain("</html>");
        });
    });
    describe("getJSIndexTemplate method", () => {
        test("should return a string", () => {
            const result = templateGenerator.getJSIndexTemplate();
            expect(typeof result).toBe("string");
        });
        test("should contain the JavaScript code", () => {
            const result = templateGenerator.getJSIndexTemplate();
            expect(result).toContain('console.log("Hello, World!");');
        });
    });
    describe("getCSSIndexTemplate method", () => {
        test("should return a string", () => {
            const result = templateGenerator.getCSSIndexTemplate();
            expect(typeof result).toBe("string");
        });
        test("should contain the CSS code", () => {
            const result = templateGenerator.getCSSIndexTemplate();
            expect(result).toContain("body {");
            expect(result).toContain("font-family: Arial, sans-serif;");
            expect(result).toContain("display: flex;");
            expect(result).toContain("justify-content: center;");
            expect(result).toContain("align-items: center;");
            expect(result).toContain("height: 100vh;");
            expect(result).toContain("margin: 0;");
            expect(result).toContain("}");
        });
    });
});
