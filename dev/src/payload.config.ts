import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import Examples from "./collections/Examples";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { viteBundler } from "@payloadcms/bundler-vite";
import { slateEditor } from "@payloadcms/richtext-slate";

//@ts-ignore - ... is not under 'rootDir'
import { importPlugin } from "../../src/index";

import { Configuration } from "webpack";

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          fallback: {
            ...config?.resolve?.fallback,
          },
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, "../node_modules/react"),
            "react-dom": path.join(__dirname, "../node_modules/react-dom"),
            payload: path.join(__dirname, "../node_modules/payload"),
          },
        },
      };
      return newConfig as Configuration;
    },
  },
  editor: slateEditor({}),
  collections: [Examples, Users],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  //@ts-ignore
  plugins: [importPlugin({ enabled: true })],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  localization: {
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        label: "English",
      },
      {
        code: "de",
        label: "Deutsch",
      },
    ],
  },
});

// webpack: config => {
//   // full control of the Webpack config
//   config.resolve.fallback["fs"] = false;
//   config.resolve.alias = {
//     ...config.resolve.alias,
//     payload: path.resolve("./node_modules/payload"), // this will fix the components usage of `useConfig` hook
//   };
//   return config;
// },
