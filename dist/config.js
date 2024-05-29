export const POST_INSTALL_COMMANDS = ["npm init -y", "npm install", "npx prettier --write ."];
export const EXPRESS_COMMAND = "npx express-generator --no-view";
export const REACT_COMMAND = "npm create vite@latest";
const PROJECT_TYPES = ["Vanilla", "React", "Express"];
export const pathPrompt = {
    type: "input",
    name: "projectPath",
    prefix: "Path: ",
    message: "Where do you want to generate the project? (empty for current directory) \n",
    suffix: "Please provide an absolute path. (e.g. C:/Users/username/Desktop) \n",
};
export const projectTypePrompt = {
    type: "list",
    name: "projectType",
    prefix: "Project type:",
    message: "What type of project do you want to generate? \n",
    choices: PROJECT_TYPES,
};
export const projectNamePrompt = {
    type: "input",
    prefix: "Project name: ",
    name: "projectName",
    message: "What is the project name? \n",
};
