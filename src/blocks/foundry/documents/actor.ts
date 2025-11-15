import { ToolboxCategoryNames } from "../../../toolbox";
import { DocumentPlan } from "../../../plans/document_plan";

/**
 * Registration function.
 */
export function registerBlocks() {
  Object.values(DOCUMENTS).forEach(b => b.defineBlock());
  Object.values(DOCUMENTS).forEach(b => b.defineToolboxEntry());
}

/**
 * Additional value types.
 */
declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    Actor_Schema: "";
  }
}

/**
 * Additional toolbox categories.
 */
declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    actor: "actor";
  }
}

/**
 * Documents exported by this module.
 */
export const DOCUMENTS: Record<string, DocumentPlan> = {};

/**
 * A block representing the Actor schema.
 */
DOCUMENTS.ACTOR = new DocumentPlan({
  name: "actor_schema",
  categories: ["actor"] as (keyof ToolboxCategoryNames)[],
  fields: [
    {
      name: "_id",
      type: "String",
      required: false,
      defaultValue: "",
    },
    {
      name: "name",
      type: "String",
      required: true,
      defaultValue: "",
    },
    {
      name: "type",
      type: "String",
      required: false,
      defaultValue: "",
    },
    {
      name: "img",
      type: "String",
      required: false,
      defaultValue: "",
    },
    {
      name: "system",
      type: "Object",
      required: false,
      defaultValue: "",
    },
    {
      name: "prototypeToken",
      type: "Object",
      required: false,
      defaultValue: "",
    },
    {
      name: "items",
      type: "Array_Item",
      required: false,
      defaultValue: "",
    },
    {
      name: "effects",
      type: "Array_ActiveEffect",
      required: false,
      defaultValue: "",
    },
    {
      name: "folder",
      type: "String",
      required: false,
      defaultValue: "",
    },
    {
      name: "sort",
      type: "Number",
      required: false,
      defaultValue: "",
    },
    {
      name: "ownership",
      type: "Object",
      required: false,
      defaultValue: null,
    },
    {
      name: "flags",
      type: "Object",
      required: false,
      defaultValue: null,
    },
    {
      name: "_stats",
      type: "Object",
      required: false,
      defaultValue: null,
    },
  ],
  // toCode: valueCode(
  //   `{
  //     _id: {{_id}},
  //     name: {{name}},
  //     type: {{type}},
  //     img: {{img}},
  //     system: {{system}},
  //     prototypeToken: {{prototypeToken}},
  //     items: {{items}},
  //     effects: {{effects}},
  //     folder: {{folder}},
  //     sort: {{sort}},
  //     ownership: {{ownership}},
  //     flags: {{flags}},
  //     _stats: {{_stats}}
  //   }`,
  // ),
});
