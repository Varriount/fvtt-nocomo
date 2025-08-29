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
const EXTENDS_TERMS_BLOCK = {
  orientation: "horizontal" as BlockOrientation,
  categories: ["dice"] as (keyof ToolboxCategoryNames)[],
};

/**
 * Blocks exported by this module.
 */
export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Roll DICE_COUNT SIDE_COUNT-sided die.
 */
BLOCKS.DICE_TERM_N_SIDED = new BlockPlan({
  ...EXTENDS_TERMS_BLOCK,
  name: "dice_term_n_sided",
  kind: "value",
  output: "DiceTerm",
  inputs: [
    {
      name: "DICE_COUNT",
      accepts: ["Number", "DiceTerm"],
      shadow: { block: "math_number" },
    },
    {
      name: "SIDE_COUNT",
      accepts: ["Number", "DiceTerm"],
      shadow: { block: "math_number" },
    },
    {
      name: "MODIFIERS",
      accepts: ["DiceTermModifier"],
      kind: "statement",
    },
  ],
  toCode: "{{DICE_COUNT}}d{{SIDE_COUNT}}{{MODIFIERS}}",

  onCreate: function () {
    const workspace = this.workspace;
    const shadowBlock = workspace.newBlock("dice_modifier_shadow");
    const modifiersInput = this.getInput("MODIFIERS");
    // shadowBlock.setShadow(true); // Make it a shadow block
    if (shadowBlock.previousConnection != null) {
      modifiersInput?.connection?.connect(shadowBlock.previousConnection);
    }
    shadowBlock.setMovable(false);
  },
});

/**
 * Flip COIN_COUNT coins, counting the number of CALLED_RESULT.
 */
BLOCKS.DICE_TERM_COIN = new BlockPlan({
  ...EXTENDS_TERMS_BLOCK,
  name: "dice_term_coin",
  kind: "value",
  output: "DiceTerm",
  inputs: [
    {
      name: "COIN_COUNT",
      accepts: ["Number"],
    },
    {
      name: "MODIFIERS",
      accepts: ["DiceTermModifier"],
      kind: "statement",
    },
  ],
  fields: [
    {
      name: "CALLED_RESULT",
      type: "dropdown",
      args: [
        [
          ["heads", "1"],
          ["tails", "0"],
        ],
      ],
    },
  ],
  toCode: "{{COIN_COUNT}}dcc{{CALLED_RESULT}}{{MODIFIERS}}",
});

/**
 * Roll DICE_COUNT fudge die.
 */
BLOCKS.DICE_TERM_FATE = new BlockPlan({
  ...EXTENDS_TERMS_BLOCK,
  name: "dice_term_fate",
  kind: "value",
  output: "DiceTerm",
  inputs: [
    {
      name: "DICE_COUNT",
      accepts: ["Number"],
    },
    {
      name: "MODIFIERS",
      accepts: ["DiceTermModifier"],
      kind: "statement",
    },
  ],
  toCode: "{{DICE_COUNT}}dF",
});

/**
 * A variable reference.
 */
BLOCKS.DICE_TERM_VARIABLE = new BlockPlan({
  ...EXTENDS_TERMS_BLOCK,
  name: "dice_term_variable",
  kind: "value",
  output: "DiceTerm",
  inputs: [
    { name: "VARIABLE_NAME", accepts: ["String"] }, //
  ],
  toCode: "@{{VARIABLE_NAME}}",
});

/**
 * A dice pool expression.
 */
BLOCKS.DICE_TERM_POOL = new BlockPlan({
  ...EXTENDS_TERMS_BLOCK,
  name: "dice_term_pool",
  kind: "value",
  output: "DiceTerm",
  inputs: [
    {
      name: "EXPRESSIONS",
      kind: "statement",
      accepts: ["DiceTerm"],
    },
    {
      name: "MODIFIERS",
      accepts: ["DiceTermModifier"],
      kind: "statement",
    },
  ],
  toCode: "{ {{join EXPRESSIONS ','}} }{{MODIFIERS}}",
});

/**
 * A parenthetical expression.
 */
BLOCKS.DICE_TERM_PARENTHETICAL = new BlockPlan({
  ...EXTENDS_TERMS_BLOCK,
  name: "dice_term_parenthetical",
  kind: "value",
  output: "DiceTerm",
  inputs: [
    {
      name: "EXPRESSION",
      accepts: ["DiceTerm"],
    },
    {
      name: "MODIFIERS",
      accepts: ["DiceTermModifier"],
      kind: "statement",
    },
  ],
  toCode: "({{EXPRESSION}})",
});
