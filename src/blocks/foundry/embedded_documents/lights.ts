/*
 * Include _embedded_documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Light: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    lights: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
