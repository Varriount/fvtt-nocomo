/*
 * Include _documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Table: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    tables: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get rollable tables.
`
let x: RollTable[] = game.rollTables;
`;
