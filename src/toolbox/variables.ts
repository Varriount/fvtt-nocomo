import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

declare module "../toolbox" {
  export interface ToolboxCategoryNames {
    variables: "";
  }
}

export const variablesCategory: ToolboxItemInfo = {
  kind: "category",
  name: "Variables",
  categorystyle: "variable_category",
  custom: "VARIABLE",
};
