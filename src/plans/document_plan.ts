import { BlockPlan } from "./block_plan";

/**
 *
 */
interface DocumentPlanData {}

/**
 *
 */
class DocumentPlan {
  documentBlockPlan: BlockPlan;
  documentMutatorTopBlockPlan: BlockPlan;
  private mutatorFieldBlockPlans: BlockPlan[];
  private mutatorTopBlockPlan: BlockPlan;

  constructor(data: DocumentPlanData) {}

  /**
   * Generate a BlockPlan that represents a block containing a document's data.
   *
   * The document block technically has one input per field, however whether a
   * field's corresponding input is present on a specific document block
   * instance is controlled by its mutator (see
   * `generateDocumentMutatorBlocks`).
   */
  generateDocumentBlockPlan(): BlockPlan {}

  /**
   * Generate BlockPlans for the document block's mutator.
   *
   * A document block's mutator is composed of its top block
   * (see `generateMutatorTopBlockPlan`) and one block for each of its fields
   * (see `generateMutatorFieldBlockPlan`).
   */
  generateDocumentMutatorBlocks() {
    this.mutatorTopBlockPlan = this.generateMutatorTopBlockPlan();
    for (const [name, type] of this.fields) {
      this.mutatorFieldBlockPlans.push(this.generateMutatorFieldBlockPlan());
    }
  }

  /**
   * Generate a BlockPlan for the top block in the document block's mutator.
   *
   * This block accepts a variable number of statement blocks
   * (see `generateMutatorFieldBlockPlan`), where each statement block
   * represents a field to add to the document block.
   */
  generateMutatorTopBlockPlan(): BlockPlan {}

  /**
   * Generate a BlockPlan for the sub-blocks in the document block's mutator.
   */
  generateMutatorFieldBlockPlan(): BlockPlan {}

  /**
   * Generate a BlockPlan that represents a block that creates one or more
   * documents.
   *
   * The block has one input, `DOCUMENTS`, that accepts a list of one or more
   * document blocks. If the `DOCUMENTS` input has no block connected, it is
   * configured to use a shadow block of a list with a single document block.
   */
  generateCreateBlockPlan(): BlockPlan {}

  /**
   * Generate a BlockPlan that represents a block that retrieves one or more
   * document instances.
   *
   * The block has one input, `DOCUMENT_IDS`, that accepts a list of one or more
   * strings. If the `DOCUMENT_IDS` input has no block connected, it is
   * configured to use a shadow block of an empty list.
   */
  generateGetBlockPlan(): BlockPlan {}

  /**
   * Generate a BlockPlan that represents a block that updates one or more
   * document instances.
   *
   * The block has one input, `DOCUMENTS`, that accepts a list of one or more
   * document blocks. If the `DOCUMENTS` input has no block connected, it is
   * configured to use a shadow block of a list with a single document block.
   */
  generateUpdateBlockPlan(): BlockPlan {}

  /**
   * Generate a BlockPlan that represents a block that deletes one or more
   * document instances.
   *
   * The block has one input, `DOCUMENT_IDS`, that accepts a list of one or more
   * strings. If the `DOCUMENT_IDS` input has no block connected, it is
   * configured to use a shadow block of an empty list.
   */
  generateDeleteBlockPlan(): BlockPlan {}
}

function generateStructureBlock(
  name: string,
  definition: unknown,
): BlockPlan[] {
  const structureBlockName = "";
  const structureBlockOutput = "";

  const mutatorBlockName = "";
  const mutatorBlockOutput = "";

  const fieldBlockName = "";
  const fieldBlockOutput = "";

  const upperCaseStructureName = name.toUpperCase();
  const lowerCaseStructureName = name.toLowerCase();

  const fieldNames = Object.keys(definition);

  // Main structure block definition
  const structureBlockPlan = new BlockPlan({
    name: structureBlockName,
    kind: "value",
    output: structureBlockOutput,
    mutator: {
      onMutatorCreate: function () {},
      onMutatorUpdate: function () {},
      onSourceBlockUpdate: function () {},
    },
  });
  const structureBlock = `
/**
 * A block representing the ${name} structure.
 */
new BlockPlan({
  name: "${lowerCaseStructureName}_create",
  kind: "value",
  output: "${name}",
  mutator: "${lowerCaseStructureName}_mutator",
  toCode: valueCode(
    "{ " +
    ${fieldNames
      .map(
        fieldName => `{{${fieldName.toUpperCase()}}} ? \`
      ${fieldName}: {{${fieldName.toUpperCase()}}},\` : ""`,
      )
      .join(" + ")} +
    " }"
  ),
}),
`;

  // Top-level mutator block definition
  const mutatorContainerBlock = `
/**
 * Mutator container for the ${name} block.
 */
new BlockPlan({
  name: "${lowerCaseStructureName}_mutator_container",
  kind: "statement",
  inputs: [
    {
      name: "STACK",
      kind: "statement",
      accepts: ["mutator_item"],
    },
  ],
  toCode: () => "",
}),
`;

  // Sub-level mutator block definitions for each field
  const mutatorItemBlocks = fieldNames
    .map(
      fieldName => `
/**
 * Mutator item for the '${fieldName}' field.
 */
new BlockPlan({
  name: "${lowerCaseStructureName}_mutator_item_${fieldName}",
  kind: "statement",
  message0: "${fieldName}",
  previousStatement: "mutator_item",
  nextStatement: "mutator_item",
  toCode: () => "",
}),
`,
    )
    .join("");

  // Mutator mixin
  const mutatorMixin = `
/**
 * Mutator mixin for the ${name} block.
 */
const ${upperCaseStructureName}_MUTATOR_MIXIN = {
  // Create XML to represent the inputs.
  saveExtraState: function() {
    const state = {};
    ${fieldNames.map(fieldName => `state.${fieldName} = this.getInput("S_${fieldName.toUpperCase()}") ? true : false;`).join("\n    ")}
    return state;
  },

  // Parse XML to restore the inputs.
  loadExtraState: function(state) {
    ${fieldNames
      .map(
        fieldName => `
    if (state.${fieldName}) {
      this.addInput_("${fieldName}");
    }
    `,
      )
      .join("")}
  },

  // Populate the mutator's dialog with this block's components.
  decompose: function(workspace) {
    const containerBlock = workspace.newBlock("${lowerCaseStructureName}_mutator_container");
    containerBlock.initSvg();

    let connection = containerBlock.getInput("STACK").connection;
    ${fieldNames
      .map(
        fieldName => `
    if (this.getInput("S_${fieldName.toUpperCase()}")) {
      const itemBlock = workspace.newBlock("${lowerCaseStructureName}_mutator_item_${fieldName}");
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    `,
      )
      .join("")}
    return containerBlock;
  },

  // Reconfigure this block based on the mutator's components.
  compose: function(containerBlock) {
    ${fieldNames
      .map(
        fieldName => `
    let hasInput = ${fieldNames.map(f => `this.getInput("S_${f.toUpperCase()}")`).join(" || ")};
    let connection = this.getInput("S_${fieldName.toUpperCase()}")?.connection.targetConnection;
    if (hasInput && !connection) {
      this.removeInput("S_${fieldName.toUpperCase()}");
    }
    `,
      )
      .join("\n")}
    // Add new inputs.
    let itemBlock = containerBlock.getInputTargetBlock("STACK");
    while (itemBlock) {
      const fieldName = itemBlock.type.split("_").pop();
      if (fieldName) {
        this.addInput_(fieldName);
      }
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },

  addInput_: function(fieldName) {
    const upperCaseFieldName = fieldName.toUpperCase();
    const inputName = "S_" + upperCaseFieldName;
    if (!this.getInput(inputName)) {
      this.appendValueInput(inputName)
        .setCheck("${definition[fieldName]}")
        .appendField(fieldName);
    }
  }
};

Blockly.Extensions.registerMutator(
  "${lowerCaseStructureName}_mutator",
  ${upperCaseStructureName}_MUTATOR_MIXIN,
  undefined,
  [${fieldNames.map(fieldName => `"${lowerCaseStructureName}_mutator_item_${fieldName}"`).join(", ")}]
);
`;

  return (
    structureBlock + mutatorContainerBlock + mutatorItemBlocks + mutatorMixin
  );
}

// Example usage:
const vectorFields = {
  x: "Number",
  y: "Number",
  z: "Number",
};

const vectorBlockDefinitions = generateStructureBlock("Vector", vectorFields);
console.log(vectorBlockDefinitions);
