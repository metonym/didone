export type DotEnvValue = {
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
