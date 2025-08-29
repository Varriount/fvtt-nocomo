/**
 *
 */
import { Block, Input, registry } from "blockly/core";
import { InputType } from "../inputs";
import { FieldPlanData } from "./field_plan";

export interface InputPlanData {
  name: string;
  kind?: InputType;
  shadow?: Omit<ShadowInputValue, "name">;
  accepts?: string[] | null;
}

export interface ShadowInputValue {
  name: string;
  block: string;
  inputs?: ShadowInputValue[];
  fields?: Omit<FieldPlanData, "type">[];
}

export class InputPlan {
  name: string;
  type: InputType;
  shadow?: Omit<ShadowInputValue, "name">;
  acceptedTypes: string[] | null;

  constructor(data: InputPlanData) {
    this.name = data.name;
    this.type = data.kind ?? "value";
    this.shadow = data.shadow;
    this.acceptedTypes = data.accepts ?? null;
  }

  /**
   * Creates an input object from the input plan.
   */
  createInput(block: Block): Input {
    const classType = registry.Type.INPUT;
    const inputClassName = this.type;
    const throwIfMissing = true;
    const acceptedTypes = this.acceptedTypes;

    const inputClass = registry.getClass<Input>(
      classType,
      inputClassName,
      throwIfMissing,
    );

    // @ts-expect-error `fieldClass` will never be null due to `throwIfMissing`.
    const input = new inputClass(this.name, block);
    if (input.connection != null) {
      input.setCheck(acceptedTypes);
    }

    return input;
  }
}

const DUMMY_INPUT_PLAN = new InputPlan({
  name: undefined as unknown as string,
  kind: "end_row",
});
const END_ROW_INPUT_PLAN = new InputPlan({
  name: undefined as unknown as string,
  kind: "dummy",
});

export function createDummyInput(block: Block) {
  return DUMMY_INPUT_PLAN.createInput(block);
}

export function createEndRowInput(block: Block) {
  return END_ROW_INPUT_PLAN.createInput(block);
}
