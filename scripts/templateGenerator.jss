#!/usr/bin/env node
"use strict";
import fs from "fs";
import path from "path";
import readline from "readline";
import Handlebars from "handlebars";

const HELP_TEXT =
  "Usage: node template-generator.js <templateFile> <outputFile> <key=value>...";

const RL = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//// Parse Command-line Arguments ////
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error(HELP_TEXT);
  process.exit(1);
}

const templateFile = args[0];
const outputFileTemplate = args[1];
const contextPairs = Object.fromEntries(
  args.slice(2).map(pair => pair.split("=", 2)),
);

//// Parse Template File ////

// Check if the template file exists.
if (!fs.existsSync(templateFile)) {
  console.error(`Error: Template file "${templateFile}" does not exist.`);
  process.exit(1);
}

// Read the template file sections
const templateSections = fs
  .readFileSync(templateFile, "utf-8")
  .split(/^---+$/gm, 2);

const declaredVariables = templateSections[0].split(/\r?\n/);
const declaredTemplate = templateSections[1];

//// Build Template Context ////
let rootContext = { ...contextPairs };
for (const declaredVariable of declaredVariables) {
  if ((!declaredVariable) in rootContext) {
    rootContext[declaredVariable] = await promptForVariable(declaredVariable);
  }
}

//// Compile & Run Templates ////
// Evaluate output file name as a Handlebars template
const outputFileName = Handlebars.compile(outputFileTemplate)(rootContext);
const outputFilePath = path.resolve(process.cwd(), outputFileName);

const renderTemplate = Handlebars.compile(declaredTemplate);

console.log(rootContext);
const content = renderTemplate(rootContext);

process.stdout.write(content);
