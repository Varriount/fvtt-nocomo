// @ts-ignore
import messages from "./messages.yaml";

/**
 */

export function localize(key: string): string | null {
  const parts = key.split(".");

  let result = messages;
  for (const part of parts) {
    result = result[part];
    if (result == null) {
      console.error(`No key for localization: ${key}`);
      return null;
    }
  }
  return result;
}
