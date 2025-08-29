import { $$raw, RawContext } from "ts-macros";
import * as ts from "typescript";

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

/**
 * A TypeScript transformer to convert "verbose" RegExp (with 'x' modifier)
 * into non-verbose form.
 */
export function $verboseRegex(__expression: unknown): string {
  return $$raw!(
    (ctx: RawContext, templateAst: ts.NoSubstitutionTemplateLiteral) => {
      const ts = ctx.ts;
      const factory = ts.factory;

      // Match occurrences of:
      //   - One or more whitespace characters not preceded by a backslash.
      //   - "//" and all characters after, until the line ends.
      //   - "#" and all characters after, until the line ends.
      //   - "/*" and all characters after, across multiple lines, then "*/".
      // (group order matters!)
      const verbosePattern = /(?<!\\)\s*|[/][/].*$|#.*$|[/][*][\s\S]*[*][/]/gu;

      // Capture the flags specified in the (optional) PCRE-style modifier group
      // at the beginning of the string, followed by the actual regular
      // expression pattern.
      const modifierPattern = /^(?:[(][?]([a-z]+)[)])?(.+)/su;

      // TODO Support template literals with substitutions
      // @ts-expect-error This should always return an array.
      const [, flags, pattern] = templateAst.text
        .replace(verbosePattern, "")
        .replace("\\", "\\\\") // May not be needed?
        .replace("/", "\\/") // May not be needed?
        .match(modifierPattern);
      return factory.createRegularExpressionLiteral(`/${pattern}/${flags}`);
    },
  );
}
