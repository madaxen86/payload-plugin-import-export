"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("payload/config");
var path_1 = require("path");
var Users_1 = __importDefault(require("./collections/Users"));
var Examples_1 = __importDefault(require("./collections/Examples"));
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
//@ts-ignore - ... is not under 'rootDir'
var index_1 = require("../../src/index");
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
    admin: {
        user: Users_1.default.slug,
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        webpack: function (config) {
            var _e, _10;
            var newConfig = __assign(__assign({}, config), { resolve: __assign(__assign({}, config.resolve), { fallback: __assign({}, (_e = config === null || config === void 0 ? void 0 : config.resolve) === null || _e === void 0 ? void 0 : _e.fallback), alias: __assign(__assign({}, (((_10 = config === null || config === void 0 ? void 0 : config.resolve) === null || _10 === void 0 ? void 0 : _10.alias) || {})), { react: (0, path_1.join)(__dirname, "../node_modules/react"), "react-dom": (0, path_1.join)(__dirname, "../node_modules/react-dom"), payload: (0, path_1.join)(__dirname, "../node_modules/payload") }) }) });
            return newConfig;
        },
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    collections: [Examples_1.default, Users_1.default],
    typescript: {
        outputFile: (0, path_1.resolve)(__dirname, "payload-types.ts"),
    },
    graphQL: {
        schemaOutputFile: (0, path_1.resolve)(__dirname, "generated-schema.graphql"),
    },
    //@ts-ignore
    plugins: [(0, index_1.importExportPlugin)({ enabled: true })],
    db: (0, db_mongodb_1.mongooseAdapter)({
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
//     payload:resolve("./node_modules/payload"), // this will fix the components usage of `useConfig` hook
//   };
//   return config;
// },
