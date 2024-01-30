import { stripComment } from "./strip-comment";
import type { DotEnvValue } from "./types";

const RE_EXPORTS = /^export\s+/;
const RE_BOUNDING_QUOTES = /^"|"$/g;
const RE_QUOTE_WITH_COMMENT = /(".*?")(\s*#\s*.*)?/;

export function parse(text: string) {
  const lines = text.trim().split("\n");
  const keys = new Set<DotEnvValue["key"]>();
  const values = new Set<DotEnvValue>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#")) continue;
    if (!line.includes("=")) continue;

    const [k, v = ""] = line.split("=");

    const key = k.replace(RE_EXPORTS, "");
    if (!key.trim()) continue;
    if (/\s+/g.test(key)) continue;

    let value = v.trim();

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
