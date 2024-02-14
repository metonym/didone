import { describe, expect, test } from "bun:test";
import { stripComment } from "../src/strip-comment";

describe("stripComment", () => {
  test.each(["abc#xyz", "abc # xyz"])("inline comment", (text) => {
    expect(stripComment(text)).toEqual("abc");
  });

  test.each(['"abc#xyz"', '"abc#xyz"#', '"abc#xyz" # xyz'])(
    "quoted (double)",
    (text) => {
      expect(stripComment(text)).toEqual("abc#xyz");
    }
  );

  test.each(["'abc#xyz'", "'abc#xyz'#", "'abc#xyz' # xyz"])(
    "quoted (single)",
    (text) => {
      expect(stripComment(text)).toEqual("abc#xyz");
    }
  );

  test("quotes (preserved)", () => {
    expect(stripComment('\""abc#xyz\""')).toEqual('"abc#xyz"');
    expect(stripComment("''abc#xyz''")).toEqual("'abc#xyz'");
  });

  test("quoted (mixed)", () => {
    expect(stripComment("\"abc#xyz'")).toEqual("\"abc#xyz'");
    expect(stripComment("'abc#xyz'\"")).toEqual("'abc#xyz'\"");
  });

  test("unterminated quote", () => {
    expect(stripComment('"abc#xyz')).toEqual('"abc#xyz');
    expect(stripComment("'abc#xyz")).toEqual("'abc#xyz");

    // In this case, the quote is part of the comment
    expect(stripComment('abc#xyz"')).toEqual("abc");
    expect(stripComment("abc#xyz'")).toEqual("abc");
  });
});
