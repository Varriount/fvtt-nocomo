export type OutputPlanData =
  | {
      types: string[] | null;
    }
  | { type: string | null }
  | string
  | string[]
  | null
  | undefined;

export class OutputPlan {
  types: string[] | null;

  constructor(data: OutputPlanData) {
    // Normalize the data to make `types` a string array or null
    if (data == null) {
      this.types = null;
      return;
    }

    // Extract the `type` or `types` property value, if possible.
    // @ts-expect-error because the compiler doesn't consider `??`.
    const extracted: string | string[] | null = data.type ?? data.types ?? data;

    // Handle the case where data is a primitive/semi-primitive value.
    if (typeof extracted === "string") {
      this.types = [extracted];
    } else {
      this.types = extracted;
    }
  }

  createOutput() {
    return this.types;
  }
}
