# Payload Plugin Import / Export

A plugin for [Payload CMS](https://payloadcms.com) to import and export JSON and CSV files.
You can use this to change data for many records e.g. translate content... from collections.

All parsing and transformations are done on the client keeping the load from the server.


## Installation

```js
npm i payload-plugin-import-export
```
```js
yarn add payload-plugin-import-export
```
```js
pnpm add payload-plugin-import-export
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
| **prop** | **type** | **default** |
|----------|----------|-------------|
| enabled  | boolean  | true        |

## What you need to know

The purpose lies solely on changing already existing records - new records will fail on import.

### Selecting fields
On import and export you can select fields.

### Filter exports
The filters set on the collections will also be passed to

### Access control
This plugin obeys all access control rules.

### File formats
When importing / exporting JSON the data will be shaped like via the REST API.

For CSV exports the data will be "flattened" for any field type which contains nested data (arrays,rows,tabs).
When importing the data will get "unflattened". Make sure to not change any header names.
