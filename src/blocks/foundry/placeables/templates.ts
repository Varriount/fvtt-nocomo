/*
 * Include _embedded_documents.ts
 *
 * Get grid points in template.
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Template: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    templates: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
