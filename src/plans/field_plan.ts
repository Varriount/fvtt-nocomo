/**
 *
 */
import { Block, Field, registry } from "blockly/core";
import { RegistrableField } from "blockly/core/field_registry";
import { FieldType, FieldTypes } from "../fields";

export type FieldPlanData = {
  name: string;
  default?: unknown;
} & FieldType;

export class FieldPlan {
  name: string;
  type: keyof FieldTypes;
  args: unknown[];
  default: unknown;

  constructor(data: FieldPlanData) {
    this.name = data.name;
    this.type = data.type;

    this.args = data.args;
    this.default = data.default;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createField(block: Block): Field {
    const classType = registry.Type.FIELD;
    const fieldClassName = this.type;
    const throwIfMissing = true;

    const fieldClassMaybe =
      registry.getObject<RegistrableField>(classType, fieldClassName, false) ??
      registry.getObject<RegistrableField>(
        classType,
        "field_" + fieldClassName,
        throwIfMissing,
      );

    const fieldClass = fieldClassMaybe as RegistrableField;
    const result = new fieldClass(...this.args);
    result.setValue(this.default);

    // Normally the `name` field is set by `Input.appendField`, but we set it
    // here instead.
    result.name = this.name;
    return result;
  }
}
