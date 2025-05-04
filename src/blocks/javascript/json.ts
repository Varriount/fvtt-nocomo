/*
 * Encode to JSON.
 * Decode from JSON.
 */

import { BlockPlan } from "../../plans/block_plan";

declare module "../../plans/block_plan" {
  export interface ValueTypes {
    Object: "";
  }
}

declare module "../../toolbox" {
  export interface ToolboxCategoryNames {
    Objects: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Encode value [X] to [formatted | unformatted] JSON.
 * Decode string [X] from JSON
 */
