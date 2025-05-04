import * as ts from "typescript";
import { $$raw, RawContext } from "ts-macros";

/**
 * Converts a given expression into its string representation.
 *
 * @param __expression
 *   The expression to be converted to a string.
 * @return
 *   A string representation of the given expression.
 */
export function $expressionToString(__expression: unknown): string {
  // TODO: Capture parameters & parameter types & decorators

  return $$raw!((ctx: RawContext, expressionAst: ts.FunctionDeclaration) => {
    const ts = ctx.ts;
    const factory = ctx.ts.factory;

    const expressionString = expressionAst.getText();

    const output = ts.transpileModule(expressionString, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    });

    return factory.createStringLiteral(output.outputText);
  });
}

/**
 * Mappings:
 *   Function Name  -> Block Name
 *   Parameter Name -> Input/Field Name
 *   Parameter Type -> Input/Field Type
 *   Return Type    -> Return Type
 *
 * Decorators:
 *   @Field(plan?: FieldPlanData)
 *
 *   @Input(plan?: InputPlanData)
 */
