import { stripComment, stripInlineComment } from "./strip-comment";
import type { DotEnvValue } from "./types";

const RE_SET_VERB = /^(export|set)\s+/;
const RE_WHITE_SPACE = /\s+/g;
const RE_BOUNDING_QUOTES_DOUBLE = /^"|"$/g;
const RE_BOUNDING_QUOTES_SINGLE = /^'|'$/g;
const RE_QUOTE_WITH_COMMENT = /(('.*?'|".*?")(\s*#\s*.*)?)$/;
const RE_QUOTE = /("|')/;

export function parse(text: string) {
  const lines = text.trim().split("\n");
  const keys = new Set<DotEnvValue["key"]>();
  const values = new Set<DotEnvValue>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#")) continue;
    if (!line.includes("=")) continue;

    const [k, ...v] = line.split("=");
    const key = k.replace(RE_SET_VERB, "").trim();

    if (!key) continue;
    if (RE_WHITE_SPACE.test(key)) continue;

    let value = v.join("=").trim();

    if (RE_QUOTE.test(value[0]) && !RE_QUOTE_WITH_COMMENT.test(value)) {
      const start_quote = value[0];
      const quote_bound =
        start_quote === '"'
          ? RE_BOUNDING_QUOTES_DOUBLE
          : RE_BOUNDING_QUOTES_SINGLE;
      const quote_end = new RegExp(start_quote + "$");
      let multiline_value = value.replace(quote_bound, "");

      while (i < lines.length - 1) {
        i += 1;

        if (
          lines[i].includes(start_quote) &&
          !/\\/.test(lines[i].charAt(lines[i].indexOf(start_quote) - 1))
        ) {
          multiline_value +=
            "\n" +
            stripInlineComment(lines[i], start_quote).replace(quote_end, "");
          break;
        }

        multiline_value += "\n" + stripComment(lines[i]).replace(quote_end, "");
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
