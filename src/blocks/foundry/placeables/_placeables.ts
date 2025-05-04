/*
 * Get placeables inside placeable.
 * Get placeables at points.
 * Get placeables in circle.
 * Get placeables in square.
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Placeable: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    placeables: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
