/*
 * Include _documents.ts
 *
 * Deal
 * Draw
 * Pass
 * Play
 * Reset
 * Shuffle
 * Get available cards

 * Show dialog:
 *   - Deal
 *   - Draw
 *   - Pass
 *   - Play
 *   - Reset
 *   - Delete
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    cards: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    cards: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
