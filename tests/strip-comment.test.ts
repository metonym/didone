import { describe, expect, test } from "bun:test";
import { stripComment } from "../src/strip-comment";

describe("stripeComment", () => {
  test("inline comment", () => {
    expect(stripComment("abc#xyz")).toEqual("abc");
  });

  test("inline comment", () => {
    expect(stripComment("abc # xyz")).toEqual("abc");
  });

  test("quoted", () => {
    expect(stripComment('"abc#xyz"')).toEqual("abc#xyz");
  });
});
