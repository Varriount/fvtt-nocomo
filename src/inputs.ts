import { AllOrNone, ConstructorParameterSets } from "./utils";

/**
 * Default Input Types
 *
 * This definition may be augmented by modules in the `inputs` directory.
 */
export interface InputTypes {
  dummy: "";
}

export type InputType = keyof InputTypes;

export type InputTypeDefinition<
  N extends string,
  T extends abstract new (...args: any) => any,
> = {
  type: N;
  value?: ConstructorParameterSets<T>[number][0];
  validator?: ConstructorParameterSets<T>[number][1];
} & AllOrNone<ConstructorParameterSets<T>[number][2]>;
