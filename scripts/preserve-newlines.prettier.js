import { parsers as tparsers } from "prettier/plugins/typescript";
// import { AstPath } from "prettier";

// newline-before-top-level.js
/**
 *
 * @param path {AstPath} The path
 * @param options
 * @param print
 * @returns {*}
 */
function print(path, options, print) {
  if (path == null){
    return;
  }
  
  const node = path.node;
  const printed = print(path);

  const isTopLevel =
    path.getParent() &&
    (path.getParent().type === "Program" || path.getParent().type === "File"); // For .js/.ts and .jsx/.tsx

  if (isTopLevel) {
    // Check if the node is a statement or declaration
    const topLevelTypes = [
      "VariableDeclaration",
      "FunctionDeclaration",
      "ClassDeclaration",
      "ExpressionStatement",
      "ImportDeclaration",
      "ExportNamedDeclaration",
      "ExportDefaultDeclaration",
      "TypeAliasDeclaration", // TypeScript
      "InterfaceDeclaration", // TypeScript
      "EnumDeclaration", // TypeScript
    ];

    if (topLevelTypes.includes(node.type)) {
      // Get the original printed output as an array of lines
      const lines = printed.split("\n");

      // Add two empty strings (representing newlines) at the beginning
      lines.unshift("", "");

      // Join the lines back into a single string
      return lines.join("\n");
    }
  }

  return printed;
}

export const parsers = {
  typescript: tparsers.typescript,
};

export const printers = {
  [tparsers.typescript.astFormat]: print
};
