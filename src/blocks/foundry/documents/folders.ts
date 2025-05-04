/*
 * Include _documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Folder: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    folders: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
