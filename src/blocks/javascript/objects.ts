import { Order } from "blockly/javascript";
import {
  BlockOrientation,
  BlockPlan,
  BlockPlanData,
} from "../../plans/block_plan";
import { FieldPlanData } from "../../plans/field_plan";
import { InputPlanData, ShadowInputValue } from "../../plans/input_plan";
import { ToolboxCategoryNames } from "../../toolbox";

/**
 * Registration function.
 */
export function registerBlocks() {
  Object.values(BLOCKS).forEach(b => b.defineBlock());
  Object.values(BLOCKS).forEach(b => b.defineToolboxEntry());
}

/**
 * Additional value types.
 */
declare module "../../plans/block_plan" {
  export interface ValueTypes {
    Object: "";
    Any: "";
  }
}

/**
 * Additional toolbox categories.
 */
declare module "../../toolbox" {
  export interface ToolboxCategoryNames {
    objects: "";
  }
}

/**
 * Blocks exported by this module.
 */
export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Common Input Definitions
 */
const EXTENDS_OBJECT_BLOCK: Partial<BlockPlanData> = {
  orientation: "vertical" as BlockOrientation,
  categories: ["objects"] as (keyof ToolboxCategoryNames)[],
};

export const BLANK_STRING_INPUT: Partial<InputPlanData> = {
  accepts: ["String"],
  shadow: {
    block: "text",
    inputs: [] as ShadowInputValue[],
    fields: [] as FieldPlanData[],
  },
};

// export const NULL_LITERAL_INPUT = {
//   accepts: ["String"],
//   shadow: {
//     block: "text",
//     inputs: [] as ShadowInputValue[],
//     fields: [] as FieldPlanData[],
//   },
// };

/**
 * Creates an object with the given properties.
 */
BLOCKS.CREATE_OBJECT = new BlockPlan({
  ...EXTENDS_OBJECT_BLOCK,
  name: "create_object",
  kind: "value",

  toCode: "({ {{PROPERTIES}} })",
  output: "Object",

  inputs: [
    {
      name: "PROPERTIES",
      kind: "statement",
      accepts: ["create_object_property"],
    },
  ],
  fields: [
    {
      name: "CONTEXT_MENU",
      type: "context_button",
      args: [
        "Add block",
        [
          {
            text: "String Field",
            enabled: true,
            callback: () => {},
            scope: {},
            weight: 5,
          },
        ],
      ],
    },
  ],
});

/**
 * Sets the value of a specified property on an object.
 */
BLOCKS.CREATE_OBJECT__PROPERTY = new BlockPlan({
  ...EXTENDS_OBJECT_BLOCK,
  name: "create_object_property",
  kind: "statement",
  orientation: "horizontal",

  inputs: [
    {
      ...BLANK_STRING_INPUT,
      name: "NAME",
    },
    {
      name: "VALUE",
      accepts: null,
    },
  ],
  output: "create_object_property",
  toCode: "{{NAME}}: {{VALUE}},",
});

/**
 * Get the NAME property's value from OBJECT.
 */
BLOCKS.GET_OBJECT_PROPERTY = new BlockPlan({
  name: "get_object_property",
  kind: "value",
  orientation: "horizontal",
  categories: ["objects"],

  inputs: [
    {
      name: "NAME",
      accepts: ["String"],
    },
    {
      name: "OBJECT",
      accepts: ["Object"],
    },
  ],
  output: {
    types: ["Any"],
  },
  toCode: () => [``, Order.ATOMIC],
});

/**
 * Set the NAME property's value to VALUE on OBJECT.
 */
BLOCKS.SET_OBJECT_PROPERTY = new BlockPlan({
  name: "set_object_property",
  kind: "statement",
  orientation: "horizontal",
  categories: ["objects"],

  inputs: [
    {
      name: "NAME",
      accepts: ["String"],
    },
    {
      name: "VALUE",
      accepts: ["Any"],
    },
    {
      name: "OBJECT",
      accepts: ["Object"],
    },
  ],
  output: "List[{documentClass}]",
  toCode: () => "",
});

/**
 * Delete the NAME property from OBJECT.
 */
BLOCKS.DELETE_OBJECT_PROPERTY = new BlockPlan({
  name: "delete_object_property",
  kind: "statement",
  orientation: "horizontal",
  categories: ["objects"],

  inputs: [
    {
      name: "NAME",
      accepts: ["String"],
    },
    {
      name: "OBJECT",
      accepts: ["Object"],
    },
  ],
  output: undefined,
  toCode: () => [``, Order.ATOMIC],
});

/**
 * Get a list of property names from OBJECT.
 */
BLOCKS.GET_OBJECT_PROPERTY_NAMES = new BlockPlan({
  name: "get_object_property_names",
  kind: "value",
  orientation: "vertical",
  categories: ["objects"],
  inputs: [
    {
      name: "OBJECT",
      accepts: ["Object"],
    },
  ],
  output: "Iterable[string]",
  toCode: () => [``, Order.ATOMIC],
});

/**
 * Get a list of property values from OBJECT.
 */
BLOCKS.GET_OBJECT_PROPERTY_VALUES = new BlockPlan({
  name: "get_object_property_values",
  kind: "value",
  orientation: "vertical",
  categories: ["objects"],
  inputs: [
    {
      name: "OBJECT",
      accepts: ["Object"],
    },
  ],
  output: {
    types: ["Iterable[Any]"],
  },
});

/**
 * Get a list of properties and their values from OBJECT.
 */
BLOCKS.GET_OBJECT_PROPERTY_ENTRIES = new BlockPlan({
  name: "get_object_property_entries",
  kind: "value",
  orientation: "vertical",
  categories: ["objects"],
  inputs: [
    {
      name: "OBJECT",
      accepts: ["Object"],
    },
  ],
  output: "List[Object]",
  toCode: () => [``, Order.ATOMIC],
});
