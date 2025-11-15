import { BlockPlan } from "../../../plans/block_plan";
import { valueCode } from "../../../codegen";
import { ToolboxCategoryNames } from "../../../toolbox";

/**
 * Adds a "Adventure" category to the toolbox.
 */
declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    adventure: "adventure";
  }
}

/**
 * Additional value types for adventures.
 */
declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Adventure_Schema: "";
  }
}

/**
 * A block representing the Adventure schema.
 */
export const ADVENTURE_SCHEMA_BLOCK = new BlockPlan({
  name: "adventure_schema",
  kind: "value",
  output: "Adventure_Schema",
  categories: ["adventure"] as (keyof ToolboxCategoryNames)[],
  inputs: [
    {
      name: "_id",
      accepts: ["String"],
    },
    {
      name: "name",
      accepts: ["String"],
    },
    {
      name: "img",
      accepts: ["String"],
    },
    {
      name: "caption",
      accepts: ["String"],
    },
    {
      name: "description",
      accepts: ["String"],
    },
    {
      name: "actors",
      accepts: ["Array_Actor"],
    },
    {
      name: "combats",
      accepts: ["Array_Combat"],
    },
    {
      name: "items",
      accepts: ["Array_Item"],
    },
    {
      name: "scenes",
      accepts: ["Array_Scene"],
    },
    {
      name: "journal",
      accepts: ["Array_JournalEntry"],
    },
    {
      name: "tables",
      accepts: ["Array_RollTable"],
    },
    {
      name: "macros",
      accepts: ["Array_Macro"],
    },
    {
      name: "cards",
      accepts: ["Array_Cards"],
    },
    {
      name: "playlists",
      accepts: ["Array_Playlist"],
    },
    {
      name: "folders",
      accepts: ["Array_Folder"],
    },
    {
      name: "sort",
      accepts: ["Number"],
    },
    {
      name: "flags",
      accepts: ["Object"],
    },
    {
      name: "_stats",
      accepts: ["Object"],
    },
  ],
  toCode: valueCode(
    `{
      _id: {{_id}},
      name: {{name}},
      img: {{img}},
      caption: {{caption}},
      description: {{description}},
      actors: {{actors}},
      combats: {{combats}},
      items: {{items}},
      scenes: {{scenes}},
      journal: {{journal}},
      tables: {{tables}},
      macros: {{macros}},
      cards: {{cards}},
      playlists: {{playlists}},
      folders: {{folders}},
      sort: {{sort}},
      flags: {{flags}},
      _stats: {{_stats}}
    }`,
  ),
});
