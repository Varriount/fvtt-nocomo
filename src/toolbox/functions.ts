import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

declare module "../toolbox" {
  export interface ToolboxCategoryNames {
    functions: "";
  }
}

export const functionsCategory: ToolboxItemInfo = {
  kind: "category",
  name: "Functions",
  categorystyle: "procedure_category",
  custom: "PROCEDURE",
};
