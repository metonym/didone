import type { DotEnvValue } from "./types";

type SerializeOptions = {
  /**
   * If `true`, duplicate keys will be removed.
   * @default false
   */
  removeDuplicates?: boolean;
};

export function serialize(values: DotEnvValue[], options?: SerializeOptions) {
  const removeDuplicates = options?.removeDuplicates === true;

  let text = "";

  for (const { key, value, duplicate } of values) {
    if (duplicate && removeDuplicates) continue;
    text += `${key}=${/(#|\n)/.test(value) ? `"${value}"` : value}\n`;
  }

  return text.trimEnd();
}
