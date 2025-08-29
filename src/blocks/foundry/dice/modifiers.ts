import { BlockOrientation, BlockPlan } from "../../../plans/block_plan";
import { ToolboxCategoryNames } from "../../../toolbox";

/**
 * Registration function.
 */
export function registerBlocks() {
  Object.values(BLOCKS).forEach(b => b.defineBlock());
  Object.values(BLOCKS).forEach(b => b.defineToolboxEntry());
}

/**
 * Additional value types for Dice Rolls.
 */
declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    DiceRoll: "";
    DiceTerm: "";
  }
}

/**
 * Adds a "Dice" category to the toolbox.
 */
declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    dice: "";
  }
}

/**
 * Common Input Definitions
 */
const EXTENDS_MODIFIERS_BLOCK = {
  orientation: "horizontal" as BlockOrientation,
  categories: ["dice"] as (keyof ToolboxCategoryNames)[],
};

/**
 * Blocks exported by this module.
 */
export const BLOCKS: Record<string, BlockPlan> = {};

BLOCKS.DICE_MODIFIER_SHADOW = new BlockPlan({
  ...EXTENDS_MODIFIERS_BLOCK,
  name: "dice_modifier_shadow",
  fields: [
    {
      name: "PLACEHOLDER",
      type: "checkbox",
      args: [],
    },
  ],
  kind: "statement",
  output: "DiceTermModifier",
  toCode: "",
});

/**
 * Reroll or recursively reroll TERM when CONDITION CONDITION_VALUE.
 */
BLOCKS.DICE_MODIFIER_REROLL = new BlockPlan({
  ...EXTENDS_MODIFIERS_BLOCK,
  name: "dice_modifier_reroll",
  kind: "statement",
  output: "DiceTermModifier",
  inputs: [
    {
      name: "CONDITION_VALUE",
      accepts: ["String", "Number", "DiceTerm"],
      shadow: { block: "math_number" },
    },
  ],
  fields: [
    {
      name: "ACTION",
      type: "dropdown",
      args: [
        [
          ["r", "r"],
          ["rr", "rr"],
        ],
      ],
    },
    {
      name: "CONDITION",
      type: "dropdown",
      args: [
        [
          ["=", "="],
          ["!=", "!="],
          [">", ">"],
          [">=", ">="],
          ["<", "<"],
          ["<=", "<="],
        ],
      ],
    },
  ],
  toCode: "{{ACTION}}{{CONDITION}}{{CONDITION_VALUE}}",
});

/**
 * Continuously reroll TERM when CONDITION CONDITION_VALUE, adding each roll.
 */
BLOCKS.DICE_MODIFIER_EXPLODE = new BlockPlan({
  ...EXTENDS_MODIFIERS_BLOCK,
  name: "dice_modifier_explode",
  kind: "statement",
  output: "DiceTermModifier",
  inputs: [
    {
      name: "CONDITION_VALUE",
      accepts: ["String", "Number", "DiceTerm"],
      shadow: { block: "math_number" },
    },
  ],
  fields: [
    {
      name: "CONDITION",
      type: "dropdown",
      args: [
        [
          ["=", "="],
          ["!=", "!="],
          [">", ">"],
          [">=", ">="],
          ["<", "<"],
          ["<=", "<="],
        ],
      ],
    },
  ],
  toCode: "x{{CONDITION}}{{CONDITION_VALUE}}",
});

/**
 * ACTION COUNT rolls from TERM.
 */
BLOCKS.DICE_MODIFIER_KEEP_DROP = new BlockPlan({
  ...EXTENDS_MODIFIERS_BLOCK,
  name: "dice_modifier_keep_drop",
  kind: "statement",
  output: "DiceTermModifier",
  inputs: [
    {
      name: "COUNT",
      accepts: ["String", "Number", "DiceTerm"],
      shadow: { block: "math_number" },
    },
  ],
  fields: [
    {
      name: "ACTION",
      type: "dropdown",
      args: [
        [
          ["kh", "kh"],
          ["kl", "kl"],
          ["dh", "dh"],
          ["dl", "dl"],
          ["min", "min"],
          ["max", "max"],
        ],
      ],
    },
  ],
  toCode: "{{ACTION}}{{COUNT}}",
});

/**
 * TODO Rework to use sub-blocks
 */
BLOCKS.DICE_MODIFIER_COUNT_SF = new BlockPlan({
  ...EXTENDS_MODIFIERS_BLOCK,
  name: "dice_modifier_count_sf",
  kind: "statement",
  output: "DiceTermModifier",
  inputs: [
    {
      name: "CONDITION_VALUE",
      accepts: ["String", "Number", "DiceTerm"],
      shadow: { block: "math_number" },
    },
  ],
  fields: [
    {
      name: "ACTION",
      type: "dropdown",
      args: [
        [
          ["cs", "cs"],
          ["cf", "cf"],
          ["df", "df"],
          ["sf", "sf"],
        ],
      ],
    },
    {
      name: "CONDITION",
      type: "dropdown",
      args: [
        [
          ["=", "="],
          ["!=", "!="],
          [">", ">"],
          [">=", ">="],
          ["<", "<"],
          ["<=", "<="],
        ],
      ],
    },
  ],
  toCode: "{{ACTION}}{{CONDITION}}{{CONDITION_VALUE}}",
});

/**
 * Add flavor text DESCRIPTION to TERM.
 */
BLOCKS.DICE_MODIFIER_DESCRIPTION = new BlockPlan({
  ...EXTENDS_MODIFIERS_BLOCK,
  name: "dice_modifier_description",
  kind: "statement",
  output: "DiceTermModifier",
  inputs: [{ name: "DESCRIPTION", accepts: ["STRING"] }],
  toCode: "{{DESCRIPTION}}",
});
