import { registry } from "blockly";
import { FieldAngle } from "@blockly/field-angle";
import { FieldColourHsvSliders } from "@blockly/field-colour-hsv-sliders";
import { FieldDate } from "@blockly/field-date";
import { FieldMultilineInput } from "@blockly/field-multilineinput";
import { FieldColour } from "@blockly/field-colour";

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

export function registerExtensionFields() {
  registry.register(registry.Type.INPUT, "angle", FieldAngle);
  registry.register(registry.Type.INPUT, "colour", FieldColour);
  registry.register(registry.Type.INPUT, "colour_hsv", FieldColourHsvSliders);
  registry.register(registry.Type.INPUT, "date", FieldDate);
  registry.register(
    registry.Type.INPUT,
    "multiline_text_input",
    FieldMultilineInput,
  );
}
