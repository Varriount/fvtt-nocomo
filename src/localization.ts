const messages: Record<string, string> = {
  "": "",
  "create_object.MESSAGE": "{ ${PROPERTIES} }",
  "get_single_object_property.MESSAGE":
    "Get the ${PROPERTY_NAME} property from ${OBJECT}",
  "get_multiple_object_property.MESSAGE":
    "Get the ${PROPERTY_NAME} property from ${OBJECTS}",
  "create_object_property.MESSAGE": "${PROPERTY_NAME} : ${PROPERTY_VALUE}",

  "plurality.MESSAGE": "",
  "single.MESSAGE": "",
  "multiple.MESSAGE": "",
  "text.MESSAGE": "",

  "generate_random_number.MESSAGE":
    "Generate a random ${number_kind} number that is " +
    "${minimum_value_operator} ${minimum_value} " +
    "and " +
    "${maximum_value_operator} ${maximum_value} ",
  "sample_list.MESSAGE":
    "Create a list of ${sample_size} random entries from ${list} ${copy_mode}" +
    " repetition",
  "shuffle_list.MESSAGE": "${copy_mode} ${list}",
};

/**
 */

export function localize(key: string): string {
  if (key in messages) {
    return messages[key];
  } else {
    console.error(`No key for localization: ${key}`);
    return key;
    // throw new Error(`No key for localization: ${key}`);
  }
}
