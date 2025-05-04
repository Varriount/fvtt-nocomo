/**
 *
 */
import { FieldType, FieldTypes } from "../fields";
import { Block, Field, registry } from "blockly";
import { RegistrableField } from "blockly/core/field_registry";

export type FieldPlanData = {
  name: string;
} & FieldType;

export class FieldPlan {
  name: string;
  type: keyof FieldTypes;
  value: unknown;
  options: unknown;

  constructor(data: FieldPlanData) {
    this.name = data.name;
    this.type = data.type;

    this.value = data.value;

    const options: Record<string, unknown> = {};
    Object.assign(options, data);

    if (options.value != null) {
      delete options.value;
    }
    if (options.name != null) {
      delete options.name;
    }
    if (options.type != null) {
      delete options.type;
    }

    this.options = options;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createField(block: Block): Field {
    const classType = registry.Type.FIELD;
    const fieldClassName = this.type;
    const throwIfMissing = true;

    const fieldClass =
      registry.getObject<RegistrableField>(classType, fieldClassName, false) ??
      registry.getObject<RegistrableField>(
        classType,
        "field_" + fieldClassName,
        throwIfMissing,
      );

    // @ts-expect-error `fieldClass` will never be null due to `throwIfMissing`.
    const result = new fieldClass(this.value, null, this.options);

    // Normally the `name` field is set by `Input.appendField`, but we set it
    // here instead.
    result.name = this.name;
    return result;
  }
}

export class LabelFieldPlan extends FieldPlan {
  constructor(text: string) {
    super({ name: text, type: "label", value: text });
  }
}
