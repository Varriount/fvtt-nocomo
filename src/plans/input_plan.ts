/**
 *
 */
import { FieldLabel, Input, registry } from "blockly/core";
import { InputType } from "../inputs";
import { FieldPlanData } from "./field_plan";
import { PlannedBlock } from "./block_plan";
import { localize } from "../localization";

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
  createInput(block: PlannedBlock): Input {
    const classType = registry.Type.INPUT;
    const inputClassName = this.type;
    const throwIfMissing = true;
    const acceptedTypes = this.acceptedTypes;

    const inputClass = registry.getClass<Input>(
      classType,
      inputClassName,
      throwIfMissing,
    );

    // TODO: Can type definition be modified to support this?
    // @ts-expect-error `fieldClass` will never be null due to `throwIfMissing`.
    const input = new inputClass(this.name, block);
    if (input.connection != null) {
      input.setCheck(acceptedTypes);
    }

    return input;
  }

  finalizeInput(input: Input, block: PlannedBlock) {
    // If the last field is a FieldLabel, set its tooltip.
    // TODO: Handle being called multiple times?
    const field = input.fieldRow[input.fieldRow.length - 1];
    if (field instanceof FieldLabel) {
      const tooltip = localize(`${block.name}.${this.name}.TOOLTIP`);
      field.setTooltip(tooltip);
    }
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

export function createDummyInput(block: PlannedBlock) {
  return DUMMY_INPUT_PLAN.createInput(block);
}

export function createEndRowInput(block: PlannedBlock) {
  return END_ROW_INPUT_PLAN.createInput(block);
}
