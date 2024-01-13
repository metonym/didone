# didone

> Minimalist dotenv-like parser for the browser

This zero-dependency library is a minimalist dotenv-like parser for the browser. Given a string, it returns an array of objects with the following properties:

- `key`: The key of the variable.
- `value`: The value of the variable. Multi-line values are supported.
- `duplicate`: Whether the key is duplicated or not.

```dotenv
DB_HOST=localhost
DB_PORT="5432" # Quoted values
DB_USER=myuser
DB_USER=myuser2 # Duplicate keys are parsed but marked as duplicates
```

**Output**

```json
[
  {
    "duplicate": false,
    "key": "DB_HOST",
    "value": "localhost"
  },
  {
    "duplicate": false,
    "key": "DB_PORT",
    "value": "5432"
  },
  {
    "duplicate": false,
    "key": "DB_USER",
    "value": "myuser"
  },
  {
    "duplicate": true,
    "key": "DB_USER",
    "value": "myuser2"
  }
]
```

## Install

```sh
npm i didone
```

## Usage

```js
import { parse } from "didone";

const values = parse(
  `
DB_HOST=localhost
DB_PORT="5432" # Quoted values
DB_USER=myuser
  `
);
```

### Options

The default RegEx used to validate env keys is `/^[a-zA-Z_.-][a-zA-Z0-9_.-]*$/`. This means that keys must be alphanumeric but must not start with a number. However, they can start with or contain underscores, dashes, and periods.

You can customize the RegEx via the `regexEnvKey` option.

```js
parse("...", {
  regexEnvKey: /^[a-zA-Z][a-zA-Z0-9_.-]*$/,
});
```

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

[MIT](LICENSE)
