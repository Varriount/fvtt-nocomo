/**
 *
 */
import { JavascriptGenerator, Order } from "blockly/javascript";
import { Block } from "blockly";

export interface CodePlan {
  content: string;
  precedence: Order;
}

export type CodeGenerationFunction = (
  block: Block,
  generator: JavascriptGenerator,
) => [string, Order] | string;
