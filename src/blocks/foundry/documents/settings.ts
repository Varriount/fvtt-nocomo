/*
 * Include _documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Setting: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    settings: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get settings.
`
let x: Setting[] = game.settings
`;
