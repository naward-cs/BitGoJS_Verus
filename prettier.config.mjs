/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */
//@ts-check


/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  endOfLine: 'lf',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  bracketSpacing: false,
  trailingComma: "all",
  arrowParens: "avoid",
  plugins: [
    '@ianvs/prettier-plugin-sort-imports'
  ],
  importOrder: [
    '<TYPES>^[./]',
    '<TYPES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^[./]',
    '',
    '^types$',
  ],
  importOrderParserPlugins: [ 'typescript', 'decorators-legacy' ],
  importOrderTypeScriptVersion: '5.8.0',
}
export default config