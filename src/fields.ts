import { Field, registry } from "blockly/core";
import { ConstructorParameterSets } from "./utils";

/**
 * Field Types
 *
 * This definition may be augmented by modules in the `fields` directory.
 * Represents the field types with predefined structures and values.
 *
 * @typedef {object} FieldTypes
 * @property {object} unknown
 *   Represents an unknown field type with a specific type and value.
 * @property {string} unknown.type
 *   The type of the field, which is always "unknown".
 * @property {string} unknown.value
 *   The value of the field, which is always "unknown".
 */
export interface FieldTypes {
  unknown: {
    type: "unknown";
    args: never;
  };
}

export type FieldType = FieldTypes[keyof FieldTypes];

export type FieldTypeDefinition<
  N extends string,
  T extends abstract new (...args: any) => any,
> = {
  type: N;
  args: ConstructorParameterSets<T>[number];
};

export function registerField(name: string, field: Field): void {
  registry.register(registry.Type.FIELD, name, field);
}
