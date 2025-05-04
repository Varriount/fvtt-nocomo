/*
 * Include _documents.ts
 *
 * Apply roll mode
 * Get roll data
 * Export
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Message: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    messages: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Delete all chat messages (opens confirmation dialogue).
`
game.messages.flush()
`;
