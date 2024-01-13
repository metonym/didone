import { stripComment } from "./strip-comment";
import type { DotEnvValue } from "./types";

const RE_VALID_ENV_KEY = /^[a-zA-Z_.-][a-zA-Z0-9_.-]*$/;
const RE_EXPORTS = /^export\s+/;
const RE_BOUNDING_QUOTES = /^"|"$/g;
const RE_QUOTE_WITH_COMMENT = /(".*?")(\s*#\s*.*)?/;

type ParseOptions = {
  /**
   * Customize the RegEx used to assert valid env keys.
   * By default, keys must be alphanumeric and must not start with a number.
   * However, keys can start with or contain underscores, dashes, and periods.
   * @default /^[a-zA-Z_.-][a-zA-Z0-9_.-]*$/
   * @example
   * "FOO"     // valid
   * "FOO_BAR" // valid
   * "FOO-BAR" // valid
   * "FOO.BAR" // valid
   * "42"      // invalid
   */
  regexEnvKey?: RegExp;
};

export function parse(text: string, options?: ParseOptions) {
  const { regexEnvKey = RE_VALID_ENV_KEY } = options || {};
  const lines = text.split("\n");
  const keys = new Set<DotEnvValue["key"]>();
  const values = new Set<DotEnvValue>();

  for (let i = 0; i < lines.length; i++) {
    const [k, v = ""] = lines[i].trim().split("=");

    const key = k.replace(RE_EXPORTS, "");
    if (!regexEnvKey.test(key)) continue;

    let value = v.trim();
    if (!value) continue;

    if (value.startsWith('"') && !RE_QUOTE_WITH_COMMENT.test(value)) {
      let multiline_value = value.replace(RE_BOUNDING_QUOTES, "");

      while (i < lines.length - 1 && !lines[i].endsWith('"')) {
        i += 1;
        multiline_value += "\n" + stripComment(lines[i]).replace(/"$/, "");
      }

      value = multiline_value;
    } else {
      value = stripComment(value);
    }

    values.add({ key, value, duplicate: keys.has(key) });
    keys.add(key);
  }

  return Array.from(values);
}
