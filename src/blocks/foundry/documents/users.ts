/*
 * Include _documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    User: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    users: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get the current user.
`
let x: User = game.users.current
`;

// Get the currently active GM user.
`
let x: User = game.users.activeGm
`;

// Get players.
`
let x: Users[] = game.users.players
`;
