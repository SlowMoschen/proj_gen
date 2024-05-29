var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import inquirer from "inquirer";
import { program } from "commander";
import fs from "fs";
import { TemplateGenerator } from "./TemplateGenerator.js";
import { exec } from "child_process";
import { EXPRESS_COMMAND, POST_INSTALL_COMMANDS, REACT_COMMAND, pathPrompt, projectNamePrompt, projectTypePrompt, } from "./config.js";
export class ProjectGenerator {
    constructor() {
        this.spinner = ora("Generating project");
        this.templateGenerator = new TemplateGenerator();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            program.version("0.0.1").description("Generate different types of JavaScript projects");
            program.action(() => __awaiter(this, void 0, void 0, function* () {
                this.drawHeader();
                let name, path, type;
                while (!name)
                    name = yield this.promptUser(projectNamePrompt);
                while (!type)
                    type = yield this.promptUser(projectTypePrompt);
                while (!path) {
                    path = yield this.promptUser(pathPrompt);
                    if (!path) {
                        path = process.cwd();
                    }
                    else {
                        const isPathValid = yield this.isPathValid(path);
                        if (!isPathValid) {
                            path = undefined;
                        }
                    }
                }
                this.spinner.start();
                yield this.generateProject(type, name, path);
                yield this.runPostInstallScripts(`${path}/${name}`);
                this.spinner.succeed(chalk.green("Project generated successfully"));
            }));
            program.parse(process.argv);
        });
    }
    drawHeader() {
        console.log(chalk.yellow(figlet.textSync("Proj-Gen", { horizontalLayout: "full" })));
    }
    promptUser(prompObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.clear();
            this.drawHeader();
            const answer = yield inquirer.prompt(prompObject);
            return answer[Object.keys(answer)[0]];
        });
    }
    isPathValid(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => fs.access(path, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(chalk.red("Invalid path"));
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            }));
        });
    }
    generateProject(type, name, path) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createProjectDirectory(`${path}/${name}`);
            yield this.createProjectFiles(type, name, path);
        });
    }
    createProjectDirectory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.mkdirSync(path, { recursive: true });
        });
    }
    createProjectFiles(type, name, path) {
        return new Promise((resolve, reject) => {
            switch (type) {
                case "Vanilla":
                    this.generateVanillaProject(name, path).then(() => resolve());
                    break;
                case "Express":
                    this.generateExpressProject(name, path).then(() => resolve());
                    break;
                case "React":
                    this.generateReactProject(name, path).then(() => resolve());
                    break;
                default:
                    reject("Invalid project type");
            }
        });
    }
    generateVanillaProject(name, path) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.spinner.stop();
            const isTsProj = yield this.promptUser({
                type: "confirm",
                name: "isTsProject",
                message: "Would you like to create a TypeScript project?",
            });
            this.spinner.start();
            if (isTsProj) {
                const tsConfigTemplate = this.templateGenerator.getTsConfigTemplate();
                fs.writeFileSync(`${path}/${name}/tsconfig.json`, tsConfigTemplate);
            }
            const htmlTemplate = this.templateGenerator.getHTMLTemplate(name);
            const jsIndexTemplate = this.templateGenerator.getJSIndexTemplate();
            const cssIndexTemplate = this.templateGenerator.getCSSIndexTemplate();
            const dirPath = `${path}/${name}`;
            fs.writeFileSync(`${dirPath}/index.html`, htmlTemplate);
            fs.writeFileSync(`${dirPath}/index${isTsProj ? ".ts" : ".js"}`, jsIndexTemplate);
            fs.writeFileSync(`${dirPath}/index.css`, cssIndexTemplate);
            resolve();
        }));
    }
    generateExpressProject(name, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                exec(`${EXPRESS_COMMAND} ${name}`, { cwd: path }, (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    generateReactProject(name, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.spinner.stop();
                const answer = yield inquirer.prompt({
                    type: "confirm",
                    name: "isTsProject",
                    message: "Would you like to create a TypeScript project?",
                });
                this.spinner.start();
                const executeCommand = `${REACT_COMMAND} ${name} -- --template ${answer.isTsProject ? "react-ts" : "react"}`;
                exec(executeCommand, { cwd: path }, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            }));
        });
    }
    runPostInstallScripts(path) {
        return new Promise((resolve, reject) => {
            exec(POST_INSTALL_COMMANDS.join(" && "), { cwd: path }, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }
}
