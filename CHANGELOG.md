# Changelog

## 0.3.0

  - BREAKING: Use prettier 3

## 0.2.9

  - Fix: really use prettier > 2.8.8

## 0.2.8

  - Back to before, use prettier < 3 (^2.8.8)

## 0.2.7

  - Compile with webpack

## 0.2.6

  - Compile with `tsc`

## 0.2.5

  - Bundle `@prettier/plugin-pug` and do not minify to identify potential errors

## 0.2.4

  - Do not externalize prettier since v3 mess up with ESM / CJS imports

## 0.2.3

  - Bump `@prettier/plugin-pug`

## 0.2.2

  - Bump prettier to handle `satisfies` TS keyword properly

## 0.2.1

  - Use more versatile support for style tags (allow all attributes)

## 0.2.0

  - Support for multiple style tags in a single file

## 0.1.12

  - Fix `lru-cache` dependency (downgrade)

## 0.1.11

  - Re-add `lru-cache` dependency

## 0.1.10

  - Freeze dependencies and remove `lru-cache`

## 0.1.9

  - Add missing `lru-cache` dependency

## 0.1.8

  - Support `scoped` styles

## 0.1.7

  - Bump @prettier/plugin-pug

## 0.1.6

  - Prevent cahe when resolving prettier config so that any changes are live

## 0.1.5

  - Fix build missing dependencies: use esbuild and publish using no-yarn option

## 0.1.1

  - User can override vscode settings form `.stylusrc`

## 0.1.0

  - Initial release
