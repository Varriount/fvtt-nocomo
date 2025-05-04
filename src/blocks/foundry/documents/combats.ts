/*
 * Include _documents.ts
 *
 * Activate combat
 *
 * Start combat
 * End combat
 *
 * Move to combatant
 *
 * Get All Combatants
 * Get Combatant
 *   - Current
 *   - Previous
 *   - Next
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Combat: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    combats: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get combats
`
let x: Setting[] = game.settings
`;

// Get settings
`
let x: Setting[] = game.settings
`;

// Get settings
`
let x: Setting[] = game.settings
`;

// Get settings
`
let x: Setting[] = game.settings
`;
