import { Block } from "blockly";
import { JavascriptGenerator, Order } from "blockly/javascript";
import * as OriginalHandlebars from "handlebars";

export const Handlebars = OriginalHandlebars.create();

export function valueCode(
  templateString: string,
): (block: Block, generator: JavascriptGenerator) => [string, Order] {
  const template = Handlebars.compile(templateString, { noEscape: true });

  function generator(
    block: Block,
    generator: JavascriptGenerator,
  ): [string, Order] {
    const context: Record<string, unknown> = {
      __generator: generator,
    };

    // Iterate over the inputs in the block, turning connected blocks into code
    // as appropriate.
    for (const input of block.inputList) {
      const inputBlock = input?.connection?.targetBlock();

      // Add the input's block to the context, to possibly be rendered later.
      if (inputBlock == null) {
        context[input.name] = "";
      } else {
        context[input.name] = inputBlock;
      }

      // Add the input's attached fields to the context.
      for (const field of input.fieldRow) {
        if (field.name != null && field.name !== "") {
          context[field.name] = field.getValue();
        }
      }
    }

    return [template(context), Order.ATOMIC];
  }

  return generator;
}

export function stmtCode(
  templateString: string,
): (block: Block, generator: JavascriptGenerator) => string {
  const valueGenerator = valueCode(templateString);

  function generator(block: Block, generator: JavascriptGenerator): string {
    return valueGenerator(block, generator)[0];
  }

  return generator;
}

Handlebars.registerHelper("toCode", function (block: Block) {
  if (typeof block !== "object") {
    return block;
  }

  // @ts-expect-error It's a helper
  let code = this.__generator.blockToCode(block);
  if (typeof code !== "string") {
    code = code[0];
  }
  return code;
});
