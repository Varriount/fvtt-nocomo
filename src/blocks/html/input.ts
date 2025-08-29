import {
  BlockOrientation,
  BlockPlan,
  ValueTypes,
} from "../../plans/block_plan"; // Assuming ValueTypes is exported
import { ToolboxCategoryNames } from "../../toolbox";

// TODO: Clean this all up.

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
    HTMLElementString: "";
  }
}

/**
 * Additional toolbox categories.
 */
declare module "../../toolbox" {
  export interface ToolboxCategoryNames {
    html: "";
  }
}

/**
 * Blocks exported by this module.
 */
export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Common Input Definitions
 */
const EXTENDS_HTML_BLOCK = {
  orientation: "vertical" as BlockOrientation,
  categories: ["html"] as (keyof ToolboxCategoryNames)[],
};

/**
 * Helper function to generate common attributes for input elements.
 * @param inputType The HTML input type (e.g., "text", "number").
 * @returns A string snippet of HTML attributes.
 */
const generateCommonAttributesString = (inputType: string): string => {
  // VALUE is handled by specific inputs due to type differences
  let attributes = `type="${inputType}"`;
  attributes += `{{#if ID}} id="{{ID}}"{{/if}}`;
  attributes += `{{#if NAME}} name="{{NAME}}"{{/if}}`;
  attributes += `{{#if PLACEHOLDER}} placeholder="{{PLACEHOLDER}}"{{/if}}`;
  attributes += `{{#if TITLE}} title="{{TITLE}}"{{/if}}`;
  attributes += `{{#if DISABLED}} disabled{{/if}}`;
  attributes += `{{#if READONLY}} readonly{{/if}}`;
  attributes += `{{#if REQUIRED}} required{{/if}}`;
  attributes += `{{#if AUTOFOCUS}} autofocus{{/if}}`;
  return attributes;
};

/**
 * HTML Button Element
 */
BLOCKS.HTML_BUTTON = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_button",
  kind: "value",
  output: "HTMLElementString" as keyof ValueTypes,
  inputs: [
    {
      name: "TEXT_CONTENT",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    { name: "VALUE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  fields: [
    {
      name: "TYPE",
      type: "dropdown",
      args: [
        [
          ["button", "button"],
          ["submit", "submit"],
          ["reset", "reset"],
        ],
      ],
    },
  ],
  toCode: `
    <button
      id="{{ID}}"
      name="{{NAME}}"
      type="{{TYPE}}"
      value="{{VALUE}}"
      {{#if DISABLED}}disabled{{/if}}
    >{{TEXT_CONTENT}}</button>`,
});

/**
 * HTML Checkbox Element
 */
BLOCKS.HTML_CHECKBOX = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_checkbox",
  kind: "value",
  output: "HTMLElementString" as keyof ValueTypes,
  inputs: [
    { name: "LABEL", accepts: ["String"], shadow: { block: "text" } },
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    { name: "VALUE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "CHECKED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  toCode: `
    <label for="{{ID}}">{{LABEL}}</label>
    <input
      type="checkbox"
      id="{{ID}}"
      name="{{NAME}}"
      value="{{VALUE}}"
      {{#if CHECKED}}checked{{/if}}
      {{#if DISABLED}}disabled{{/if}}
    >
  `,
});

/**
 * HTML Radio Button Element
 */
BLOCKS.HTML_RADIO_BUTTON = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_radio_button",
  kind: "value",
  output: "HTMLElementString" as keyof ValueTypes,
  inputs: [
    { name: "LABEL", accepts: ["String"], shadow: { block: "text" } },
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    { name: "VALUE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "CHECKED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  toCode: `
    <label for="{{ID}}">{{LABEL}}</label>
    <input
      type="radio"
      id="{{ID}}"
      name="{{NAME}}"
      value="{{VALUE}}"
      {{#if CHECKED}}checked{{/if}}
      {{#if DISABLED}}disabled{{/if}}
    >
  `,
});

/**
 * HTML Option Element (for Drop-down list)
 */
BLOCKS.HTML_OPTION = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_option",
  kind: "statement",
  output: "HTMLElementString" as keyof ValueTypes,
  inputs: [
    {
      name: "TEXT_CONTENT",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    { name: "VALUE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "SELECTED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  toCode: `
    <option
      value="{{VALUE}}"
      {{#if SELECTED}}selected{{/if}}
      {{#if DISABLED}}disabled{{/if}}
    >{{TEXT_CONTENT}}</option>
  `,
});

/**
 * HTML Drop-down List (Select Element)
 */
BLOCKS.HTML_SELECT = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_select",
  kind: "value",
  output: "HTMLElementString" as keyof ValueTypes,
  inputs: [
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    { name: "OPTIONS", kind: "statement", accepts: ["HTMLElementString"] },
    {
      name: "MULTIPLE",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "SIZE",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
  ],
  toCode: `
    <select
      id="{{ID}}"
      name="{{NAME}}"
      {{#if MULTIPLE}}multiple{{/if}}
      {{#if DISABLED}}disabled{{/if}}
      size="{{SIZE}}"
    >{{OPTIONS}}</select>
  `,
});

/**
 * HTML "date" Input Element
 */
BLOCKS.HTML_INPUT_DATE = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_input_date",
  kind: "value",
  output: "HtmlElementString",
  inputs: [
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "PLACEHOLDER",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    { name: "TITLE", accepts: ["String"], shadow: { block: "text" } },
    { name: "VALUE", accepts: ["String"], shadow: { block: "text" } },
    { name: "MIN_DATE", accepts: ["String"], shadow: { block: "text" } },
    { name: "MAX_DATE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "STEP",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "LABEL_TEXT",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "READONLY",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "REQUIRED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "AUTOFOCUS",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  toCode: `
    <label for="{{ID}}">{{LABEL_TEXT}}</label>
    <input ${generateCommonAttributesString("date")} value="{{VALUE}}"{{#if MIN_DATE}} min="{{MIN_DATE}}"{{/if}}{{#if MAX_DATE}} max="{{MAX_DATE}}"{{/if}}{{#if STEP}} step="{{STEP}}"{{/if}}>`,
});

/**
 * HTML "number" Input Element
 */
BLOCKS.HTML_INPUT_NUMBER = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_input_number",
  kind: "value",
  output: "HtmlElementString",
  inputs: [
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "PLACEHOLDER",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    { name: "TITLE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "VALUE",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "MIN",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "MAX",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "STEP",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "LABEL_TEXT",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "READONLY",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "REQUIRED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "AUTOFOCUS",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  toCode: `
    <label for="{{ID}}">{{LABEL_TEXT}}</label>
    <input
      ${generateCommonAttributesString("number")}
      value="{{VALUE}}"
      {{#if MIN}} min="{{MIN}}"{{/if}}
      {{#if MAX}} max="{{MAX}}"{{/if}}
      {{#if STEP}} step="{{STEP}}"{{/if}}
    >`,
});

/**
 * HTML "range" Input Element
 */
BLOCKS.HTML_INPUT_RANGE = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_input_range",
  kind: "value",
  output: "HtmlElementString",
  inputs: [
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "PLACEHOLDER",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    { name: "TITLE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "VALUE",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "MIN",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "MAX",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "STEP",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "LABEL_TEXT",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "READONLY",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "REQUIRED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "AUTOFOCUS",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  toCode: `<label for="{{ID}}">{{LABEL_TEXT}}</label>
    <input
      ${generateCommonAttributesString("range")}
      value="{{VALUE}}"
      {{#if MIN}} min="{{MIN}}" {{/if}}
      {{#if MAX}} max="{{MAX}}" {{/if}}
      {{#if STEP}} step="{{STEP}}" {{/if}}
    >`,
});

/**
 * HTML "text" Input Element
 */
BLOCKS.HTML_INPUT_TEXT = new BlockPlan({
  ...EXTENDS_HTML_BLOCK,
  name: "html_input_text",
  kind: "value",
  output: "HtmlElementString",
  inputs: [
    { name: "ID", accepts: ["String"], shadow: { block: "text" } },
    { name: "NAME", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "PLACEHOLDER",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    { name: "TITLE", accepts: ["String"], shadow: { block: "text" } },
    { name: "VALUE", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "MINLENGTH",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    {
      name: "MAXLENGTH",
      accepts: ["Number"],
      shadow: { block: "math_number" },
    },
    { name: "PATTERN", accepts: ["String"], shadow: { block: "text" } },
    {
      name: "LABEL_TEXT",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    {
      name: "DISABLED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "READONLY",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "REQUIRED",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
    {
      name: "AUTOFOCUS",
      accepts: ["Boolean"],
      shadow: { block: "logic_boolean" },
    },
  ],
  fields: [
    {
      name: "SPELLCHECK",
      type: "dropdown",
      args: [
        [
          ["Browser default", "default"],
          ["True", "true"],
          ["False", "false"],
        ],
      ],
    },
  ],
  toCode: `
    <label for="{{ID}}">{{LABEL_TEXT}}</label>
    <input
      ${generateCommonAttributesString("text")}
      value="{{VALUE}}"
      {{#if MINLENGTH}} minlength="{{MINLENGTH}}"{{/if}}
      {{#if MAXLENGTH}} maxlength="{{MAXLENGTH}}"{{/if}}
      {{#if PATTERN}} pattern="{{PATTERN}}"{{/if}}
      {{#if SPELLCHECK}}
        {{#unless (eq SPELLCHECK "default")}}
          spellcheck="{{SPELLCHECK}}"
        {{/unless}}
      {{/if}}
    >
  `,
});
