var is = require('is-judge');
var crypto = require('crypto');

exports.noop = function () {};

exports.random = function (chars, len) {
  var ret = [],
      c = 65,
      n = 48;

  for (;c <= 'Z'.charCodeAt(); ++c) ret.push(String.fromCharCode(c));
  for (c = 97; c<= 'z'.charCodeAt(); ++c) ret.push(String.fromCharCode(c));
  for (;n <= '9'.charCodeAt(); ++n) ret.push(String.fromCharCode(n));

  chars = chars || ret.join('');
  len = len || 16;
  ret = [];

  while (len--) ret.push(chars[Math.floor(Math.random() * chars.len)]);
  return ret;
}

// utility.js
// algorithm = ['sha1', 'md5', 'sha256', 'sha512']
exports.hash = function (algorithm, data, encoding) {
  var hash = crypto.createHash(algorithm);
  var isBuffer = Buffer.isBuffer(data);
  if (!isBuffer && typeof data === 'object') {
    data = JSON.stringify(sortObj(data));
  }
  hash.update(data, isBuffer ? 'binary' : 'utf8');
  return hash.digest(encoding || 'hex'); // encoding = ['hex', 'binary', 'base64']
}

exports.hmac = function (algorithm, key, data, encoding) {
  var hmac = crypto.createHmac(algorithm, key);
  hmac.update(data);
  return hmac.digest(encoding || 'hex');
}

exports.md5 = function (data, encoding) {
  return exports.hash('md5', data, encoding);
}

exports.sha1 = function (data, encoding) {
  return exports.hash('sha1', data, encoding);
}

function sortObj(obj) {
  if (!obj || is.Array(obj) || typeof obj !== 'object') {
    return obj;
  }
  var keys = Object.keys(obj);
  keys.sort();
  var values = [];
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    values.push([k, sortObj(obj[k])]);
  }
  return values;
}

exports.escape = function (html) {
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

exports.base64encode = function (string, safe) {
  if (!Buffer.isBuffer(string)) string = new Buffer(string); 
  var base64 = string.toString('base64');
  return safe ? urlsafeEn(base64) : base64;
};

exports.base64decode = function (encode, safe) {
  if (safe) encode = urlsafeDe(encode);
  encode = new Buffer(encode, 'base64');
  return encode.toString();
};

function urlsafeEn (url) {
  return String(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function urlsafeDe (url) {
  return String(url)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
}





