import { BlockPlan } from "../../../plans/block_plan";
import { valueCode } from "../../../codegen";
import { ToolboxCategoryNames } from "../../../toolbox";

/**
 * Adds a "Effect" category to the toolbox.
 */
declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    effect: "effect";
  }
}

/**
 * Additional value types for active effects.
 */
declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    ActiveEffect_Schema: "";
  }
}

/**
 * A block representing the ActiveEffect schema.
 */
export const ACTIVE_EFFECT_SCHEMA_BLOCK = new BlockPlan({
  name: "active_effect_schema",
  kind: "value",
  output: "ActiveEffect_Schema",
  categories: ["effect"] as (keyof ToolboxCategoryNames)[],
  inputs: [
    {
      name: "_id",
      accepts: ["String"],
    },
    {
      name: "label",
      accepts: ["String"],
    },
    {
      name: "changes",
      accepts: ["Array_Object"],
    },
    {
      name: "disabled",
      accepts: ["Boolean"],
    },
    {
      name: "duration",
      accepts: ["Object"],
    },
    {
      name: "icon",
      accepts: ["String"],
    },
    {
      name: "tint",
      accepts: ["String"],
    },
    {
      name: "origin",
      accepts: ["String"],
    },
    {
      name: "transfer",
      accepts: ["Boolean"],
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
      label: {{label}},
      changes: {{changes}},
      disabled: {{disabled}},
      duration: {{duration}},
      icon: {{icon}},
      tint: {{tint}},
      origin: {{origin}},
      transfer: {{transfer}},
      flags: {{flags}},
      _stats: {{_stats}}
    }`,
  ),
});
