import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import inquirer, { PromptModule, QuestionCollection } from "inquirer";
import { program } from "commander";
import fs from "fs";
import { TemplateGenerator } from "./TemplateGenerator.js";
import { exec } from "child_process";
import {
  EXPRESS_COMMAND,
  POST_INSTALL_COMMANDS,
  REACT_COMMAND,
  pathPrompt,
  projectNamePrompt,
  projectTypePrompt,
} from "./config.js";

export class ProjectGenerator {
  private readonly spinner = ora("Generating project");
  private readonly templateGenerator = new TemplateGenerator();

  public async run(): Promise<void> {
    program.version("0.0.1").description("Generate different types of JavaScript projects");

    program.action(async () => {
      this.drawHeader();

      let name, path, type;

      while (!name) name = await this.promptUser(projectNamePrompt);
      while (!type) type = await this.promptUser(projectTypePrompt);

      while (!path) {
        path = await this.promptUser(pathPrompt);
        if (!path) {
          path = process.cwd();
        } else {
          const isPathValid = await this.isPathValid(path);
          if (!isPathValid) {
            path = undefined;
          }
        }
      }

      this.spinner.start();
      await this.generateProject(type, name, path);
      await this.runPostInstallScripts(`${path}/${name}`);

      this.spinner.succeed(chalk.green("Project generated successfully"));
    });

    program.parse(process.argv);
  }

  private drawHeader(): void {
    console.log(chalk.yellow(figlet.textSync("Proj-Gen", { horizontalLayout: "full" })));
  }

  private async promptUser(prompObject: QuestionCollection): Promise<string> {
    console.clear();
    this.drawHeader();
    const answer = await inquirer.prompt(prompObject);
    return answer[Object.keys(answer)[0]];
  }

  private async isPathValid(path: string): Promise<boolean> {
    return new Promise((resolve) =>
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(chalk.red("Invalid path"));
          resolve(false);
        } else {
          resolve(true);
        }
      })
    );
  }

  private async generateProject(type: string, name: string, path: string): Promise<void> {
    await this.createProjectDirectory(`${path}/${name}`);
    await this.createProjectFiles(type, name, path);
  }

  private async createProjectDirectory(path: string): Promise<void> {
    fs.mkdirSync(path, { recursive: true });
  }

  private createProjectFiles(type: string, name: string, path: string): Promise<void> {
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

  private generateVanillaProject(name: string, path: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.spinner.stop();

      const isTsProj = await this.promptUser({
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
    });
  }

  private async generateExpressProject(name: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`${EXPRESS_COMMAND} ${name}`, { cwd: path }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private async generateReactProject(name: string, path: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.spinner.stop();
      const answer = await inquirer.prompt({
        type: "confirm",
        name: "isTsProject",
        message: "Would you like to create a TypeScript project?",
      });

      this.spinner.start();

      const executeCommand = `${REACT_COMMAND} ${name} -- --template ${
        answer.isTsProject ? "react-ts" : "react"
      }`;

      exec(executeCommand, { cwd: path }, (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  private runPostInstallScripts(path: string): Promise<void> {
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
