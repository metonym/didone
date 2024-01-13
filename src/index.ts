const RE_VALID_ENV_KEY = /^[a-zA-Z_.-][a-zA-Z0-9_.-]*$/;
const RE_EXPORTS = /^export\s+/;
const RE_BOUNDING_QUOTES = /^"|"$/g;
const RE_QUOTE_WITH_COMMENT = /(".*?")(\s*#\s*.*)?/;

type DotEnvValue = {
  /**
   * The key of the environment variable.
   */
  key: string;

  /**
   * The value of the environment variable.
   * Multiline values are supported.
   */
  value: string;

  /**
   * `true` if the key is a duplicate of another key.
   * Its value will still be parsed.
   */
  duplicate: boolean;
};

type Options = {
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

export function parseDotEnv(text: string, options?: Options) {
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
        multiline_value += "\n" + removeComment(lines[i]).replace(/"$/, "");
      }

      value = multiline_value;
    } else {
      value = removeComment(value);
    }

    values.add({ key, value, duplicate: keys.has(key) });
    keys.add(key);
  }

  return Array.from(values);
}

function removeComment(text: string) {
  const chars = text.split("");

  let value = "";
  let start = chars[0] === '"' ? 1 : 0;
  let break_char = chars[0] === '"' ? '"' : "#";

  for (let i = start; i < chars.length; i++) {
    const char = chars[i];

    if (char === break_char) break;
    value += char;
  }

  return value.trim();
}
