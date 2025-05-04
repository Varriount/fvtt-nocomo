/*
 * Include _embedded_documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Sound: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    sounds: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
