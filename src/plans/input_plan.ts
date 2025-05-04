/**
 *
 */
import { InputType } from "../inputs";
import { Block, Input, registry } from "blockly";
import { FieldPlanData } from "./field_plan";

export interface InputPlanData {
  name: string;
  type?: InputType;
  default?: Omit<DefaultInputValue, "name">;
  accepts?: string[] | null;
  // | {
  //     types: string[];
  //   };
}

export interface DefaultInputValue {
  name: string;
  block: string;
  inputs: DefaultInputValue[];
  fields: FieldPlanData[];
}

export class InputPlan {
  name: string;
  type: InputType;
  acceptedTypes: string[] | null;

  constructor(data: InputPlanData) {
    this.name = data.name;
    this.type = data.type ?? "value";
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
      console.log("setCheck", acceptedTypes);
      input.setCheck(acceptedTypes);
    }

    return input;
  }
}

export class EndRowInputPlan extends InputPlan {
  constructor() {
    super({
      name: undefined as unknown as string,
      type: "end_row",
    });
  }
}

export class DummyInputPlan extends InputPlan {
  constructor() {
    super({
      name: undefined as unknown as string,
      type: "dummy",
    });
  }
}

const DUMMY_INPUT_PLAN = new DummyInputPlan();
const END_ROW_INPUT_PLAN = new EndRowInputPlan();

export function DummyInput(block: Block) {
  return DUMMY_INPUT_PLAN.createInput(block);
}

export function EndRowInput(block: Block) {
  return END_ROW_INPUT_PLAN.createInput(block);
}
