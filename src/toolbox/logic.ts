import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

declare module "../toolbox" {
  export interface ToolboxCategoryNames {
    logic: "";
  }
}

export const logicCategory: ToolboxItemInfo = {
  kind: "category",
  name: "Logic",
  categorystyle: "logic_category",
  contents: [
    {
      kind: "block",
      type: "controls_if",
    },
    {
      kind: "block",
      type: "logic_compare",
    },
    {
      kind: "block",
      type: "logic_operation",
    },
    {
      kind: "block",
      type: "logic_negate",
    },
    {
      kind: "block",
      type: "logic_boolean",
    },
    {
      kind: "block",
      type: "logic_null",
    },
    {
      kind: "block",
      type: "logic_ternary",
    },
  ],
};
