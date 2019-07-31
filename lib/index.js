"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = require("querystring");
var json5_1 = __importDefault(require("json5"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var loader = function (source, sourceMap) {
    if (this.version && Number(this.version) >= 2) {
        try {
            this.cacheable && this.cacheable();
            this.callback(null, "module.exports = " + generateCode(source, querystring_1.parse(this.resourceQuery)), sourceMap);
        }
        catch (err) {
            this.emitError(err.message);
            this.callback(err);
        }
    }
    else {
        var message = 'support webpack 2 later';
        this.emitError(message);
        this.callback(new Error(message));
    }
};
function generateCode(source, query) {
    var _a;
    var data = convert(source, query.lang);
    var value = JSON.parse(data);
    if (query.locale && typeof query.locale === 'string') {
        value = Object.assign({}, (_a = {}, _a[query.locale] = value, _a));
    }
    value = JSON.stringify(value)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
        .replace(/\\/g, '\\\\');
    var code = '';
    code += "function (Component) {\n  Component.options.__i18n = Component.options.__i18n || []\n  Component.options.__i18n.push('" + value.replace(/\u0027/g, '\\u0027') + "')\n  delete Component.options._Ctor\n}\n";
    return code;
}
function convert(source, lang) {
    var value = Buffer.isBuffer(source) ? source.toString() : source;
    switch (lang) {
        case 'yaml':
        case 'yml':
            var data = js_yaml_1.default.safeLoad(value);
            return JSON.stringify(data, undefined, '\t');
        case 'json5':
            return JSON.stringify(json5_1.default.parse(value));
        default:
            return value;
    }
}
exports.default = loader;
