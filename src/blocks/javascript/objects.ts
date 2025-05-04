/*
 * Get property
 * Set property
 * Delete property
 * List properties
 */
import { Order } from "blockly/javascript";
import { BlockOrientation, BlockPlan } from "../../plans/block_plan";
import { FieldPlanData } from "../../plans/field_plan";
import { DefaultInputValue } from "../../plans/input_plan";
import { stmtCode, valueCode } from "../../codegen";
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
const EXTENDS_OBJECT_BLOCK = {
  orientation: "vertical" as BlockOrientation,
  categories: ["objects"] as (keyof ToolboxCategoryNames)[],
};

export const BLANK_STRING_INPUT = {
  acceptedTypes: ["String"],
  default: {
    block: "text",
    inputs: [] as DefaultInputValue[],
    fields: [] as FieldPlanData[],
  },
};

export const NULL_LITERAL_INPUT = {
  acceptedTypes: ["String"],
  default: {
    block: "text",
    inputs: [] as DefaultInputValue[],
    fields: [] as FieldPlanData[],
  },
};

/**
 * Creates an object with the given properties.
 */
BLOCKS.CREATE_OBJECT = new BlockPlan({
  ...EXTENDS_OBJECT_BLOCK,
  name: "create_object",
  kind: "value",

  generator: valueCode("({ {{PROPERTIES}} })"),
  output: "Object",

  inputs: [
    {
      name: "PROPERTIES",
      type: "statement",
      accepts: ["create_object_property"],
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
      name: "PROPERTY_NAME",
    },
    {
      name: "PROPERTY_VALUE",
      accepts: null,
    },
  ],
  output: "create_object_property",
  generator: stmtCode("{{PROPERTY_NAME}}: {{PROPERTY_VALUE}},"),
});

/**
 * Retrieves the value of a specified property from an object.
 */
BLOCKS.GET_OBJECT_PROPERTY = new BlockPlan({
  name: "get_object_property",
  kind: "value",
  orientation: "horizontal",
  categories: ["objects"],

  inputs: [
    {
      name: "PROPERTY_NAME",
      accepts: ["String"],
    },
  ],

  // Whether to act on a single object, or multiple objects.
  variants: [
    // Get the value of a property from a single object.
    {
      name: "get_single_object_property",
      message: "Get the value of ${PROPERTY_NAME} from ${OBJECT}",
      inputs: [
        {
          name: "OBJECT",
          accepts: ["Object"],
        },
      ],
      output: {
        types: ["Any"],
      },
      generator: () => [``, Order.ATOMIC],
    },

    // Get the value of a property from multiple objects.
    {
      name: "get_multiple_object_property",
      message: "Get the value of ${PROPERTY_NAME} from ${OBJECTS}",
      inputs: [
        {
          name: "OBJECTS",
          accepts: ["List[Object]"],
        },
      ],
      output: {
        types: ["Any"],
      },
      generator: () => [``, Order.ATOMIC],
    },
  ],
});

/**
 * Sets a property of an object to a specified value.
 */
BLOCKS.SET_OBJECT_PROPERTY = new BlockPlan({
  name: "set_object_property",
  kind: "statement",
  orientation: "horizontal",
  categories: ["objects"],

  inputs: [
    {
      name: "PROPERTY_NAME",
      accepts: ["String"],
    },
    {
      name: "PROPERTY_VALUE",
      accepts: ["Any"],
    },
  ],

  // Whether to act on a single object, or multiple objects.
  variants: [
    // Set the value of a property on a single object.
    {
      name: "single",
      message:
        "${plurality} Set ${PROPERTY_NAME} on ${OBJECT} to ${PROPERTY_VALUE}",
      inputs: [
        {
          name: "OBJECT",
          accepts: ["Object"],
        },
      ],
      output: "List[{documentClass}]",
      generator: () => "",
    },

    // Set the value of a property on multiple objects.
    {
      name: "multiple",
      message:
        "${plurality} Set ${PROPERTY_NAME} on ${OBJECTS} to ${PROPERTY_VALUE}",
      inputs: [
        {
          name: "OBJECTS",
          accepts: ["List[Object]"],
        },
      ],
      output: "List[{documentClass}]",
      generator: () => "",
    },
  ],
});

/**
 * Deletes a property from an object.
 */
BLOCKS.DELETE_OBJECT_PROPERTY = new BlockPlan({
  name: "delete_object_property",
  kind: "statement",
  orientation: "horizontal",
  categories: ["objects"],

  inputs: [
    {
      name: "PROPERTY_NAME",
      accepts: ["String"],
    },
  ],

  // Whether to act on a single object, or multiple objects.
  variants: [
    // Delete a property from a single object.
    {
      name: "single",
      message: "Remove ${PROPERTY_NAME} from ${OBJECT}",
      inputs: [
        {
          name: "OBJECT",
          accepts: ["Object"],
        },
      ],
      output: undefined,
      generator: () => [``, Order.ATOMIC],
    },

    // Delete a property from multiple objects.
    {
      name: "multiple",
      message: "Remove ${PROPERTY_NAME} from ${OBJECTS}",
      inputs: [
        {
          name: "OBJECTS",
          accepts: ["List[Object]"],
        },
      ],
      output: undefined,
      generator: () => [``, Order.ATOMIC],
    },
  ],
});

/**
 * Lists the property names of an object.
 */
BLOCKS.GET_OBJECT_PROPERTY_NAMES = new BlockPlan({
  name: "get_object_property_names",
  kind: "value",
  orientation: "vertical",
  categories: ["objects"],
  variants: [
    // List the property names of a single object.
    {
      name: "single",
      message: "List property names of ${OBJECT}",
      inputs: [
        {
          name: "OBJECT",
          accepts: ["Object"],
        },
      ],
      output: "Iterable[string]",
      generator: () => [``, Order.ATOMIC],
    },

    // List the property names of multiple objects.
    {
      name: "multiple",
      message: "List property names of ${OBJECTS}",
      inputs: [
        {
          name: "OBJECTS",
          accepts: ["List[Object]"],
        },
      ],
      output: "Iterable[string]",
      generator: () => [``, Order.ATOMIC],
    },
  ],
});

/**
 * Lists the property values of an object.
 */
BLOCKS.GET_OBJECT_PROPERTY_VALUES = new BlockPlan({
  name: "get_object_property_values",
  kind: "value",
  orientation: "vertical",
  categories: ["objects"],
  variants: [
    // List the property values of a single object.
    {
      name: "single",
      message: "List property values of ${OBJECT}",
      inputs: [
        {
          name: "OBJECT",
          accepts: ["Object"],
        },
      ],
      output: {
        types: ["Iterable[Any]"],
      },
      generator: () => [``, Order.ATOMIC],
    },

    // List the property values of multiple objects.
    {
      name: "multiple",
      message: "List property values of ${OBJECTS}",
      inputs: [
        {
          name: "OBJECTS",
          accepts: ["List[Object]"],
        },
      ],
      output: {
        types: ["Iterable[Any]"],
      },
      generator: () => [``, Order.ATOMIC],
    },
  ],
});

/**
 * Lists the property entries of an object or objects.
 */
BLOCKS.GET_OBJECT_PROPERTY_ENTRIES = new BlockPlan({
  name: "get_object_property_entries",
  kind: "value",
  orientation: "vertical",
  categories: ["objects"],
  variants: [
    // List the property entries of a single object.
    {
      name: "single",
      message: "List properties of ${OBJECT}",
      inputs: [
        {
          name: "OBJECT",
          accepts: ["Object"],
        },
      ],
      output: "List[Object]",
      generator: () => [``, Order.ATOMIC],
    },

    // List the property entries of multiple objects.
    {
      name: "multiple",
      message: "List properties of ${OBJECTS}",
      inputs: [
        {
          name: "OBJECTS",
          accepts: ["List[Object]"],
        },
      ],
      output: "List[List[Object]]",
      generator: () => [``, Order.ATOMIC],
    },
  ],
});

/**
 * variant
 */
