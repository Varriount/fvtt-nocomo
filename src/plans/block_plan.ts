import { Block, Blocks, Field, FieldLabel, Input } from "blockly/core";
import { ConnectionState, State } from "blockly/core/serialization/blocks";
import { BlockInfo } from "blockly/core/utils/toolbox";
import { JavascriptGenerator, javascriptGenerator } from "blockly/javascript";
import { stmtCode, valueCode } from "../codegen";
import { localize } from "../localization";
import { toolbox, ToolboxCategoryName } from "../toolbox";
import { colourViaStringHash, isString, tokenizeMessage } from "../utils";
import { CodeGenerationFunction } from "./code_plan";
import { FieldPlan, FieldPlanData } from "./field_plan";
import {
  createDummyInput,
  InputPlan,
  InputPlanData,
  ShadowInputValue,
} from "./input_plan";
import { OutputPlan, OutputPlanData } from "./output_plan";

/**
 * Localization Keys
 * =================
 *
 * {{block_name}}.MESSAGE
 * {{block_name}}.HORIZONTAL_MESSAGE
 * {{block_name}}.VERTICAL_MESSAGE
 * {{block_name}}.COLLAPSED_MESSAGE
 */

/**
 * Represents the semantic construct that a block represents.
 *   "value":
 *       A value block (a block that returns a value).
 *   "statement":
 *       A statement block (a block that doesn't return a value).
 *   "value_and_statement":
 *       Represents a block that acts as both a value and a statement.
 */
export type BlockKind = "value" | "statement" | "value_and_statement";

/**
 * Represents the possible orientations of a block.
 *   "horizontal": Blocks are laid out horizontally.
 *   "vertical": Blocks are laid out vertically.
 */
export type BlockOrientation = "horizontal" | "vertical";

/**
 * The data required to construct a `BlockPlan` object.
 * Encapsulates block-specific configuration, its orientation, and its variants.
 */
export type BlockPlanData = {
  /**
   * The name of the block.
   */
  name: string;

  /**
   * What type of language construct the block represents (value or
   * statement).
   */
  kind: BlockKind;

  /**
   * The initial orientation of the block when it is first created by the user.
   */
  orientation?: BlockOrientation;

  /**
   * The categories within the toolbox where this block belongs.
   */
  categories?: ToolboxCategoryName[];

  /**
   * The inputs the block has.
   */
  inputs?: InputPlanData[];

  /**
   * The fields the block has.
   */
  fields?: FieldPlanData[];

  /**
   * Data describing the values this variant outputs.
   */
  output?: OutputPlanData | string;
  outputs?: string[];

  /**
   * A function or string to generate code from.
   */
  toCode?: CodeGenerationFunction | string;

  /**
   * Lifecycle hook that is run whenever an instance of this block is
   * constructed.
   */
  onCreate?: (this: Block) => void;

  /**
   * Lifecycle hook that is run whenever the workspace is updated.
   */
  onWorkspaceUpdate?: (this: Block, event: any) => void;

  // Temporary fields
  colour?: number;
};

class __BPBlock extends Block {
  generator?: CodeGenerationFunction;
}

/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/

// TODO Allow various properties to be functions, called when appropriate.
// TODO Fix handling of fields where defaultValue is not serialized value.
export class BlockPlan {
  name: string;
  kind: BlockKind;
  orientation?: BlockOrientation;
  categories: ToolboxCategoryName[];

  inputs: Map<string, InputPlan>;
  fields: Map<string, FieldPlan>;
  output?: OutputPlan;
  colour: number | string;

  toCode?: CodeGenerationFunction;

  onCreate?: (this: Block) => void;
  onWorkspaceUpdate?: (this: Block, event: any) => void;

  message: string | null;
  tooltip: string | null;
  helpURL: string | null;

  constructor(data: BlockPlanData) {
    this.name = data.name;
    this.kind = data.kind;
    this.orientation = data.orientation ?? "horizontal";
    this.categories = data.categories ?? [];
    this.colour = data.colour ?? colourViaStringHash(this.name);
    this.toCode = isString(data.toCode)
      ? this.kind === "value"
        ? valueCode(data.toCode)
        : stmtCode(data.toCode)
      : data.toCode;

    this.message = localize(`${this.name}.MESSAGE`);
    this.tooltip = localize(`${this.name}.TOOLTIP`);
    this.helpURL = localize(`${this.name}.HELP_URL`);

    this.onCreate = data.onCreate;
    this.onWorkspaceUpdate = data.onWorkspaceUpdate;

    // Extract and normalize the variant's output information.
    this.output = new OutputPlan(data.output);

    // Create proper maps from the field and input lists.
    this.inputs = new Map();
    if (data.inputs) {
      for (const inputData of data.inputs) {
        this.inputs.set(inputData.name, new InputPlan(inputData));
      }
    }

    this.fields = new Map();
    if (data.fields) {
      for (const fieldData of data.fields) {
        this.fields.set(fieldData.name, new FieldPlan(fieldData));
      }
    }
  }

  defineBlock() {
    // Define the block definition used when creating new `Block` instances.
    const blockPlan = this;
    Blocks[this.name] = {
      init(this: Block) {
        blockPlan.initializeBlock(this);
      },
    };

    // Define the code generator used for the new `Block` instances.
    javascriptGenerator.forBlock[this.name] = function (
      block: __BPBlock,
      generator: JavascriptGenerator,
    ) {
      const f = block.generator ?? (() => "");
      return f(block, generator);
    };
  }

  initializeBlock(block: __BPBlock) {
    // Set basic block properties.
    block.setTooltip("");
    block.setHelpUrl("");
    block.setColour(this.colour);

    switch (this.orientation) {
      case "vertical":
        block.setInputsInline(false);
        break;
      case "horizontal":
        block.setInputsInline(true);
        break;
      default:
        break;
    }

    // Set the block's line of inputs and fields.
    this.setBlockInputsAndFields(block);

    // Set the block's output type.
    const hasOutput = !!this.output;
    const outputTypes = this.output?.types;

    if (this.kind === "statement") {
      block.setOutput(false);
      block.setNextStatement(hasOutput, outputTypes);
      block.setPreviousStatement(hasOutput, outputTypes);
    } else {
      block.setOutput(hasOutput, outputTypes);
      block.setNextStatement(false);
      block.setPreviousStatement(false);
    }

    // Set the block's generator
    block.generator = this.toCode;

    // Attach the onWorkspaceUpdate lifecycle hook
    if (this.onWorkspaceUpdate) {
      block.setOnChange(this.onWorkspaceUpdate);
    }

    // Run the onCreate lifecycle hook
    if (this.onCreate) {
      this.onCreate.apply(block);
    }
  }
  private setBlockInputsAndFields(block: Block) {
    const fieldPlans = this.fields;
    const inputPlans = this.inputs;

    const inputMap = new Map<string, Input>();
    for (const [name, plan] of inputPlans) {
      inputMap.set(name, plan.createInput(block));
    }

    const fieldMap = new Map<string, Field>();
    for (const [name, plan] of fieldPlans) {
      fieldMap.set(name, plan.createField(block));
    }

    // Buffer for collecting field data that will later be appended to inputs.
    let fieldBuffer: Field[] = [];

    // Helper function to append all buffered fields to the given input,
    // attach the input to the block, then clear the buffer.
    function drainFieldBufferInto(input: Input) {
      fieldBuffer.forEach(f => input.appendField(f, f.name));
      fieldBuffer = [];
    }

    const message = this.message ?? this.synthesizeDefaultMessage();
    for (const [tokenKind, token] of tokenizeMessage(message)) {
      switch (tokenKind) {
        // Turn text outside parameter interpolations into label fields.
        case "text": {
          const label = new FieldLabel(token);
          fieldBuffer.push(label);
          continue;
        }

        // Turn newlines into dummy inputs, to simulate line breaks.
        case "newline": {
          const input = createDummyInput(block);
          drainFieldBufferInto(input);
          block.appendInput(input);
          continue;
        }

        // Turn parameter references into either inputs or fields.
        case "parameterName": {
          // If the parameter is an input plan, initialize an input from it,
          // add any buffered fields to it, then append it to the block.
          const input = inputMap.get(token);
          if (input != null) {
            drainFieldBufferInto(input);
            block.appendInput(input);
            continue;
          }

          // If the parameter is a field plan, initialize a field and
          // add it to the field buffer.
          const field = fieldMap.get(token);
          if (field != null) {
            fieldBuffer.push(field);
            continue;
          }

          // Throw an error if neither an input nor a field was found.
          throw new Error(`No such input or field: ${token}`);
        }

        default:
          throw new Error(`Unhandled token kind: ${tokenKind}`);
      }
    }

    // If any fields are left in the field buffer, create a DummyInput to
    // attach them to.
    if (fieldBuffer.length > 0) {
      const input = createDummyInput(block);
      drainFieldBufferInto(input);
      block.appendInput(input);
    }
  }

  defineToolboxEntry() {
    // TODO: Move to toolbox class/module
    const toolboxEntry = this.generateToolboxEntry();
    console.log(289, toolboxEntry);

    const remainingNames = new Set<string>(this.categories);

    for (const existingCategory of toolbox.contents) {
      // Skip toolbox entries that aren't categories
      if (!("contents" in existingCategory) || !("name" in existingCategory)) {
        continue;
      }

      //
      const matches = remainingNames.has(existingCategory.name);
      if (!matches) {
        continue;
      }

      existingCategory.contents ??= [];
      existingCategory.contents.push(toolboxEntry);

      remainingNames.delete(existingCategory.name as string);

      if (remainingNames.size === 0) {
        break;
      }
    }
    for (const name of remainingNames) {
      toolbox.contents.push({
        kind: "category",
        name: name,
        contents: [toolboxEntry],
        colour: colourViaStringHash(name),
      });
    }
  }

  private synthesizeDefaultMessage(): string {
    const messageParts: string[] = [];

    // Add block name.
    messageParts.push(`${this.name}\n`);

    // Add fields to the message.
    for (const [name] of this.fields) {
      messageParts.push(`  ${name}: %{${name}}\n`);
    }

    // Add inputs to the message.
    for (const [name] of this.inputs) {
      messageParts.push(`  ${name}: %{${name}}`);
    }

    return messageParts.join("").trim();
  }

  /**
   * Populates a BlockInfo object with fields and inputs from provided sources.
   */
  private _buildBlockInfoContents(
    name: string,
    fieldSource: any,
    inputSource: any,
  ): State {
    // Handle fields with default values.
    const fields: Record<string, unknown> = {};
    for (const fieldPlan of fieldSource) {
      if (fieldPlan.default !== undefined) {
        fields[fieldPlan.name] = fieldPlan.default;
      }
    }

    // Handle inputs with default values (shadow blocks).
    const inputs: Record<string, ConnectionState> = {};
    for (const inputPlan of inputSource) {
      if (inputPlan.shadow) {
        inputs[inputPlan.name] = this.createShadowBlockInfo(inputPlan.shadow);
      }
    }

    return {
      type: name,
      fields: fields,
      inputs: inputs,
    };
  }

  /**
   * Recursively creates a BlockInfo object for a shadow block.
   * Now simplified to call the helper method.
   */
  private createShadowBlockInfo(
    defaultValue: Omit<ShadowInputValue, "name">,
  ): ConnectionState {
    return {
      shadow: this._buildBlockInfoContents(
        defaultValue.block,
        defaultValue.fields || [],
        defaultValue.inputs || [],
      ),
    };
  }

  /**
   * Generates a Blockly toolbox entry for the block.
   * Now simplified to call the helper method.
   */
  generateToolboxEntry(): BlockInfo {
    const x = {
      kind: "block",
      ...this._buildBlockInfoContents(
        this.name,
        this.fields.values(),
        this.inputs.values(),
      ),
    };
    return x;
  }
}
