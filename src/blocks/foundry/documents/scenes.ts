/*
 * Include _documents.ts
 *
 * Activate scene
 * Navigate to scene
 * Pull player to scene
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Scene: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    scenes: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get the (current | active) scene.
`
let scene: Scene = game.scenes.current // For the current scene
let scene: Scene = game.scenes.active // For the active scene
`;

// Preload scene (for this client | for all clients).
`
let scene: Scene = game.scenes.preload(scene ID, preload for all clients)
`;
