/*
 * Toolbox Category Type
 * To add a category, place the following generator at the tops of your module:
 * ```
 * declare module "../../toolbox" {
 *   export interface ToolboxCategoryNames {
 *     Objects: ""
 *   }
 * }
 * ```
 */
import { ToolboxInfo } from "blockly/core/utils/toolbox";
import { logicCategory } from "./toolbox/logic";
import { loopsCategory } from "./toolbox/loops";
import { mathCategory } from "./toolbox/math";
import { textCategory } from "./toolbox/text";
import { listsCategory } from "./toolbox/lists";
import { variablesCategory } from "./toolbox/variables";
import { functionsCategory } from "./toolbox/functions";

/**
 * Default Input Types
 *
 * This definition may be augmented by modules in the `toolbox` and `blocks`
 * directories.
 */
export interface ToolboxCategoryNames {
  "": "";
}

export type ToolboxCategoryName = keyof ToolboxCategoryNames;

export const toolbox: ToolboxInfo = {
  kind: "categoryToolbox",
  contents: [
    logicCategory,
    loopsCategory,
    listsCategory,
    textCategory,
    mathCategory,
    {
      kind: "sep",
    },
    functionsCategory,
    variablesCategory,
  ],
};

// class ToolboxPlan {
//   category_map: Map<string, Toolbox>;
// }
