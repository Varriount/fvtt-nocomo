/*
 * Generate random integer
 * Generate random float
 * Get random choice
 *  - with replacement
 *  - without replacement
 * Shuffle list
 */

import { valueCode } from "../../codegen";
import { $expressionToString } from "../../macros";
import { BlockOrientation, BlockPlan } from "../../plans/block_plan";
import { ToolboxCategoryNames } from "../../toolbox";

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
 * Generate N random [whole | decimal] numbers between MINIMUM and MAXIMUM.
 */
BLOCKS.GENERATE_RANDOM_NUMBER = new BlockPlan({
  ...EXTENDS_OBJECT_BLOCK,
  name: "generate_random_number",
  kind: "value",

  inputs: [
    {
      name: "MINIMUM_VALUE",
      accepts: ["Number"],
    },
    {
      name: "MAXIMUM_VALUE",
      accepts: ["Number"],
    },
  ],

  fields: [
    {
      name: "MINIMUM_VALUE_OPERATOR",
      type: "dropdown",
      args: [
        [
          ["greater_than", "true"],
          ["greater_than_or_equal_to", "false"],
        ],
      ],
    },
    {
      name: "MAXIMUM_VALUE_OPERATOR",
      type: "dropdown",
      args: [
        [
          ["less_than", "true"],
          ["less_than_or_equal_to", "false"],
        ],
      ],
    },
    {
      name: "NUMBER_KIND",
      type: "dropdown",
      args: [
        [
          ["integer", "randomInteger"],
          ["decimal", "randomDecimal"],
        ],
      ],
    },
  ],

  output: "Number",

  // Language=Handlebars
  toCode: `
    {{NUMBER_KIND}}(
      {{MINIMUM_VALUE}},
      {{MAXIMUM_VALUE}},
      {{MINIMUM_VALUE_OPERATOR}},
      {{MAXIMUM_VALUE_OPERATOR}},
    )
  `,
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
      name: "SAMPLE_SIZE",
      accepts: ["Number"],
    },
    {
      name: "LIST",
      accepts: ["List"],
    },
  ],

  fields: [
    {
      name: "REPETITION_MODE",
      type: "dropdown",
      args: [
        [
          ["without", "true"],
          ["with", "false"],
        ],
      ],
    },
  ],

  output: "Number",

  toCode: `
      randomInteger(
        {{LIST}},
        {{SAMPLE_SIZE}},
        {{REPETITION_MODE}},
      )
    `,
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
      name: "WEIGHTS",
      accepts: ["List"],
    },
    {
      name: "TOTAL_WEIGHT",
      accepts: ["Number"],
    },
  ],

  output: "Number",

  toCode: valueCode(
    `
      (function () {
        const weights = {{WEIGHTS}};
        const totalWeight = {{TOTAL_WEIGHT}};
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
      name: "LIST",
      accepts: ["List"],
    },
  ],

  fields: [
    {
      name: "COPY_MODE",
      type: "dropdown",
      args: [
        [
          ["inplace", "true"],
          ["copy", "false"],
        ],
      ],
    },
  ],

  output: "Number",

  toCode: valueCode(
    // Language=Handlebars
    `
      randomInteger(
        {{LIST}},
        {{COPY_MODE}},
      )
    `,
  ),
});
