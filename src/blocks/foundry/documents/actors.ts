/*
 * Include _documents.ts
 *
 * Get/set/toggle statuses
 * Get items by item type
 *
 * generateMethodCallBlock({
 *   name: "toggle_status_effect_on_actor",
 *   parameters: {
 *     "actor": {
 *       shown_as: "input_value"
 *       accepts: ["Actor"],
 *     },
 *     "statusName": {
 *       shown_as: "input_value"
 *       accepts: ["string"],
 *     },
 *   },
 *   outputType: null,
 *   generator: "{actor}.toggleStatusEffect({statusName})"
 * })
 *
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    actors: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    actors: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get settings
`
let x: Setting[] = game.settings
`;
