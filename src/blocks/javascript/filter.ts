import { valueCode } from "../../codegen";
import { BlockPlan } from "../../plans/block_plan";

/**
 * Registration function.
 */
export function registerBlocks() {
  Object.values(BLOCKS).forEach(b => b.defineBlock());
  Object.values(BLOCKS).forEach(b => b.defineToolboxEntry());
}

/**
 * Additional value types.
 */
declare module "../../plans/block_plan" {
  export interface ValueTypes {
    __placeholder?: never;
  }
}

/**
 * Additional toolbox categories.
 */
declare module "../../toolbox" {
  export interface ToolboxCategoryNames {
    filter?: never;
  }
}

/**
 * Blocks exported by this module.
 */
export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Common Input Definitions
 */

/**
 * Block Definitions
 */

// A list of items from [T] that [do | do not] match the following criteria:
// [C...]
BLOCKS.FILTER = new BlockPlan({
  name: "filter",
  kind: "value",
  categories: ["filter"],
  orientation: "vertical",

  inputs: [
    {
      name: "filters",
      kind: "statement",
      accepts: ["FilterExpression[Document]"],
    },
    {
      name: "documents",
      accepts: ["Array[Document]"],
    },
  ],

  output: "Array[Document]",

  toCode: valueCode(
    `
      {{documents}}.filter(doc => {
        let result = true;
        {{#each filters}}
          result = result && ({{this}});
        {{/each}}
        return result;
      })
    `,
  ),
});

BLOCKS.FILTER_EXPRESSION = new BlockPlan({
  name: "filter_expression",
  kind: "value",
  categories: ["filter"],
  orientation: "horizontal",

  inputs: [
    {
      name: "property",
      accepts: ["String"],
    },
    {
      name: "value",
      accepts: ["String", "Number", "Boolean"], // Allow various types
    },
  ],

  fields: [
    {
      name: "operator",
      type: "dropdown",
      args: [
        [
          ["=", "==="],
          ["!=", "!=="],
          [">", ">"],
          [">=", ">="],
          ["<", "<"],
          ["<=", "<="],
          ["in", "in"],
          ["not in", "not in"],
          ["includes", "excludes"],
        ],
      ],
    },
  ],

  output: "FilterExpression[Document]",

  toCode: valueCode(
    `
      doc => doc[{{property}}] {{operator}} {{value}}
    `,
  ),
});
