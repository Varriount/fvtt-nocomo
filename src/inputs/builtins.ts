import * as blockly from "blockly";

const registry = blockly.registry;

const ValueInput = blockly.inputs.ValueInput;
const StatementInput = blockly.inputs.StatementInput;
const DummyInput = blockly.inputs.DummyInput;
const EndRowInput = blockly.inputs.EndRowInput;

declare module "../inputs" {
  export interface InputTypes {
    value: "";
    statement: "";
    dummy: "";
    end_row: "";
  }
}

export function registerBuiltinInputs() {
  registry.register(registry.Type.INPUT, "value", ValueInput);
  registry.register(registry.Type.INPUT, "statement", StatementInput);
  registry.register(registry.Type.INPUT, "dummy", DummyInput);
  registry.register(registry.Type.INPUT, "end_row", EndRowInput);
}
