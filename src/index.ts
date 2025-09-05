// Prettier imports
import * as Blockly from "blockly";
import * as Acorn from "prettier/plugins/acorn.js";
import * as Estree from "prettier/plugins/estree.js";
import * as Prettier from "prettier/standalone";

// Blockly
import "./index.css";
import { javascriptGenerator } from "blockly/javascript";

// Block Imports
import * as modifiers from "./blocks/foundry/dice/modifiers";
import * as rolls from "./blocks/foundry/dice/rolls";
import * as terms from "./blocks/foundry/dice/terms";
import * as htmlInput from "./blocks/html/input";
import * as objects from "./blocks/javascript/objects";
import * as random from "./blocks/javascript/random";
import * as text from "./blocks/javascript/text";
import * as button from "./fields/button";
import * as cbutton from "./fields/context_button";
import * as builtins from "./fields/builtins";
import { registerBuiltinInputs } from "./inputs/builtins";
import { toolbox } from "./toolbox";
import * as Workspace from "./workspace";
import "./blocks/other/other";

// Get our target UI elements.
const CODE_DIV = document.getElementById("generatedCode");
const OUTPUT_DIV = document.getElementById("output");
const BLOCKLY_DIV = document.getElementById("blocklyDiv");

if (CODE_DIV == null || OUTPUT_DIV == null || BLOCKLY_DIV == null) {
  throw new Error(`Required HTML elements not found.`);
}

/**
 * Global Setup
 */
function globalSetup() {
  // Register context menu entries
  // Blockly.ContextMenuItems.registerCommentOptions();

  // Register fields.
  button.registerFields();
  cbutton.registerFields();
  builtins.registerFields();

  // Register inputs.
  registerBuiltinInputs();

  // Register blocks.
  objects.registerBlocks();
  random.registerBlocks();
  text.registerBlocks();
  htmlInput.registerBlocks();
  modifiers.registerBlocks();
  rolls.registerBlocks();
  terms.registerBlocks();
}

const workspace = Workspace.createBlocklyWorkspace(BLOCKLY_DIV);

// This function resets the generator and output divs, shows the
// generated code from the workspace, and evaluates the code.
const runCode = async () => {
  let code = javascriptGenerator.workspaceToCode(workspace);

  try {
    code = await Prettier.format(code, {
      parser: "acorn",
      // @ts-expect-error False positive
      plugins: [Acorn, Estree],
    });
  } catch (e) {
    code = (e as object).toString().replace(/^/gmu, "// ");
  }

  CODE_DIV.textContent = code;
  OUTPUT_DIV.innerHTML = "";
  // Eval(generator);
};

// Every time the workspace changes state, save the changes to storage.
workspace.addChangeListener((e: Blockly.Events.Abstract) => {
  // Don't save after UI events (scrolling, zooming, etc.)
  if (e.isUiEvent) return;
  Workspace.save(workspace);
});

// Whenever the workspace changes meaningfully, run the generator again.
workspace.addChangeListener(async (e: Blockly.Events.Abstract) => {
  // Don't run the generator when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the generator during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type === Blockly.Events.FINISHED_LOADING ||
    workspace.isDragging()
  ) {
    return;
  }

  await runCode();
});

// Load the initial state from storage and run the generator.
globalSetup();
Workspace.restore(workspace);
workspace.getToolbox()?.render(toolbox);
