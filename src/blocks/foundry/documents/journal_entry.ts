/*
 * Include _documents.ts
 */

import { BlockPlan } from "../../../plans/block_plan";

declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Journal: "";
  }
}

declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    journals: "";
  }
}

export const BLOCKS: Record<string, BlockPlan> = {};

// Display a dialog prompting the selection of a journal entry or page to show
// other players.
`
let x: (JournalEntry | JournalEntryPage)[] = game.journal.showDialog(?)
`;

// Show the journal entry or page [J] to all players, [respecting | ignoring]
// permissions.
`
let x: Setting[] = game.settings
`;

// Show the
`
let x: Setting[] = game.settings
`;

// Get settings
`
let x: Setting[] = game.settings
`;
