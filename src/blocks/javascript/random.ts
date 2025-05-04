/*
 * Generate random integer
 * Generate random float
 * Get random choice
 *  - with replacement
 *  - without replacement
 * Shuffle list
 */

import { BlockOrientation, BlockPlan } from "../../plans/block_plan";
import { valueCode } from "../../codegen";
import { ToolboxCategoryNames } from "../../toolbox";
import { $expressionToString } from "../../macros";

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
    Object: "";
  }
}

/**
 * Additional toolbox categories.
 */
declare module "../../toolbox" {
  export interface ToolboxCategoryNames {
    random: "";
  }
}

/**
 * Common Input Definitions
 */
const EXTENDS_OBJECT_BLOCK = {
  orientation: "vertical" as BlockOrientation,
  categories: ["random"] as (keyof ToolboxCategoryNames)[],
};

/**
 * Helper Function Definitions
 */
export const FUNCTIONS: Record<string, string> = {};

FUNCTIONS.randomInteger = $expressionToString!(
  //
  function randomInteger(
    minimum: number,
    maximum: number,
    exclusiveMinimum: boolean,
    exclusiveMaximum: boolean,
  ) {
    if (exclusiveMinimum) {
      minimum += 1;
    }
    if (!exclusiveMaximum) {
      maximum -= 1;
    }

    return Math.floor(Math.random() * (maximum - minimum) + minimum);
  },
);

FUNCTIONS.randomDecimal = $expressionToString!(
  //
  function randomDecimal(
    minimum: number,
    maximum: number,
    exclusiveMinimum: boolean,
    exclusiveMaximum: boolean,
  ) {
    let result = 0;

    do {
      result = Math.random() * (maximum - minimum) + minimum;
    } while (
      (result <= minimum && exclusiveMinimum) ||
      (result >= maximum && exclusiveMaximum)
    );

    return result;
  },
);

FUNCTIONS.weightedRandomInteger = $expressionToString!(
  //
  function weightedRandomInteger<T>(choices: T[], weights: number[]): T {
    const totalWeight = weights.reduce((acc, current) => acc + current);

    let remainingWeight = Math.random() * totalWeight;
    let choiceIndex = 0;

    for (const weight of weights) {
      remainingWeight = remainingWeight - weight;
      if (remainingWeight <= 0) {
        break;
      }

      choiceIndex = choiceIndex + 1;
    }

    return choices[choiceIndex];
  },
);

FUNCTIONS.weightedChoice = $expressionToString!(
  //
  function randomChoice<T>(choices: T[], weights: number[]): T {
    const totalWeight = weights.reduce((acc, current) => acc + current);

    let remainingWeight = Math.random() * totalWeight;
    let choiceIndex = 0;

    for (const weight of weights) {
      remainingWeight = remainingWeight - weight;
      if (remainingWeight <= 0) {
        break;
      }

      choiceIndex = choiceIndex + 1;
    }

    return choices[choiceIndex];
  },
);

/**
 * Block Definitions
 */
export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Generate [N] random [whole | decimal] numbers between [X] and [Y].
 */
BLOCKS.GENERATE_RANDOM_NUMBER = new BlockPlan({
  ...EXTENDS_OBJECT_BLOCK,
  name: "generate_random_number",
  kind: "value",

  inputs: [
    {
      name: "minimum_value",
      accepts: ["Number"],
    },
    {
      name: "maximum_value",
      accepts: ["Number"],
    },
  ],

  fields: [
    {
      name: "minimum_value_operator",
      type: "dropdown",
      value: [
        ["greater_than", "true"],
        ["greater_than_or_equal_to", "false"],
      ],
    },
    {
      name: "maximum_value_operator",
      type: "dropdown",
      value: [
        ["less_than", "true"],
        ["less_than_or_equal_to", "false"],
      ],
    },
    {
      name: "number_kind",
      type: "dropdown",
      value: [
        ["integer", "randomInteger"],
        ["decimal", "randomDecimal"],
      ],
    },
  ],

  output: "Number",

  generator: valueCode(
    // language=Handlebars
    `
      {{number_kind}}(
        {{minimum_value}},
        {{maximum_value}},
        {{minimum_value_operator}},
        {{maximum_value_operator}},
      )
    `,
  ),
});

/**
 * Select [N] random entries from a list [L] [with | without] repetition.
 */
BLOCKS.SAMPLE_LIST = new BlockPlan({
  ...EXTENDS_OBJECT_BLOCK,
  name: "sample_list",
  kind: "value",

  inputs: [
    {
      name: "sample_size",
      accepts: ["Number"],
    },
    {
      name: "list",
      accepts: ["List"],
    },
  ],

  fields: [
    {
      name: "repetition_mode",
      type: "dropdown",
      value: [
        ["without", "true"],
        ["with", "false"],
      ],
    },
  ],

  output: "Number",

  generator: valueCode(
    // language=Handlebars
    `
      randomInteger(
        {{list}},
        {{sample_size}},
        {{repetition_mode}},
      )
    `,
  ),
});

/**
 *
 */
BLOCKS.GENERATE_WEIGHTED_RANDOM_NUMBER = new BlockPlan({
  name: "generate_weighted_random_number",
  kind: "value",
  categories: ["random"],
  orientation: "vertical",

  inputs: [
    {
      name: "weights",
      accepts: ["List"],
    },
    {
      name: "total_weight",
      accepts: ["Number"],
    },
  ],

  output: "Number",

  generator: valueCode(
    `
      (function () {
        const weights = {{weights}};
        const totalWeight = {{total_weight}};
        let random = Math.random() * totalWeight;
        for (let i = 0; i < weights.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            return i + 1;
          }
        }
        return weights.length;
      })()
    `,
  ),
});

/**
 * [Copy and shuffle | Shuffle] list [L]
 */
BLOCKS.SHUFFLE_LIST = new BlockPlan({
  ...EXTENDS_OBJECT_BLOCK,
  name: "shuffle_list",
  kind: "value_and_statement",

  inputs: [
    {
      name: "list",
      accepts: ["List"],
    },
  ],

  fields: [
    {
      name: "copy_mode",
      type: "dropdown",
      value: [
        ["inplace", "true"],
        ["copy", "false"],
      ],
    },
  ],

  output: "Number",

  generator: valueCode(
    // language=Handlebars
    `
      randomInteger(
        {{list}},
        {{copy_mode}},
      )
    `,
  ),
});
