/**
 *
 */
import { Block } from "blockly/core";
import { JavascriptGenerator, Order } from "blockly/javascript";

export type CodeGenerationFunction = (
  block: Block,
  generator: JavascriptGenerator,
) => [string, Order] | string;

export type ReprGenerationFunction = (
  block: Block,
  generator: JavascriptGenerator,
) => [string, Order] | string;
