import { BlockPlan } from "../../plans/block_plan";
import { CodeGenerationFunction } from "../../plans/code_plan";

export const TEXT_REPORTER = new BlockPlan({
  name: "text",
  kind: "value",
  orientation: "vertical",
  variants: [
    {
      name: "text",
      message: "",
      generator: null as unknown as CodeGenerationFunction,
      fields: [
        {
          name: "TEXT",
          type: "textinput",
        },
      ],
      output: {
        types: [],
      },
    },
  ],
});
