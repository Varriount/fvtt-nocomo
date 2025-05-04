/*
 *
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Wall: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    walls: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};
