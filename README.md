# Payload Plugin Import / Export

A plugin for [Payload CMS](https://payloadcms.com) to import and export JSON and CSV files.
You can use this to change data for many records e.g. translate content... from collections.

All parsing and transformations are done on the client keeping the load from the server.


## Installation

```js
npm i "payload-plugin-import-export"
```
```js
yarn add "payload-plugin-import-export"
```
```js
pnpm add "payload-plugin-import-export"
```


```ts
import importExportPlugin  from 'payload-plugin-import-export';

export const config = buildConfig({
  serverUrl:process.env.PAYLOAD_PUBLIC_SERVER_URL //Required!
  plugins: [
    importExportPlugin({
		  enabled: true,
    }),
  ]
});
```

<!-- add table for plugin props -->
## Config
| PROP                | TYPE     | DEFAULT     | DESCRIPTION                                         |
|---------------------|----------|-------------|-----------------------------------------------------|
| enabled             | boolean  | true        | Enable/disable plugin                               |
| excludeCollections  | string[] | undefined   | List of collection slugs to not display the buttons |
| redirectAfterImport | boolean  | true        | Redirect back to collection after import            |

## How to use

The purpose lies solely on changing already existing records - new records will fail on import and you can download csv or json with the failed items.

### Selecting fields
On import and export you can select fields.

### Filter and sorting exports
The filters set on the collections will also be used for  exporting items.

### Access control
This plugin obeys all access control rules, so exports will only include the fields with read access.
On import missing permission on field level will not result in an error. The fields will just be ignored.

### Localization
If localization is configured imports and export will be done in current selected locale.
Caution: If field is not localized the "global" value will be overwritten.

### File formats
#### JSON
When importing / exporting JSON the data will be shaped like via the REST API.
#### CSV
For CSV exports the data will be "flattened" for any field type which contains nested data (arrays,rows,tabs). e.g.:
```json
[{
  "id": "65e",
  "title": "Foo",
  "array": [
    {
      "title_array": "Bar",
    },
    {
      "title_array": "Baz",
    },
  ],
  "tab": {
      "title_tab": "Boz",
  },
}]

```
will become
|id|title|array.0.title_array|array.1.title_array|tab.title_tab|
|--|-----|-------------------|-------------------|-------------|
|65e|Foo|Bar|Baz|Boz|

When importing the data will get "unflattened". Make sure to not change any header names.

## License

MIT

