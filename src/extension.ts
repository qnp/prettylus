// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as prettier from 'prettier';
import * as stylusSupremacy from 'stylus-supremacy';
import type { FormattingOptions as StylusFormattingOptions } from 'stylus-supremacy';

interface ExtensionOptions {
  stylusSupremacyConfigFileName?: string;
}

const extensionOptions: ExtensionOptions = {
  stylusSupremacyConfigFileName: '.stylusrc',
};

class Formatter implements vscode.DocumentFormattingEditProvider {
  private extensionOptions: ExtensionOptions;

  constructor() {
    this.extensionOptions = extensionOptions;
  }

  configure() {
    // Nothing to configure yet
    const config = vscode.workspace.getConfiguration('prettylus');
    for (let name in extensionOptions) {
      if (config.has(name)) {
        this.extensionOptions[name as keyof ExtensionOptions] = config.get(name);
      }
    }
  }

  private findConfigFileOptions(
    document: vscode.TextDocument,
    rootPath?: string,
    configFileName?: string
  ): object {
    let configFilePath = null;

    // Skip if there is no working directories (anonymous window) or no config file name
    if (rootPath !== undefined && configFileName !== undefined) {
      if (
        document.isUntitled === false &&
        document.fileName.startsWith(rootPath)
      ) {
        // Find config file starting from the current active document up to the working directory
        const pathList = document.fileName
          .substring(rootPath.length)
          .split(/(\\|\/)/)
          .filter((path) => path.length > 0);
        pathList.pop(); // Remove the file name
        while (pathList.length >= 0) {
          const workPath = path.join(rootPath, ...pathList, configFileName);
          if (fs.existsSync(workPath)) {
            configFilePath = workPath;
            break;
          } else if (pathList.length === 0) {
            break;
          }
          pathList.pop();
        }
      } else {
        // Find config file in the working directory
        const workPath = path.join(rootPath, configFileName);
        if (fs.existsSync(workPath) === false) {
          configFilePath = workPath;
        }
      }
    }
    // Read config file and convert it to an options object
    if (configFilePath) {
      try {
        return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
      } catch (ex) {
        vscode.window.showWarningMessage(
          'Malformed JSON in config file: ' + configFilePath
        );
        console.error(ex);
      }
    }
    return {};
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this.format(document, options, token);
  }

  private format(
    document: vscode.TextDocument,
    documentOptions: vscode.FormattingOptions,
    cancellationToken?: vscode.CancellationToken
  ): vscode.TextEdit[] | null {
    const rootDirx = vscode.workspace.getWorkspaceFolder(document.uri);
    const rootPath = rootDirx ? rootDirx.uri.fsPath : undefined;

    try {
      const range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);

      // Get prettier config using builtin prettier resolver
      const resolvedPrettierConfig = rootPath
        ? prettier.resolveConfig.sync(rootPath)
        : {};

      const prettierOptions: prettier.Options = {
        ...resolvedPrettierConfig,
        parser: 'vue',
      };

      // Apply prettier to the full text (it will handle pug template and script)
      const text = document.getText(range);
      let outputContent = prettier.format(text, prettierOptions);

      // Get stylusrc options and create full formatting options object
      const resolvedStylusConfig = this.findConfigFileOptions(
        document,
        rootPath,
        extensionOptions.stylusSupremacyConfigFileName
      ) as StylusFormattingOptions;

      const stylusSupremacyOptions: StylusFormattingOptions = {
        ...resolvedStylusConfig,
        tabStopChar: documentOptions.insertSpaces
          ? ' '.repeat(documentOptions.tabSize)
          : '\t',
        newLineChar: document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n',
      };

      // Select text that is contained between <style lang="stylus"> and </style>
      const startStyleMatch = text.match(/<style\s+lang="stylus"\s*>/);
      const startStyleTag = startStyleMatch?.[0];
      const startStyle = startStyleMatch?.index;
      if (startStyleTag && startStyle) {
        const endStyle = text.indexOf('</style>');
        const rangeStyle = new vscode.Range(
          document.positionAt(startStyle + startStyleTag.length),
          document.positionAt(endStyle)
        );
        const style = document.getText(rangeStyle);
        const formattedStyle = stylusSupremacy.format(
          style,
          stylusSupremacyOptions
        );
        outputContent = outputContent.replace(style, formattedStyle);
      }

      if (
        (cancellationToken &&
          cancellationToken.isCancellationRequested === true) ||
        outputContent.length === 0
      ) {
        return null;
      } else {
        return [vscode.TextEdit.replace(range, outputContent)];
      }
    } catch (ex: any) {
      vscode.window.showWarningMessage(ex.message);
      console.error(ex);
      return null;
    }
  }
}

const formatter = new Formatter();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Initialize settings
  formatter.configure();

  // Update settings
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(() => {
      formatter.configure();
    })
  );

  // Subscribe "format document" event
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('vue', formatter)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
