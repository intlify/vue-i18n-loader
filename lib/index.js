'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (content) {
  if (this.version && this.version >= 2) {
    try {
      this.cacheable();
      this.callback(null, generateCode(content));
    } catch (err) {
      this.emitError(err.message);
      this.callback(err);
    }
  } else {
    var message = 'support webpack 2 later';
    this.emitError(message);
    this.callback(new Error(message));
  }
};

function generateCode(content) {
  var code = '';

  var value = typeof content === 'string' ? JSON.parse(content) : content;
  value = JSON.stringify(value).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

  code += 'module.exports = function (Component) {\n  Component.options.__i18n = Component.options.__i18n || []\n  Component.options.__i18n.push(\'' + value.replace(/\u0027/g, '\\u0027') + '\')\n}\n';
  return code;
}