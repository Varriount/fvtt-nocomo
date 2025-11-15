import { BlockPlan } from "../../../plans/block_plan";
import { valueCode } from "../../../codegen";
import { ToolboxCategoryNames } from "../../../toolbox";

/**
 * Adds a "Actor" category to the toolbox.
 */
declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    actor: "actor";
  }
}

/**
 * Additional value types for actor deltas.
 */
declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    ActorDelta_Schema: "";
  }
}

/**
 * A block representing the ActorDelta schema.
 */
export const ACTOR_DELTA_SCHEMA_BLOCK = new BlockPlan({
  name: "actor_delta_schema",
  kind: "value",
  output: "ActorDelta_Schema",
  categories: ["actor"] as (keyof ToolboxCategoryNames)[],
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
      name: "type",
      accepts: ["String"],
    },
    {
      name: "img",
      accepts: ["String"],
    },
    {
      name: "system",
      accepts: ["Object"],
    },
    {
      name: "items",
      accepts: ["Array_Item"],
    },
    {
      name: "effects",
      accepts: ["Array_ActiveEffect"],
    },
    {
      name: "ownership",
      accepts: ["Object"],
    },
    {
      name: "flags",
      accepts: ["Object"],
    },
  ],
  toCode: valueCode(
    `{
      _id: {{_id}},
      name: {{name}},
      type: {{type}},
      img: {{img}},
      system: {{system}},
      items: {{items}},
      effects: {{effects}},
      ownership: {{ownership}},
      flags: {{flags}}
    }`,
  ),
});
