/*
 * Include _documents.ts
 *
 * Execute macro.
 * Check whether user can execute macro.
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Macro: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    macros: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get macros.
`
let x: Macro[] = game.macros
`;
