/*
 * Include _documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Item: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    items: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
