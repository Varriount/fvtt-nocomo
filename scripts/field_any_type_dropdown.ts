import { Field, FieldConfig, FieldValidator } from "blockly";

/**
 * An individual option in the dropdown menu. The first element is the human-
 * readable value (text or image), and the second element is the language-
 * neutral value.
 */
export type MenuOption<T> = [string, T];

/**
 * A function that generates an array of menu options for FieldDropdown
 * or its descendants.
 */
export type MenuGeneratorFunction<T> = (
  this: FieldTypedDropdown<T>,
) => MenuOption<T>[];

/**
 * Either an array of menu options or a function that generates an array of
 * menu options for FieldDropdown or its descendants.
 */
export type MenuGenerator<T> = MenuOption<T>[] | MenuGeneratorFunction<T>;

/**
 * Config options for the dropdown field.
 */
export type FieldTypedDropdownConfig = FieldConfig;

/**
 * fromJson config for the dropdown field.
 */
export interface FieldTypedDropdownFromJsonConfig<T>
  extends FieldTypedDropdownConfig {
  options?: MenuOption<T>[];
}

/**
 * A function that is called to validate changes to the field's value before
 * they are set.
 *
 * @param newValue
 *   The value to be validated.
 *
 * @returns
 *   One of three instructions for setting the new value:
 *     - `T` to set this function's returned value instead of `newValue`.
 *     - `null` to invoke `doValueInvalid_` and not set a value.
 *     - `undefined` to set `newValue` as is.
 */
export type FieldTypedDropdownValidator<T> = FieldValidator<T>;

/**
 * Custom Field class that behaves like FieldDropdown but allows storing values of any type.
 */
export class FieldTypedDropdown<T> extends Field {
  /**
   * Serializable fields are saved by the serializer, non-serializable fields
   * are not. Editable fields should also be serializable.
   */
  override SERIALIZABLE = true;

  /** Mouse cursor style when over the hotspot that initiates the editor. */
  override CURSOR = "default";

  override clickTarget_: SVGElement | null = null;

  /**
   * Sets the field's value based on the given XML element. Should only be
   * called by Blockly.Xml.
   *
   * @param fieldElement The element containing info about the field's state.
   * @internal
   */
  override fromXml(fieldElement: Element) {}

  /**
   * Sets the field's value based on the given state.
   *
   * @param state The state to apply to the dropdown field.
   * @internal
   */
  override loadState(state: AnyDuringMigration) {}

  /**
   * Create the block UI for this dropdown.
   */
  override initView() {}
}

/**
 * Register the custom field to Blockly.
 */
Blockly.fieldRegistry.register("field_typed_dropdown", FieldTypedDropdown);
