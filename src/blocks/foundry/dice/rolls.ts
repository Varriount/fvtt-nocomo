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
const EXTENDS_ROLL_BLOCK = {
  orientation: "vertical" as BlockOrientation,
  categories: ["dice"] as (keyof ToolboxCategoryNames)[],
};

/**
 * Blocks exported by this module.
 */
export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Roll TERM using DATA
 */
BLOCKS.DICE_ROLL = new BlockPlan({
  ...EXTENDS_ROLL_BLOCK,
  name: "dice_roll",
  kind: "value",
  output: "DiceRoll",
  inputs: [
    {
      name: "TERM",
      accepts: ["String", "DiceTerm"],
      shadow: {
        block: "text",
        fields: [{ name: "TEXT", args: ["1d20"] }],
      },
    },
    {
      name: "DATA",
      accepts: ["Object"],
      shadow: {
        block: "create_object",
      },
    },
  ],
  toCode: `new Roll({{TERM}}, {{DATA}})`,
});
