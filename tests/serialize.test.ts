import { describe, expect, test } from "bun:test";
import { serialize } from "../src";

describe("serialize", () => {
  test("single-line", () => {
    expect(
      serialize([
        {
          duplicate: false,
          key: "FOO",
          value: "bar",
        },
      ])
    ).toEqual("FOO=bar");
  });

  test("multiline", () => {
    expect(
      serialize([
        {
          duplicate: false,
          key: "FOO",
          value: "bar",
        },
        {
          duplicate: false,
          key: "foo",
          value: "bar",
        },
        {
          duplicate: false,
          key: "PORT",
          value: '30#30',
        },
        {
          duplicate: false,
          key: "PRIVATE_KEY",
          value: `-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----
`,
        },
      ])
    ).toEqual('FOO=bar\nfoo=bar\nPORT="30#30"\nPRIVATE_KEY=\"-----BEGIN RSA PRIVATE KEY-----\n-----END RSA PRIVATE KEY-----\n\"');
  });

  test("with duplicates", () => {
    expect(
      serialize([
        {
          duplicate: false,
          key: "FOO",
          value: "bar",
        },
        {
          duplicate: false,
          key: "FOO",
          value: "bar",
        },
      ])
    ).toEqual("FOO=bar\nFOO=bar");
  });

  test("without duplicates", () => {
    expect(
      serialize(
        [
          {
            duplicate: false,
            key: "FOO",
            value: "bar",
          },
          {
            duplicate: true,
            key: "FOO",
            value: "bar",
          },
        ],
        { removeDuplicates: true }
      )
    ).toEqual("FOO=bar");
  });
});
