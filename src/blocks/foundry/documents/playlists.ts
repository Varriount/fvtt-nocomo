/*
 * Include _documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Playlist: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    playlists: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Get the currently playing playlists.
`
let playlists: Playlist[] = game.playlists.playing
`;
