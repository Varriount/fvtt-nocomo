import { FieldPlan, FieldPlanData } from "./field_plan";
import { Block, Field, FieldLabel, Input } from "blockly";
import { OutputPlan, OutputPlanData } from "./output_plan";
import { CodeGenerationFunction } from "./code_plan";
import { DummyInput, InputPlan, InputPlanData } from "./input_plan";
import { tokenizeMessage } from "../utils";
import { localize } from "../localization";

/**
 * A data structure representing the required data to define a single
 * variant of a block.
 */
export interface BlockVariantPlanData {
  /**
   * The name of the variant.
   */
  name: string;

  /**
   * Data describing this variant's inputs.
   * Inherited by child variants.
   */
  inputs?: InputPlanData[];

  /**
   * Data describing this variant's fields.
   * Inherited by child variants.
   */
  fields?: FieldPlanData[];

  /**
   * Data describing the values this variant outputs.
   * Inherited by child variants.
   */
  output?: OutputPlanData | string;
  outputs?: string[];

  /**
   * A function to generate code for this variant.
   * Inherited by child variants.
   */
  generator?: CodeGenerationFunction;
}

/**
 * Extends `BlockVariantPlanData` to include nested variants.
 * Used to allow leaf plans to share and inherit inputs and fields.
 */
export interface BlockVariantBranchPlanData extends BlockVariantPlanData {
  /**
   * The nested variants this variant contains.
   */
  variants: (BlockVariantBranchPlanData | BlockVariantLeafPlanData)[];
}

/**
 * Extends `BlockVariantPlanData` to represent concrete variants.
 */
export interface BlockVariantLeafPlanData extends BlockVariantPlanData {
  /**
   * The message or label displayed on the block for this variant.
   */
  message?: string;
}

/**
 * Represents a plan for constructing a block variant.
 * Contains all the necessary inputs, fields, and configurations required to
 * define a variant.
 */
export abstract class BlockVariantPlan {
  /**
   * The name of the block variant plan.
   */
  name: string;

  /**
   * A mapping of input names to their corresponding input plans.
   */
  inputs: Map<string, InputPlan>;

  /**
   * A mapping of field names to their corresponding field plans.
   */
  fields: Map<string, FieldPlan>;

  /**
   * The output plan representing the output type of the block.
   */
  output?: OutputPlan;

  /**
   * A function to generate code for the block variant.
   */
  generator?: CodeGenerationFunction;

  /**
   * Creates a `BlockVariantPlan` instance.
   * @param data
   *   The data required to initialize the plan.
   */
  constructor(data: BlockVariantPlanData) {
    this.name = data.name;
    this.inputs = new Map();
    this.fields = new Map();
    this.generator = data.generator;

    // Extract and normalize the variant's output information.
    const output = data.output ?? data.outputs;
    console.log("here", output);
    switch (output?.constructor?.name) {
      case "Array":
        this.output = { types: output as string[] };
        break;
      case "String":
        this.output = { types: [output as string] };
        break;
      default:
        this.output = output as OutputPlanData;
        break;
    }

    // Create input plans from the data's input descriptions.
    if (data.inputs != null) {
      for (const inputData of data.inputs) {
        this.inputs.set(inputData.name, new InputPlan(inputData));
      }
    }

    // Create field plans from the data's field descriptions.
    if (data.fields != null) {
      for (const fieldData of data.fields) {
        this.fields.set(fieldData.name, new FieldPlan(fieldData));
      }
    }
  }

  /**
   * Constructs a variant of the given block within the provided context.
   *
   * @param block
   *   The block object for which a variant is to be constructed.
   * @param context
   *   The context object that provides necessary information to create
   *   the block variant.
   * @return
   *   Returns a newly created block variant based on the given input
   *   block and context.
   */
  abstract constructVariant(
    block: Block,
    context?: BlockVariantProtoLeaf,
  ): BlockVariant;
}

/**
 * Represents a branch plan for block variants.
 */
export class BlockVariantBranchPlan extends BlockVariantPlan {
  kind: "branch";
  variants: Map<string, BlockVariantPlan>;

  /**
   * Constructs a new instance of the branch plan with the provided data.
   *
   * @param {BlockVariantBranchPlanData} data
   *   The data for initializing the branch plan.
   *   Includes variant information used to create child plans.
   */
  constructor(data: BlockVariantBranchPlanData) {
    super(data);
    this.kind = "branch";
    this.variants = new Map();

    // Build a list of entries for this branch's associated dropdown field.
    const dropdowns: [string, string][] = [];

    // Iterate through the given variant data and generate corresponding plans.
    for (const variant of data.variants) {
      let variantPlan = null;

      // Initialize either a branch plan or a leaf plan depending on the
      // variant data type.
      if ("variants" in variant) {
        variantPlan = new BlockVariantBranchPlan(
          variant as BlockVariantBranchPlanData,
        );
      } else {
        variantPlan = new BlockVariantLeafPlan(
          variant as BlockVariantLeafPlanData,
        );
      }

      // Store the created variant plan and update the dropdown options.
      this.variants.set(variant.name, variantPlan);
      dropdowns.push([variant.name, variant.name]);
    }

    if (dropdowns.length === 0) {
      throw Error(`No variants found in branch plan ${this.name}`);
    }

    // Create a synthetic dropdown field plan representing the generated
    // variants and add it to the branch plan's fields.
    this.fields.set(
      this.name,
      new FieldPlan({
        type: "dropdown",
        name: this.name,
        value: dropdowns,
      }),
    );
  }

  /**
   * Constructs a variant branch for a block, based on the stored variant plans
   * and parent context.
   *
   * @param block
   *   The block instance for which the variant branch is being created.
   * @param parentProtoLeaf
   *   The parent context, providing the necessary data for constructing the
   *   variant branch.
   * @return
   *   A new instance of BlockVariantBranch containing the constructed variants
   *   and the current variant name.
   */
  constructVariant(
    block: Block,
    parentProtoLeaf?: BlockVariantProtoLeaf,
  ): BlockVariantBranch {
    // Create a new proto-leaf that inherits this branch's data.
    const protoLeaf = new BlockVariantProtoLeaf(block, this, parentProtoLeaf);

    // Create variants.
    let current = "";
    const variants = new Map();
    for (const [name, variant] of this.variants) {
      current = name;
      variants.set(name, variant.constructVariant(block, protoLeaf));
    }

    // Construct the result.
    return new BlockVariantBranch(current, variants);
  }
}

/**
 * Represents a specific type of block variant plan, designed for "leaf"
 * variants, which include a specific message structure.
 *
 * @extends BlockVariantPlan
 */
export class BlockVariantLeafPlan extends BlockVariantPlan {
  kind: "leaf";
  message: string;

  constructor(data: BlockVariantLeafPlanData) {
    super(data);
    this.kind = "leaf";
    this.message = localize(data.name + ".MESSAGE");
  }

  /**
   * Constructs a variant of the provided block using the given context.
   *
   * @param block
   *   The block for which the variant is being constructed.
   * @param context
   *   The construction context containing necessary state for building the
   *   block variant.
   * @return
   *   A BlockVariantLeaf representing the constructed block variant.
   */
  constructVariant(
    block: Block,
    context?: BlockVariantProtoLeaf,
  ): BlockVariantLeaf {
    context = new BlockVariantProtoLeaf(block, this, context);

    // Construct the "line" of inputs and their associated fields.
    return context.finalize(block, this.message);
  }
}

/**
 * Represents the context in which a `BlockVariant` is constructed.
 * Stores references to inputs, fields, output plans, and generators created
 * during a variant tree's construction.
 */
class BlockVariantProtoLeaf {
  /**
   * A mapping of input names to their corresponding `Input` objects.
   */
  inputs: Map<string, Input>;

  /**
   * A mapping of field names to their corresponding `Field` objects.
   */
  fields: Map<string, Field>;

  /**
   * The output plan to be used for this construction context.
   */
  output: OutputPlan | undefined;

  /**
   * A function to generate code for this context.
   */
  generator: CodeGenerationFunction | undefined;

  /**
   * Creates a `BlockVariantConstructionContext` instance.
   * @param block
   *   The block being constructed.
   * @param plan
   *   The variant plan being used to create this context.
   * @param parent
   *   The parent construction context to inherit data from.
   */
  constructor(
    block: Block,
    plan: BlockVariantPlan,
    parent?: BlockVariantProtoLeaf,
  ) {
    // Create fields from the block variant plan's field plans.
    this.fields = new Map(parent?.fields);
    for (const [name, field] of plan.fields) {
      this.fields.set(name, field.createField(block));
    }

    // Create inputs from the block variant plan's input plans.
    this.inputs = new Map(parent?.inputs);
    for (const [name, input] of plan.inputs) {
      this.inputs.set(name, input.createInput(block));
    }

    // Inherit the parent node's output plan, if required.
    this.output = plan.output ?? parent?.output;

    // Inherit the parent node's code generator, if required.
    this.generator = plan.generator ?? parent?.generator;
  }

  finalize(block: Block, message: string): BlockVariantLeaf {
    const line = this.constructLine(block, message);
    return new BlockVariantLeaf(line, this.output, this.generator);
  }

  /**
   * Constructs a list of input and field associations for a given block based
   * on its configuration and message structure.
   *
   * @param block
   *   The block for which the line is being constructed.
   * @param context
   *   The context containing the input and field mappings used to process
   *   tokens in the block's message.
   * @return
   *   An array of pairs where each pair contains an input object and an array
   *   of fields associated with that input.
   */
  constructLine(block: Block, message: string): [Input, Field[]][] {
    const inputMap = this.inputs;
    const fieldMap = this.fields;

    const line: [Input, Field[]][] = [];

    // Buffer for collecting field data that will later be appended to inputs.
    let fieldBuffer: Field[] = [];

    // Helper function to append all buffered fields to the given input, then
    // clear the buffer.
    function drainFieldBufferInto(input: Input) {
      line.push([input, fieldBuffer]);
      fieldBuffer = [];
    }

    // Turn the message into a series of fields and inputs, added to the block
    // as they are created. Since fields must be attached to outputs, any
    // created fields must be buffered until an output is created.
    for (const [tokenKind, token] of tokenizeMessage(message)) {
      switch (tokenKind) {
        // Turn text outside parameter interpolations into label fields.
        case "text": {
          const label = new FieldLabel(token);
          fieldBuffer.push(label);
          continue;
        }

        // Turn newlines into dummy inputs, to simulate line breaks.
        case "newline": {
          const input = DummyInput(block);
          drainFieldBufferInto(input);
          block.appendInput(input);
          continue;
        }

        // Turn parameter references into either inputs or fields.
        case "parameterName": {
          // If the parameter is an input plan, initialize an input from it,
          // add any buffered fields to it, then append it to the block.
          const input = inputMap.get(token);
          if (input != null) {
            drainFieldBufferInto(input);
            block.appendInput(input);
            continue;
          }

          // If the parameter is a field plan, initialize a field and
          // add it to the field buffer.
          const field = fieldMap.get(token);
          if (field != null) {
            fieldBuffer.push(field);
            continue;
          }

          // Throw an error if neither an input nor a field was found.
          throw new Error(`No such input or field: ${token}`);
        }

        default:
          throw new Error(`Unhandled token kind: ${tokenKind}`);
      }
    }

    // If any fields are left in the field buffer, create a DummyInput to
    // attach them to.
    if (fieldBuffer.length > 0) {
      const input = DummyInput(block);
      drainFieldBufferInto(input);
      block.appendInput(input);
    }

    return line;
  }
}

/**
 * Represents the base class for creating different block variants.
 * Each block variant specifies its own behavior and configuration.
 */
abstract class BlockVariant {
  /**
   * What type of language construct this variant represents.
   */
  abstract kind: string;

  /**
   * Configures the given block based on the specific variant implementation.
   * @param block The block to be configured.
   */
  abstract getActiveLeaf(): BlockVariantLeaf;
}

/**
 * Represents a branch variant capable of switching between multiple
 * sub-variants.
 */
class BlockVariantBranch extends BlockVariant {
  kind = "branch";
  current: string;
  variants: Map<string, BlockVariant>;

  /**
   * Creates a `BlockVariantBranch` instance.
   * @param current
   *   The currently selected sub-variant name.
   * @param variants
   *   A mapping of variant names to their corresponding `BlockVariant`
   *  instances.
   */
  constructor(current: string, variants: Map<string, BlockVariant>) {
    super();
    this.kind = "branch";
    this.current = current;
    this.variants = variants;
  }

  /**
   * Configures the given block based on the currently selected sub-variant.
   * @param block
   *   The target block to be configured.
   */
  getActiveLeaf(): BlockVariantLeaf {
    const variant = this.variants.get(this.current);
    // @ts-expect-error Should throw an error
    return variant?.getActiveLeaf();
  }
}

/**
 * Represents a leaf variant that defines the final structure and behavior
 * of a block.
 */
export class BlockVariantLeaf extends BlockVariant {
  kind: string;
  line: [Input, Field[]][];
  output: OutputPlan | undefined;
  generator: CodeGenerationFunction | undefined;

  /**
   * Creates a `BlockVariantLeaf` instance.
   * @param line
   *   A collection of inputs and their associated fields that define the block.
   * @param output
   *   The output plan for the block.
   * @param generator
   *   A function to generate code for this block.
   */
  constructor(
    line: [Input, Field[]][],
    output: OutputPlan | undefined,
    generator: CodeGenerationFunction | undefined,
  ) {
    super();
    this.generator = generator;
    this.output = output;
    this.line = line;
    this.kind = "leaf";
  }

  /**
   * Configures the given block based on the `BlockVariantLeaf`.
   * @param block
   *   The target block to be configured.
   */
  getActiveLeaf(): BlockVariantLeaf {
    return this;
  }
}
