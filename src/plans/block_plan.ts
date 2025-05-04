import { Block, Blocks } from "blockly";
import { JavascriptGenerator, javascriptGenerator } from "blockly/javascript";
import { colourFromString } from "../utils";
import { toolbox, ToolboxCategoryName } from "../toolbox";
import { BlockInfo } from "blockly/core/utils/toolbox";
import { ConnectionState, State } from "blockly/core/serialization/blocks";
import { BlockDefinition } from "blockly/core/blocks";
import {
  BlockVariantBranchPlan,
  BlockVariantBranchPlanData,
  BlockVariantLeaf,
  BlockVariantLeafPlan,
  BlockVariantLeafPlanData,
  BlockVariantPlan,
} from "./block_variant_plan";
import { InputPlanData } from "./input_plan";
import { FieldPlanData } from "./field_plan";
import { CodeGenerationFunction } from "./code_plan";
import { OutputPlanData } from "./output_plan";
import { SetColourStep } from "./block_plan_steps/set_colour_step";

/**
 * Represents kinds of blocks that can be created.
 *   'value':
 *       A value block (a block that returns a value).
 *   'statement':
 *       A statement block (a block that does not return a value, and can be
 *       placed.
 *   'value_and_statement':
 *       Represents a block that acts as both a value and a
 * statement.
 */
export type BlockKind = "value" | "statement" | "value_and_statement";

/**
 * Represents the possible orientations of a block.
 * 'horizontal' - Blocks are laid out horizontally.
 * 'vertical' - Blocks are laid out vertically.
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
   * Inherited by child variants.
   */
  output?: OutputPlanData | string;
  outputs?: string[];

  /**
   * A function to generate code for this variant.
   * Inherited by child variants.
   */
  generator?: CodeGenerationFunction;

  /**
   * The possible variations of this block.
   */
  variants?: (BlockVariantBranchPlanData | BlockVariantLeafPlanData)[];

  // Temporary fields
  colour?: number;
  // message: string;
};

export abstract class BlockPlanStep {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(data: BlockPlanData) {}
  abstract initializeBlock(block: Block): void;
}

/*****************************************************************************/
/*****************************************************************************/
/*****************************************************************************/

export const BLOCK_PLAN_STEP_CLASSES = [SetColourStep];

export class BlockPlan {
  name: string;
  kind: BlockKind;
  orientation?: BlockOrientation;
  categories: ToolboxCategoryName[];

  variants: BlockVariantPlan;
  steps: BlockPlanStep[];

  constructor(data: BlockPlanData) {
    this.steps = BLOCK_PLAN_STEP_CLASSES.map(clazz => new clazz(data));

    // TODO: Smart orientation selection based on input count.
    this.name = data.name;
    this.kind = data.kind;
    this.orientation = data.orientation ?? "horizontal";
    this.categories = data.categories ?? [];

    // Synthesize a variant root
    if (data.variants == null || data.variants.length === 0) {
      this.variants = new BlockVariantLeafPlan({
        name: this.name,
        inputs: data.inputs,
        fields: data.fields,
        output: data.output,
        outputs: data.outputs,
        generator: data.generator,
      });
    } else {
      this.variants = new BlockVariantBranchPlan({
        name: this.name,
        inputs: data.inputs,
        fields: data.fields,
        output: data.output,
        outputs: data.outputs,
        generator: data.generator,
        variants: data.variants,
      });
    }
  }

  defineBlock() {
    Blocks[this.name] = this.generateBlockDefinition();
    javascriptGenerator.forBlock[this.name] = (
      block: Block,
      generator: JavascriptGenerator,
    ) => {
      // @ts-expect-error TODO
      console.log(block.generator);
      // @ts-expect-error TODO
      return block.generator(block, generator);
    };
  }

  generateBlockDefinition(): BlockDefinition {
    const blockPlan = this;
    return {
      init(this: Block) {
        blockPlan.initializeBlock(this);
      },
    };
  }

  initializeBlock(block: Block) {
    for (const step of this.steps) {
      step.initializeBlock(block);
    }

    // Set basic block properties.
    block.setTooltip("");
    block.setHelpUrl("");

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

    // Create the variant tree to store the block's variation state.
    const variants = this.variants.constructVariant(block);
    const leaf = variants.getActiveLeaf();
    this.configureBlock(block, leaf);

    // Trigger the variant to update the block.
    // @ts-expect-error TODO
    block.variants = variants;
  }

  private configureBlock(block: Block, leaf: BlockVariantLeaf) {
    // Set the block's line of inputs and fields.
    block.inputList.length = 0;

    for (const [input, fields] of leaf.line) {
      input.fieldRow.length = 0;
      for (const field of fields) {
        // NOTE: `appendField` also sets `field.name`, so `field.name` MUST be
        // a valid value before this.
        input.appendField(field, field.name);
      }
      block.appendInput(input);
    }

    // Set the block's output type.
    const hasOutput = !!leaf.output;
    const outputTypes = leaf.output?.types;

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
    // @ts-expect-error TODO
    block.generator = leaf.generator;
  }
  // setBlockFlowType(block: Block) {
  //   switch (this.type) {
  //     // If the block is an value, enable output with the specified output
  //     // accepts.
  //     case "value":
  //       block.setOutput(true, this.output?.types);
  //       break;
  //
  //     // If the block is a statement, set up connections to previous and next
  //     // statements.
  //     case "statement":
  //       block.setPreviousStatement(true);
  //       block.setNextStatement(true);
  //       break;
  //
  //     // If the block is both an value and statement, enable output and
  //     // set up statement connections.
  //     case "value_statement":
  //       block.setOutput(true, this.output?.types);
  //       block.setPreviousStatement(true);
  //       block.setNextStatement(true);
  //       break;
  //   }
  // }

  defineToolboxEntry() {
    // TODO: Move to toolbox class/module
    const toolboxEntry = this.generateToolboxEntry();

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
      console.log("Category hue", colourFromString(name));
      toolbox.contents.push({
        kind: "category",
        name: name,
        contents: [toolboxEntry],
        colour: colourFromString(name),
      });
    }
  }

  generateToolboxEntry(): BlockInfo {
    // Construct the toolbox entry for the block.
    let result = this.generateBlockState() as BlockInfo;
    result ??= {
      type: this.name,
      kind: "block",
    };
    result.kind = "block";

    return result;
  }

  generateBlockState(this: BlockPlan): State | null {
    // Generate the default state for each of the block's inputs.
    const inputs: Record<string, ConnectionState> | undefined = undefined;

    // for (const input of this.variants) {
    //   // Get the primary type of the input's connection.
    //   const inputTypes = input.accepts;
    //   if (inputTypes == null || inputTypes.length === 0) {
    //     continue;
    //   }
    //
    //   // Lookup the block associated with the primary type.
    //   const inputBlockPlan = getDefaultBlockPlanForType(inputTypes[0]);
    //   if (inputBlockPlan == null) {
    //     continue;
    //   }
    //
    //   // Generate the default state for the primary type's default block.
    //   const inputBlockState = inputBlockPlan.generateBlockState();
    //   if (inputBlockState == null) {
    //     continue;
    //   }
    //
    //   // Assign the state for the default block to the input.
    //   inputs ??= {};
    //   inputs[input.name] = { shadow: inputBlockState };
    // }

    // If any default states were generated for fields or inputs, construct
    // a `State` value from them and return it. Otherwise, return `null`.
    if (inputs == null) {
      return null;
    } else {
      return {
        type: this.name,
        inputs: inputs,
        fields: {},
      };
    }
  }
}

export const BLOCK_PLAN_TYPE_MAP = new Map<string, BlockPlan>();
