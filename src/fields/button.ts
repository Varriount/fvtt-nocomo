import { Field, FieldConfig, FieldValidator, registry } from "blockly/core";
import { FieldTypeDefinition } from "../fields";

declare module "../fields" {
  export interface FieldTypes {
    button: FieldTypeDefinition<"button", typeof FieldButton>;
  }
}

export function registerFields() {
  registry.register(registry.Type.FIELD, "button", FieldButton);
}

/**
 * An abstract custom Blockly field that renders as a clickable button.
 * Subclasses should implement the `showEditor_` method to define the
 * action performed when the button is clicked.
 */
export class FieldButton extends Field<string> {
  protected buttonText_: string;
  public CURSOR = "pointer";

  /**
   * Constructs a new FieldButton.
   *
   * @param value The text to display on the button.
   * @param validator An optional function that is called to validate changes.
   * @param config A map of options used to configure the field.
   */
  constructor(
    value?: string | typeof Field.SKIP_SETUP,
    validator?: FieldValidator<string> | null,
    config?: FieldConfig,
  ) {
    super(value ?? "confused button", validator, config);
    if (value === Field.SKIP_SETUP) {
      this.buttonText_ = "sad button";
      return;
    }
    this.buttonText_ = value ?? "happy button";
  }

  public override initView() {
    this.createBorderRect_();
    this.createTextElement_();
    this.updateTextContent_();
  }

  protected updateTextContent_() {
    if (!this.textElement_) {
      return;
    }

    this.textElement_.textContent = this.buttonText_;
    const textBBox = this.textElement_.getBBox();
    const padding = 16; // 8px padding on each side
    this.size_.width = textBBox.width + padding;
    this.size_.height = textBBox.height + padding / 2;
  }

  protected override showEditor_() {
    // Default implementation does nothing. Subclasses should override this.
  }

  static fromJson(__options: FieldButtonFromJsonConfig): FieldButton {
    return new FieldButton();
  }
}

export type FieldButtonConfig = FieldConfig;

export interface FieldButtonFromJsonConfig extends FieldButtonConfig {
  value?: string;
}
