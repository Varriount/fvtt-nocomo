import { AllOrNone, ConstructorParameterSets } from "./utils";

/**
 * Default Field Types
 *
 * This definition may be augmented by modules in the `fields` directory.
 */
export interface FieldTypes {
  unknown: {
    type: "unknown";
    value: "unknown";
  };
}

export type FieldType = FieldTypes[keyof FieldTypes];

export type FieldTypeDefinition<
  N extends string,
  T extends abstract new (...args: any) => any,
> = {
  type: N;
  value?: ConstructorParameterSets<T>[number][0];
  validator?: ConstructorParameterSets<T>[number][1];
} & AllOrNone<ConstructorParameterSets<T>[number][2]>;
