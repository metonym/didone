/**
 * Removes inline comments from a single-line string.
 * "#" within a quoted string should be preserved.
 * @example `foo # bar` -> "foo"
 * @example `"foo # bar"` -> "foo # bar"
 */
export function stripComment(text: string) {
  const chars = text.split("");
  const start = chars[0] === '"' ? 1 : 0;
  const break_char = chars[0] === '"' ? '"' : "#";

  let value = "";

  for (let i = start; i < chars.length; i++) {
    const char = chars[i];

    if (char === break_char) break;
    value += char;
  }

  return value.trim();
}
