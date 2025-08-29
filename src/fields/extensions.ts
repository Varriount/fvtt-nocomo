import { FieldAngle } from "@blockly/field-angle";
import { FieldColour } from "@blockly/field-colour";
import { FieldColourHsvSliders } from "@blockly/field-colour-hsv-sliders";
import { FieldDate } from "@blockly/field-date";
import { FieldMultilineInput } from "@blockly/field-multilineinput";
import { registry } from "blockly/core";
import { FieldTypeDefinition } from "../fields";

declare module "../fields" {
  export interface FieldTypes {
    angle: FieldTypeDefinition<"angle", typeof FieldAngle>;
    colour: FieldTypeDefinition<"colour", typeof FieldColour>;
    colour_hsv: FieldTypeDefinition<"colour_hsv", typeof FieldColour>;
    date: FieldTypeDefinition<"date", typeof FieldDate>;
    multiline_text_input: FieldTypeDefinition<
      "multiline_text_input",
      typeof FieldMultilineInput
    >;
  }
}

export function registerFields() {
  registry.register(registry.Type.FIELD, "angle", FieldAngle);
  registry.register(registry.Type.FIELD, "colour", FieldColour);
  registry.register(registry.Type.FIELD, "colour_hsv", FieldColourHsvSliders);
  registry.register(registry.Type.FIELD, "date", FieldDate);
  registry.register(
    registry.Type.FIELD,
    "multiline_text_input",
    FieldMultilineInput,
  );
}
