const QUOTE_CHARS = ['"', "'"];
const CHAR_COMMENT = "#";

/**
 * Removes inline comments from a single-line string.
 * "#" within a quoted string should be preserved.
 * @example `foo # bar` -> "foo"
 * @example `"foo"` -> "foo"
 * @example `'foo'` -> "foo"
 * @example `"foo'` -> `"foo'`
 */
export function stripComment(text: string) {
  const chars = text.split("");
  const first_char = chars[0];
  const is_quote_start = QUOTE_CHARS.includes(first_char);
  const start = is_quote_start ? 1 : 0;
  const break_char = is_quote_start ? first_char : CHAR_COMMENT;

  let value = "";

  for (let i = start; i < chars.length; i++) {
    const char = chars[i];

    if (char === break_char) {
      if (is_quote_start) {
        // Break the loop if it's the last char of if
        // the next, non-empty character is a comment.
        if (i === chars.length - 1) break;

        const next_chars = chars.slice(i + 1);
        if (next_chars.filter((char) => char.trim())[0] === CHAR_COMMENT) break;
      } else {
        // If the comment is reached, break the loop.
        if (break_char === CHAR_COMMENT) break;
      }
    }

    value += char;

    if (is_quote_start && i === chars.length - 1) {
      // If the end of the string is reached and the quote is not closed,
      // prepend the first character to the value.
      if (char !== break_char) {
        value = first_char + value;
      }
    }
  }

  return value.trim();
}

export function stripInlineComment(text: string, quote_char: string) {
  const chars = text.split("");

  let value = "";

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    // If the current character is a quote and the previous character is not a backslash
    if (char === quote_char && chars[i - 1] !== "\\") break;
    if (char === "#" && chars[i - 1] !== "\\") break;

    value += char;
  }

  return value.trim();
}
