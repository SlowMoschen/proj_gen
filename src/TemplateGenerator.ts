export class TemplateGenerator {
  public getHTMLTemplate(name: string): string {
    return `<!DOCTYPE html>
        <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${name}</title>
            </head>
            <body>
              <h1>${name}</h1>
              <script src="./index.js"></script>
            </body>
        </html>`;
  }

  public getJSIndexTemplate(): string {
    return `console.log("Hello, World!");`;
  }

  public getCSSIndexTemplate(): string {
    return `body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }`;
  }

  public getTsConfigTemplate(): string {
    return `{
        "compilerOptions": {
            "target": "es5",
            "module": "commonjs",
            "strict": true,
            "esModuleInterop": true,
            "outDir": "./dist"
        }
    }`;
  }
}
