import * as Blockly from "blockly/core";

import { FixedEdgesMetricsManager } from "@blockly/fixed-edges";

import { colord, extend } from "colord";
import labPlugin from "colord/plugins/lab";

type ContainerRegion = Blockly.MetricsManager.ContainerRegion;

export function isString(value: unknown): value is string {
  return typeof value === "string" || value instanceof String;
}

export function verboseRegExp(input: TemplateStringsArray) {
  if (input.raw.length !== 1) {
    throw Error("verboseRegExp: interpolation is not supported");
  }

  const source = input.raw[0];

  // Match occurrences of:
  //   - One or more whitespace characters not preceded by a backslash.
  //   - "//" and all characters after, until the line ends.
  //   - "#" and all characters after, until the line ends.
  //   - "/*" and all characters after, across multiple lines, then "*/".
  // (group order matters!)
  const verbosePattern = /(?<!\\)\s+|[/][/].*|#.*|[/][*][\s\S]*[*][/]/gu;

  // Capture the flags specified in the (optional) PCRE-style modifier group
  // at the beginning of the string, followed by the actual regular expression
  // pattern.
  const modifierPattern = /^(?:[(][?]([a-z]+)[)])?(.+)/su;

  const [, flags, pattern] = source
    .replace(verbosePattern, "")
    .match(modifierPattern) as RegExpMatchArray;

  return new RegExp(pattern, flags);
}

export function* allMatches(regex: RegExp, text: string) {
  while (true) {
    const match = regex.exec(text);

    if (match == null) {
      break;
    }

    yield match;
  }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Extends the FixedEdges plugin's MetricsManager with compatibility logic
 * for the ScrollOptions plugin.
 */
export class CachedFixedEdgesMetricsManager extends FixedEdgesMetricsManager {
  useCachedContentMetrics = false;
  cachedContentMetrics: ContainerRegion | null = null;

  getContentMetrics() {
    if (this.useCachedContentMetrics && this.cachedContentMetrics) {
      return this.cachedContentMetrics;
    }

    this.cachedContentMetrics = super.getContentMetrics();
    return this.cachedContentMetrics;
  }
}

export function colourFromGoldenRatio(index: number): number {
  const goldenRatio = 222.492;
  return (goldenRatio * index) % 360;
}

// JavaScript implementation of DJB2
export function insecureHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); // Hash * 33 + c
  }
  return hash;
}

extend([labPlugin]);

export function colourViaStringHash(str: string): string {
  const l = 20 + (insecureHash(str + "a") % 60);
  const a = (insecureHash(str + "ab") % 160) - 80;
  const b = (insecureHash(str + "abc") % 160) - 80;

  return colord(colord({ l, a, b }).toRgb()).toHex();
}

export function mapSetDefault<K, V>(
  map: Map<K, V>,
  key: K,
  defaultValue: V,
): V {
  if (!map.has(key)) {
    map.set(key, defaultValue);
  }
  // Non-null assertion because the key is guaranteed to exist.
  return map.get(key)!;
}

/**
 *
 */

export interface MessageTokenKinds {
  text: "";
  newline: "";
  parameterName: "";
}

export type MessageTokenKind = keyof MessageTokenKinds;
const MESSAGE_REGEX = verboseRegExp`
    (?uy)                        // Match unicode, make sticky
    (?: [%][{] ( [^\}]+ ) [}] )  // Group 1: Parameter name to interpolate
  | (   \n )                     // Group 2: Newlines
  | (   [^\n%]+ )                // Group 3: Plain text
`;

export function* tokenizeMessage(message: string) {
  MESSAGE_REGEX.lastIndex = 0;
  message = message.replace("\\n", "\n");
  for (const match of allMatches(MESSAGE_REGEX, message)) {
    const [, parameterName, newline, text] = match;

    if (parameterName != null) {
      yield ["parameterName", parameterName];
      continue;
    }

    if (newline != null) {
      yield ["newline", newline];
      continue;
    }

    if (text != null) {
      yield ["text", text];
      continue;
    }
  }
}

// From https://stackoverflow.com/questions/62118966/exclude-unknown-from-a-union-with-a-tuple
type ExcludeUnknown<T> =
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  T extends Array<infer I> ? ({} extends I & {} ? never : T) : T;

// Prettier-ignore
export type ConstructorParameterSets<T> = ExcludeUnknown<
  T extends {
    new (...o: infer U): void;
    new (...o: infer U2): void;
    new (...o: infer U3): void;
    new (...o: infer U4): void;
    new (...o: infer U5): void;
    new (...o: infer U6): void;
    new (...o: infer U7): void;
  }
    ? [U, U2, U3, U4, U5, U6, U7]
    : T extends {
          new (...o: infer U): void;
          new (...o: infer U2): void;
          new (...o: infer U3): void;
          new (...o: infer U4): void;
          new (...o: infer U5): void;
          new (...o: infer U6): void;
        }
      ? [U, U2, U3, U4, U5, U6]
      : T extends {
            new (...o: infer U): void;
            new (...o: infer U2): void;
            new (...o: infer U3): void;
            new (...o: infer U4): void;
            new (...o: infer U5): void;
          }
        ? [U, U2, U3, U4, U5]
        : T extends {
              new (...o: infer U): void;
              new (...o: infer U2): void;
              new (...o: infer U3): void;
              new (...o: infer U4): void;
            }
          ? [U, U2, U3, U4]
          : T extends {
                new (...o: infer U): void;
                new (...o: infer U2): void;
                new (...o: infer U3): void;
              }
            ? [U, U2, U3]
            : T extends {
                  new (...o: infer U): void;
                  new (...o: infer U2): void;
                }
              ? [U, U2]
              : T extends {
                    new (...o: infer U): void;
                  }
                ? U
                : never
>;

// Prettier-ignore
export type FunctionParameterSets<T> = ExcludeUnknown<
  T extends {
    (...o: infer U): void;
    (...o: infer U2): void;
    (...o: infer U3): void;
    (...o: infer U4): void;
    (...o: infer U5): void;
    (...o: infer U6): void;
    (...o: infer U7): void;
  }
    ? [U, U2, U3, U4, U5, U6, U7]
    : T extends {
          (...o: infer U): void;
          (...o: infer U2): void;
          (...o: infer U3): void;
          (...o: infer U4): void;
          (...o: infer U5): void;
          (...o: infer U6): void;
        }
      ? [U, U2, U3, U4, U5, U6]
      : T extends {
            (...o: infer U): void;
            (...o: infer U2): void;
            (...o: infer U3): void;
            (...o: infer U4): void;
            (...o: infer U5): void;
          }
        ? [U, U2, U3, U4, U5]
        : T extends {
              (...o: infer U): void;
              (...o: infer U2): void;
              (...o: infer U3): void;
              (...o: infer U4): void;
            }
          ? [U, U2, U3, U4]
          : T extends {
                (...o: infer U): void;
                (...o: infer U2): void;
                (...o: infer U3): void;
              }
            ? [U, U2, U3]
            : T extends {
                  (...o: infer U): void;
                  (...o: infer U2): void;
                }
              ? [U, U2]
              : T extends {
                    (...o: infer U): void;
                  }
                ? U
                : never
>;

export type AllOrNone<T> = T | Partial<Record<keyof T, never>>;
