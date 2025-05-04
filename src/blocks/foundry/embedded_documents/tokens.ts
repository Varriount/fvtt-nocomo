/*
 * Include _embedded_documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Token: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    tokens: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Filters:
 *   - From [Scene(s)]
 */
