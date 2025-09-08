/**
 *
 */
import { Field, registry } from "blockly/core";
import { RegistrableField } from "blockly/core/field_registry";
import { FieldType, FieldTypes } from "../fields";
import { localize } from "../localization";
import { PlannedBlock } from "./block_plan";

export type FieldPlanData = {
  name: string;
  default?: unknown;
} & FieldType;

export class FieldPlan {
  name: string;
  type: keyof FieldTypes;
  args: unknown[];
  default: unknown;

  // TODO: Rework blockName dependency.
  constructor(data: FieldPlanData) {
    this.name = data.name;
    this.type = data.type;

    this.args = data.args;
    this.default = data.default;
  }

  createField(block: PlannedBlock): Field {
    const classType = registry.Type.FIELD;
    const fieldClassName = this.type;
    const throwIfMissing = true;

    const fieldClassMaybe =
      registry.getObject<RegistrableField>(
        classType,
        fieldClassName,
        !throwIfMissing,
      ) ??
      registry.getObject<RegistrableField>(
        classType,
        "field_" + fieldClassName,
        throwIfMissing,
      );

    const fieldClass = fieldClassMaybe as RegistrableField;
    const result = new fieldClass(...this.args);
    result.setValue(this.default);

    if (block.name) {
      const tooltip = localize(`${block.name}.${this.name}.TOOLTIP`);
      result.setTooltip(tooltip);
    }

    // Normally the `name` field is set by `Input.appendField`, but we set it
    // here instead.
    result.name = this.name;
    return result;
  }
}
