import {
  FieldCheckbox,
  FieldDropdown,
  FieldImage,
  FieldLabel,
  FieldNumber,
  FieldTextInput,
  FieldVariable,
  registry,
} from "blockly";

declare module "../fields" {
  export interface FieldTypes {
    checkbox: FieldTypeDefinition<"checkbox", typeof FieldCheckbox>;
    image: FieldTypeDefinition<"image", typeof FieldImage>;
    dropdown: FieldTypeDefinition<"dropdown", typeof FieldDropdown>;
    number: FieldTypeDefinition<"number", typeof FieldNumber>;
    textinput: FieldTypeDefinition<"textinput", typeof FieldTextInput>;
    variable: FieldTypeDefinition<"variable", typeof FieldVariable>;
    label: FieldTypeDefinition<"label", typeof FieldLabel>;
  }
}

export function registerFields() {
  registry.register(registry.Type.FIELD, "checkbox", FieldCheckbox);
  registry.register(registry.Type.FIELD, "dropdown", FieldDropdown);
  registry.register(registry.Type.FIELD, "image", FieldImage);
  registry.register(registry.Type.FIELD, "number", FieldNumber);
  registry.register(registry.Type.FIELD, "text_input", FieldTextInput);
  registry.register(registry.Type.FIELD, "variable", FieldVariable);
  registry.register(registry.Type.FIELD, "label", FieldLabel);
}
