/*
 * Include _embedded_documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Tile: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    tiles: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
