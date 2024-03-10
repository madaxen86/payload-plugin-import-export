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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPlugin = void 0;
var container_1 = __importDefault(require("./components/container"));
var import_1 = require("./endpoints/import");
var webpack_1 = require("./webpack");
var importPlugin = function (pluginOptions) {
    return function (incomingConfig) {
        // =
        //   (pluginOptions: PluginTypes): Plugin =>
        //     (incomingConfig) => {
        var config = __assign({}, incomingConfig);
        // If you need to add a webpack alias, use this function to extend the webpack config
        var webpack = (0, webpack_1.extendWebpackConfig)(incomingConfig);
        config.admin = __assign(__assign({}, (config.admin || {})), { 
            // If you extended the webpack config, add it back in here
            // If you did not extend the webpack config, you can remove this line
            webpack: webpack });
        // If the plugin is disabled, return the config without modifying it
        // The order of this check is important, we still want any webpack extensions to be applied even if the plugin is disabled
        if (pluginOptions.enabled === false) {
            return config;
        }
        if (config.serverURL === undefined) {
            console.error("\x1b[101m \x1b[1m ERROR - Payload-Plugin-Import-Export: Please add a 'serverURL' in your payload config and restart the server \x1b[0m");
            return config;
        }
        config.collections = __spreadArray([], (config.collections || []).map(function (collection) {
            // Add additional collections here
            var _a, _b, _c, _d, _e;
            if ((_a = pluginOptions.excludeCollections) === null || _a === void 0 ? void 0 : _a.includes(collection.slug)) {
                return collection;
            }
            return __assign(__assign({}, collection), { endpoints: (collection.endpoints || []).concat([import_1.importEndpointConfig]), admin: __assign(__assign({}, collection.admin), { components: __assign(__assign({}, (_b = collection.admin) === null || _b === void 0 ? void 0 : _b.components), { BeforeListTable: (_e = (((_d = (_c = collection.admin) === null || _c === void 0 ? void 0 : _c.components) === null || _d === void 0 ? void 0 : _d.BeforeListTable) || [])) === null || _e === void 0 ? void 0 : _e.concat(container_1.default) }) }) });
        }), true);
        config.endpoints = __spreadArray([], (config.endpoints || []).concat(import_1.importEndpointConfig), true);
        config.globals = __spreadArray([], (config.globals || []), true);
        config.hooks = __assign({}, (config.hooks || {}));
        config.onInit = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!incomingConfig.onInit) return [3 /*break*/, 2];
                        return [4 /*yield*/, incomingConfig.onInit(payload)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        return config;
    };
};
exports.importPlugin = importPlugin;
