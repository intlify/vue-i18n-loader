"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = require("querystring");
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
    var code = '';
    var value = typeof source === 'string'
        ? JSON.parse(source)
        : Buffer.isBuffer(source)
            ? JSON.parse(source.toString())
            : null;
    if (value === null) {
        throw new Error('invalid source!');
    }
    if (query.locale && typeof query.locale === 'string') {
        value = Object.assign({}, (_a = {}, _a[query.locale] = value, _a));
    }
    value = JSON.stringify(value)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
        .replace(/\\/g, '\\\\');
    code += "function (Component) {\n  Component.options.__i18n = Component.options.__i18n || []\n  Component.options.__i18n.push('" + value.replace(/\u0027/g, '\\u0027') + "')\n  delete Component.options._Ctor\n}\n";
    return code;
}
exports.default = loader;
