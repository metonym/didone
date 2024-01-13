import { describe, expect, test } from "bun:test";
import { parseDotEnv } from "../src";

describe("parseDotEnv", () => {
  test.each(["1=bar", "Ü="])("invalid key", (text) => {
    expect(parseDotEnv(text)).toEqual([]);
  });

  test.each([
    "export FOO=bar",
    "FOO=bar",
    "FOO=bar # comment",
    " FOO= bar ",
    "\nFOO=bar\n ",
    '# Comment\nFOO="bar"\n\n# Another comment',
  ])("single-line", (text) => {
    expect(parseDotEnv(text)).toEqual([
      {
        duplicate: false,
        key: "FOO",
        value: "bar",
      },
    ]);
  });

  test.each([
    "export foo=bar",
    "foo=bar",
    " foo= bar ",
    "foo=bar # comment",
    "\nfoo=bar\n ",
    '# Comment\nfoo="bar"\n\n# Another comment',
  ])("single-line, lowercase", (text) => {
    expect(parseDotEnv(text)).toEqual([
      {
        duplicate: false,
        key: "foo",
        value: "bar",
      },
    ]);
  });

  test.each([
    'FOO="abc#xyz"',
    'FOO="abc#xyz" # comment',
    '# comment\nFOO="abc#xyz"\n',
  ])("single-line, quoted", (text) => {
    expect(parseDotEnv(text)).toEqual([
      {
        duplicate: false,
        key: "FOO",
        value: "abc#xyz",
      },
    ]);
  });

  test("multiline with inline comment", () => {
    expect(parseDotEnv(`FOO="bar\nbaz"    # comment`)).toEqual([
      {
        duplicate: false,
        key: "FOO",
        value: "bar\nbaz",
      },
    ]);
  });

  test("multiline with inline comment", () => {
    expect(
      parseDotEnv(`FOO="start
...
end"    # comment`)
    ).toEqual([
      {
        duplicate: false,
        key: "FOO",
        value: "start\n...\nend",
      },
    ]);
  });

  test("multiline with comments", () => {
    expect(
      parseDotEnv(`# Comment
FOO="start"

## Another comment
`)
    ).toEqual([
      {
        duplicate: false,
        key: "FOO",
        value: "start",
      },
    ]);
  });

  test("non-env var text", () => {
    expect(
      parseDotEnv(`type DotEnvValue = {
  key: string;
  value: string;
  duplicate: boolean;
};
`)
    ).toEqual([]);
  });

  test("unterminated quoted string", () => {
    expect(
      parseDotEnv(`APP_ENV="development
A_SECRET=123456789abcdef`)
    ).toEqual([
      {
        duplicate: false,
        key: "APP_ENV",
        value: "development\nA_SECRET=123456789abcdef",
      },
    ]);
  });

  test("kitchen sink", () => {
    expect(
      parseDotEnv(`# Database configuration
DB_HOST=localhost
DB_PORT="5432" # Port is read as a string
DB_USER=myuser`)
    ).toMatchSnapshot();

    expect(
      parseDotEnv(`
# comment
export SMTP=4000
foo=bar
FOO=42
WITH-HYPEHN=1
WITH.period=1
ÜBER=ÜBER
234=123
SIMPLE=xyz123
WITH_INLINE_COMMENT=abc # comment
WITH_INLINE_COMMENT2="abc"
SINGLE_WITH_LINE_BREAKS="Multiple\nLines and variable substitution"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...

...
-----END RSA PRIVATE KEY-----
"
SIMPLE=abc
PRIVATE_KEY=abc
`)
    ).toMatchSnapshot();
  });
});
