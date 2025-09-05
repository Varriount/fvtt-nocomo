import { ContextMenuOption } from "blockly/core/contextmenu_registry";
import { FieldButton, FieldButtonConfig } from "./button";
import { ContextMenu, FieldValidator, registry } from "blockly/core";

declare module "../fields" {
  export interface FieldTypes {
    context_button: FieldTypeDefinition<
      "context_button",
      typeof FieldContextButton
    >;
  }
}

export function registerFields() {
  registry.register(registry.Type.FIELD, "context_button", FieldContextButton);
}

/**
 * A callback executed right after the context menu button is clicked, but
 * before the menu is displayed.
 *
 * @param options The array of menu options that will be displayed.
 */
export type OnClickCallback = (options: ContextMenuOption[]) => void;

/**
 * A button that displays a context menu when clicked.
 */
export class FieldContextButton extends FieldButton {
  menuOptions_: ContextMenuOption[];
  onClick_?: OnClickCallback;

  /**
   * Constructs a new FieldContextMenu.
   *
   * @param buttonText The text to display on the button.
   * @param menuOptions An array of menu options for the context menu.
   * @param onClick An optional callback executed when the button is clicked.
   * @param validator An optional function that is called to validate changes.
   * @param config A map of options used to configure the field.
   */
  constructor(
    buttonText: string,
    menuOptions: ContextMenuOption[],
    onClick?: OnClickCallback,
    validator?: FieldValidator<string> | null,
    config?: FieldContextButtonConfig,
  ) {
    // TODO: Handle shadow block parents
    // TODO: Handle JSON serialization
    super(buttonText, validator, config);

    this.menuOptions_ = menuOptions;
    this.onClick_ = onClick;
  }

  protected override showEditor_(e?: PointerEvent) {
    if (!e) {
      return;
    }
    // First, execute the onClick callback, allowing the consumer to modify
    // the menu options (e.g., disable items based on block state).
    if (this.onClick_) {
      this.onClick_(this.menuOptions_);
    }

    // Calculate the location to show the context menu at.
    // This should be right below the button.
    const position = this.getAbsoluteXY_();
    position.y = position.y + this.getSize().height;

    // Use Blockly's context menu utility to show the menu.
    ContextMenu.show(
      e,
      this.menuOptions_,
      this.sourceBlock_?.RTL ?? false,
      undefined,
      position,
    );
  }

  static fromJson(
    options: FieldContextButtonFromJsonConfig,
  ): FieldContextButton {
    return new FieldContextButton(options.text, []);
  }
}

export type FieldContextButtonConfig = FieldButtonConfig;

export interface FieldContextButtonFromJsonConfig
  extends FieldContextButtonConfig {
  text: string;
}
