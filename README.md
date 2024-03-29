# didone

> Minimalist dotenv-like parser for the browser.

> Pronounced "dee-doh-neh".

This zero-dependency library is a minimalist dotenv-like parser. It intentionally does not perform validation and is simply designed to extract key-value pairs from a given string. The `parse` function returns an array of objects with the following properties:

- `key`: The key of the variable.
- `value`: The value of the variable. Multiline values are supported.
- `duplicate`: Whether the key is duplicated or not.

```dotenv
DB_HOST=localhost
DB_PORT="5432"
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

If the provided text does not contain any key-value pairs, an empty array is returned.

## Install

```sh
npm i didone
```

## Usage

### `parse`

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

### `serialize`

```js
import { serialize } from "didone";

const text = serialize([
  {
    duplicate: false,
    key: "FOO",
    value: "bar",
  },
]);

console.log(text); // "FOO=bar"
```

#### Options

Set `removeDuplicates` to `true` to remove duplicate keys.

```js
serialize(values, {
  removeDuplicates: true,
});
```

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

[MIT](LICENSE)
