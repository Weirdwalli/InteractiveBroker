/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");

var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");

var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");

var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false; // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.

    if ( true && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;

      request.onprogress = function handleProgress() {};

      request.ontimeout = function handleTimeout() {};
    } // HTTP basic authentication


    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true); // Set the request timeout in MS

    request.timeout = config.timeout; // Listen for ready state

    request[loadEvent] = function handleLoad() {
      if (!request || request.readyState !== 4 && !xDomain) {
        return;
      } // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request


      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      } // Prepare the response


      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(resolve, reject, response); // Clean up request

      request = null;
    }; // Handle low level network errors


    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request)); // Clean up request

      request = null;
    }; // Handle timeout


    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.


    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js"); // Add xsrf header


      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    } // Add headers to the request


    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    } // Add withCredentials to request if needed


    if (config.withCredentials) {
      request.withCredentials = true;
    } // Add responseType to request if needed


    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    } // Handle progress if needed


    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    } // Not all browsers support upload events


    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel); // Clean up request

        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    } // Send the request


    request.send(requestData);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");

var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */


function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

  utils.extend(instance, Axios.prototype, context); // Copy context to instance

  utils.extend(instance, context);
  return instance;
} // Create the default instance to be exported


var axios = createInstance(defaults); // Expose Axios class to allow class inheritance

axios.Axios = Axios; // Factory for creating new instances

axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
}; // Expose Cancel & CancelToken


axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js"); // Expose all/spread

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");
module.exports = axios; // Allow use of default import syntax in TypeScript

module.exports.default = axios;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ (function(module) {

"use strict";

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;
module.exports = Cancel;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */


function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */


CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");

var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */


function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */


Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {
    method: 'get'
  }, this.defaults, config);
  config.method = config.method.toLowerCase(); // Hook up interceptors middleware

  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
}; // Provide aliases for supported request methods


utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
module.exports = Axios;

/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}
/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */


InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};
/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */


InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */


InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */


module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");

var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");

var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */


module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config); // Support baseURL config

  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  } // Ensure headers exist


  config.headers = config.headers || {}; // Transform request data

  config.data = transformData(config.data, config.headers, config.transformRequest); // Flatten headers

  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});
  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config); // Transform response data

    response.data = transformData(response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config); // Transform response data

      if (reason && reason.response) {
        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;

  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  return error;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */


module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus; // Note: status is not exposed by XDomainRequest

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */


module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });
  return data;
};

/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;

  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }

  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }

    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }

    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }

    return data;
  }],
  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        /* Ignore */
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
module.exports = defaults;

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(thisArg, args);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/***/ (function(module) {

"use strict";
 // btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}

E.prototype = new Error();
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';

  for ( // initialize result and counter
  var block, charCode, idx = 0, map = chars; // if the next str index does not exist:
  //   change the mapping table to "="
  //   check if d has no fractional digits
  str.charAt(idx | 0) || (map = '=', idx % 1); // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
  output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
    charCode = str.charCodeAt(idx += 3 / 4);

    if (charCode > 0xFF) {
      throw new E();
    }

    block = block << 8 | charCode;
  }

  return output;
}

module.exports = btoa;

/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */


module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(encode(key) + '=' + encode(v));
      });
    });
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() : // Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;
  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */

  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);
  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */

  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js"); // Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers


var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */

module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }

      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });
  return parsed;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ (function(module) {

"use strict";

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");
/*global toString:true*/
// utils is a library of generic helper functions non-specific to axios


var toString = Object.prototype.toString;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */

function isArray(val) {
  return toString.call(val) === '[object Array]';
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */


function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}
/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */


function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */


function isArrayBufferView(val) {
  var result;

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }

  return result;
}
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */


function isString(val) {
  return typeof val === 'string';
}
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */


function isNumber(val) {
  return typeof val === 'number';
}
/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */


function isUndefined(val) {
  return typeof val === 'undefined';
}
/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */


function isObject(val) {
  return val !== null && typeof val === 'object';
}
/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */


function isDate(val) {
  return toString.call(val) === '[object Date]';
}
/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */


function isFile(val) {
  return toString.call(val) === '[object File]';
}
/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */


function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */


function isFunction(val) {
  return toString.call(val) === '[object Function]';
}
/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */


function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */


function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */


function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */


function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */


function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  } // Force an array if not already something iterable


  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */


function merge() {
  var result = {};

  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */


function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names

module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/***/ (function(module) {

"use strict";


function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/***/ (function(module) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};

function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
} // For Node v0.10 support. Remove this eventually.


function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _api___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/ */ "./src/api/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'Capital',
  props: {
    netCapitalList: Array
  },
  data: function data() {
    return {};
  },
  methods: {
    getURLFocusFilingData: function getURLFocusFilingData() {
      window.location.href = "/en/index.php?f=7498";
    }
  },
  mounted: function mounted() {},
  updated: function updated() {},
  watch: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _api___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/ */ "./src/api/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'CustomerMoneySegregationComputation',
  props: {
    CommodityDomesticSegregationList: Array,
    CommodityForeignSegregationList: Array,
    Securities15c3SegregationList: Array
  },
  data: function data() {
    return {};
  },
  methods: {
    getURLCFTCDisclosure: function getURLCFTCDisclosure() {
      window.location.href = "/download/Statement_of_Financial_Condition and_Supplemental_Schedules_(Audited)_12-31-14.pdf";
    },
    getURLCFTCDetails: function getURLCFTCDetails() {
      window.location.href = "/en/index.php?f=14694";
    }
  },
  mounted: function mounted() {},
  updated: function updated() {},
  watch: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _api___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/ */ "./src/api/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FutureCustomerConcentration',
  props: {
    Cust50PercentNetLiqList: Array
  },
  data: function data() {
    return {};
  },
  methods: {},
  mounted: function mounted() {},
  updated: function updated() {},
  watch: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _api___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/ */ "./src/api/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FuturesMarginRequirements',
  props: {
    netCapitalList: Array
  },
  data: function data() {
    return {};
  },
  methods: {},
  mounted: function mounted() {},
  updated: function updated() {},
  watch: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _view_RegulatoryInformationView_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/RegulatoryInformationView.vue */ "./src/view/RegulatoryInformationView.vue");
//
//
//
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'index',
  components: {
    RegulatoryInformationView: _view_RegulatoryInformationView_vue__WEBPACK_IMPORTED_MODULE_0__.default
  },
  data: function data() {
    return {
      translations: {"translations":{"en":{"add_info_header":"Additional Information","add_info_nfa_link":"(http://www.nfa.futures.org/basicnet/)","add_info_para_1_1":"Additional information is available on the National Futures Association website by searching for Interactive Brokers LLC in NFA's BASIC system","add_info_para_1_2":", clicking on 'Interactive Brokers LLC', then 'View Financial Information' and then viewing the data available under FCM Capital Report  (Updated Monthly), FCM Customer Segregated Funds Report (Updated Semi-Monthly), FCM Customer Secured Amount Funds Report (Updated Semi-Monthly), FCM Cleared Swaps Customer Collateral Report (Updated Semi-Monthly).","add_info_para_2":"Additional financial information on all futures commission  merchants is available from the Commodity Futures Trading Commission","adj_net_capital":"Adjusted Net Capital (Tentative Net Capital)","aff_prop_mar_req":"Affiliate Proprietary Margin Requirement","all_in_millions":"All $s in millions.","capital":"Capital","capital_focus_link":"Selected FOCUS Filings Data","capital_para_1":"Equity and regulatory capital for the past 12 months:","cftc_comp_detail_link":"CFTC Computation Details","cftc_reg_link":"CFTC Regulation 1.55(o)(1)(iv) Disclosure 12/31/2014","cust_money_seg":"Customer Money Segregation Computation","cust_money_seg_domestic":"Interactive Brokers Regulatory InformationDomestic Segregated Funds, pursuant to CFTC regulation 1.20","cust_money_seg_foreign":"Foreign Secured Amount, pursuant to CFTC regulation 30.7","cust_money_seg_para_1_1":"Please see our","cust_money_seg_para_1_2":"page for an overview of how IB protects customer funds.","cust_money_seg_para_2":"On a daily basis IB compares the amount of funds required to be safeguarded for its commodities customers to the funds held in specially designated segregated commodities accounts.  We perform two daily commodities computations: (1) domestic futures segregated funds computation and (2) foreign futures and options secured amount computation.","cust_money_seg_para_3":"U.S. securities regulations require broker-dealers to perform a detailed reconciliation of customer money and securities (known as the 'Customer Reserve Computation') at least weekly, to ensure that the right amount of customer money is protected.  IB performs this computation daily.","cust_money_seg_para_4":"The tables below report these daily computations for the past 12 months.","cust_money_seg_security":"Securities Customer Reserve, pursuant to the SEC rule 15c3-3","date":"Date","domestic_Seg":"Domestic Segregated","exc_net_capital":"Excess Net Capital","excess":"Excess","fin_info":"Financial Information","foreign_sec":"Foreign Secured","funds_seg":"Funds Segregated","fut_cust_concent":"Futures Customer Concentration","fut_cust_concent_para_1":"The below table provides concentration statistics of IB's domestic and foreign commodities funds owed to customers, as indicated by the smallest number of IB customers that make up 50% of these amounts.","fut_cust_concent_para_2":"'N/A' in the table below indicates a settlement holiday.","fut_cust_concent_table_msg":"Smallest number of customers that comprise 50% of the funds owed to customers","fut_mar_req":"Futures Margin Requirements","fut_mar_req_para_1":"IB does not conduct proprietary trading.  However, certain IB affiliates (defined as entities under common control and employees of the firm) hold accounts with IB to trade for their own purposes.  For regulatory purposes, IB's affiliates are not treated as customers.","fut_mar_req_para_2":"The table below reports the last 12 months of margin requirements for affiliate accounts conducting proprietary trading as a percent of total margin requirements for IB's customers.","here":"here","ib_financial_statements":"IB Semiannual Financial Statements","ib_regulatory_information_header":"Interactive Brokers Regulatory Information","ib_regulatory_information_para_1":"Interactive Brokers LLC ('IB') is an agency only, direct market access broker that provides execution, clearance, settlement and prime brokerage for customers.  Our business encompasses securities and commodities brokerage.  IB does not engage in proprietary trading.","ib_regulatory_information_para_2":"As a registered Futures Commission Merchant ('FCM'), IB is subject to the Commodity Exchange Act and rules promulgated by the Commodity Futures Trading Commission ('CFTC'), the National Futures Association ('NFA') and the various commodity exchanges of which we are members.","ib_regulatory_information_para_3":"As a registered U.S. broker dealer, IB is subject to the rules and regulations of the Securities Exchange Act of 1934 (the 'Exchange Act') and other rules promulgated by the Securities and Exchange Commission ('SEC'), the Financial Industry Regulatory Authority ('FINRA') and the rules of various securities exchanges of which we are members.","month_end":"Month End","n_a":"N/A","net_capital":"Net Capital","precentage_aff_total_cust":"Affiliate Proprietary Margin Requirement as % of Total Customer Margin Requirement","reg_disclosures_header":"Regulatory Disclosures","reg_disclosures_link":"Interactive Brokers LLC Firm Specific Disclosure Document pursuant to CFTC Rule 1.55(k) and NFA Rule 2-36(n)","reg_disclosures_para_1":"Please click below for the Interactive Brokers Firm Specific Disclosure Document required by CFTC Rule 1.55(k).","requirement":"Requirement","strength_and_security":"Strength and Security","tot_cust_mar_req":"Total Customer Margin Requirement","total_equity":"Total Equity"},"de":"/regulatoryinformation/i18n/de.json","es":"/regulatoryinformation/i18n/es.json","fr":"/regulatoryinformation/i18n/fr.json","it":"/regulatoryinformation/i18n/it.json","ru":"/regulatoryinformation/i18n/ru.json","hu":"/regulatoryinformation/i18n/hu.json","zh-Hans":"/regulatoryinformation/i18n/zh-Hans.json","zh-Hant":"/regulatoryinformation/i18n/zh-Hant.json","ja":"/regulatoryinformation/i18n/ja.json"}}.translations
    };
  },
  methods: {}
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _api___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/ */ "./src/api/index.js");
/* harmony import */ var _components_Capital_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Capital.vue */ "./src/components/Capital.vue");
/* harmony import */ var _components_CustomerMoneySegregationComputation_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/CustomerMoneySegregationComputation.vue */ "./src/components/CustomerMoneySegregationComputation.vue");
/* harmony import */ var _components_FutureCustomerConcentration_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/FutureCustomerConcentration.vue */ "./src/components/FutureCustomerConcentration.vue");
/* harmony import */ var _components_FuturesMarginRequirements_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/FuturesMarginRequirements.vue */ "./src/components/FuturesMarginRequirements.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'RegulatoryInformation',
  components: {
    Capital: _components_Capital_vue__WEBPACK_IMPORTED_MODULE_1__.default,
    CustomerMoneySegregationComputation: _components_CustomerMoneySegregationComputation_vue__WEBPACK_IMPORTED_MODULE_2__.default,
    FutureCustomerConcentration: _components_FutureCustomerConcentration_vue__WEBPACK_IMPORTED_MODULE_3__.default,
    FuturesMarginRequirements: _components_FuturesMarginRequirements_vue__WEBPACK_IMPORTED_MODULE_4__.default
  },
  data: function data() {
    return {
      netCapitalList: [],
      Cust50PercentNetLiqList: [],
      CommodityDomesticSegregationList: [],
      CommodityForeignSegregationList: [],
      Securities15c3SegregationList: [],
      isCapital: false,
      isCustomerMoneySegregationComputations: false,
      isFutureCustomerConcentration: false,
      isFutureMarginRequirements: false
    };
  },
  created: function created() {},
  mounted: function mounted() {},
  watch: {},
  computed: {},
  methods: {
    getUrlIBAnnualFinStatement: function getUrlIBAnnualFinStatement() {
      window.location.href = "/en/index.php?f=559";
    },
    expand: function expand(id) {
      if (id == 1) {
        this.isCapital = !this.isCapital;
      } else if (id == 2) {
        this.isCustomerMoneySegregationComputations = !this.isCustomerMoneySegregationComputations;
      } else if (id == 3) {
        this.isFutureCustomerConcentration = !this.isFutureCustomerConcentration;
      } else if (id == 4) {
        this.isFutureMarginRequirements = !this.isFutureMarginRequirements;
      }

      this.getFinancialInformation(this.isCapital, this.isCustomerMoneySegregationComputations, this.isFutureCustomerConcentration, this.isFutureMarginRequirements);
    },
    getFinancialInformation: function getFinancialInformation(isCapital, isCustomerMoneySegregationComputations, isFutureCustomerConcentration, isFutureMarginRequirements) {
      var _this = this;

      _api___WEBPACK_IMPORTED_MODULE_0__.default.getFinancialInformation(isCapital, isCustomerMoneySegregationComputations, isFutureCustomerConcentration, isFutureMarginRequirements).then(function (res) {
        _this.netCapitalList = res.netCapitalList;
        _this.Cust50PercentNetLiqList = res.Cust50PercentNetLiqList;
        _this.CommodityDomesticSegregationList = res.CommodityDomesticSegregationList;
        _this.CommodityForeignSegregationList = res.CommodityForeignSegregationList;
        _this.Securities15c3SegregationList = res.Securities15c3SegregationList;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-style-loader/lib/listToStyles.js":
/*!***********************************************************!*\
  !*** ./node_modules/vue-style-loader/lib/listToStyles.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ listToStyles; }
/* harmony export */ });
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles(parentId, list) {
  var styles = [];
  var newStyles = {};

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    };

    if (!newStyles[id]) {
      styles.push(newStyles[id] = {
        id: id,
        parts: [part]
      });
    } else {
      newStyles[id].parts.push(part);
    }
  }

  return styles;
}

/***/ }),

/***/ "./src/api/default.js":
/*!****************************!*\
  !*** ./src/api/default.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildPromise": function() { return /* binding */ buildPromise; },
/* harmony export */   "apiGet": function() { return /* binding */ apiGet; },
/* harmony export */   "apiPost": function() { return /* binding */ apiPost; },
/* harmony export */   "apiDelete": function() { return /* binding */ apiDelete; },
/* harmony export */   "apiPut": function() { return /* binding */ apiPut; }
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var api = axios__WEBPACK_IMPORTED_MODULE_0___default().create({
  timeout: 15000,
  withCredentials: true
});

var handleResponse = function handleResponse(res, resolve, reject) {
  res.status == 200 ? resolve(res.data) : reject(res.statusText);
};

var buildPromise = function buildPromise(method, endPoint, data, config) {
  return new Promise(function (resolve, reject) {
    method(endPoint, data, config).then(function (res) {
      return handleResponse(res, resolve, reject);
    })["catch"](function (reason) {
      return reject(reason);
    });
  });
};
function apiGet(endPoint, config) {
  return new Promise(function (resolve, reject) {
    api.get(endPoint, config).then(function (res) {
      return handleResponse(res, resolve, reject);
    })["catch"](function (reason) {
      return reject(reason);
    });
  });
}
function apiPost(endPoint, data) {
  return buildPromise(api.post, endPoint, data);
}
function apiDelete(endPoint, data) {
  return buildPromise(api["delete"], endPoint);
}
function apiPut(endPoint, data) {
  return buildPromise(api.put, endPoint, data);
}

/***/ }),

/***/ "./src/api/index.js":
/*!**************************!*\
  !*** ./src/api/index.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _default__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./default */ "./src/api/default.js");


function getFinancialInformation(isCapital, isCustomerMoneySegregationComputations, isFutureCustomerConcentration, isFutureMarginRequirements) {
  var query = '/regulatoryinformation/index.php?isCapital=' + isCapital;
  query += '&isCustomerMoneySegregationComputations=' + isCustomerMoneySegregationComputations;
  query += '&isFutureCustomerConcentration=' + isFutureCustomerConcentration;
  query += '&isFutureMarginRequirements=' + isFutureMarginRequirements;
  return (0,_default__WEBPACK_IMPORTED_MODULE_0__.apiGet)("/response_handlers" + query);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getFinancialInformation: getFinancialInformation
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=style&index=0&lang=less&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=style&index=0&lang=less& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n.content-oblique {\n  font-style: oblique;\n}\n", "",{"version":3,"sources":["webpack://./src/components/Capital.vue","webpack://./Capital.vue"],"names":[],"mappings":"AAgFA;EAEQ,mBAAA;EACA,iBAAA;EACA,gCAAA;AChFR;ADoFA;EACI,yBAAA;EACA,uBAAA;EACA,sCAAA;EACA,uBAAA;EACA,qBAAA;EACA,oCAAA;AClFJ;ADqFA;EACI,mBAAA;EACA,iBAAA;EACA,uBAAA;ACnFJ;ADsFA;EACI,mBAAA;ACpFJ","sourcesContent":[".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n.content-oblique {\n  font-style: oblique;\n}\n",".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n.content-oblique {\n  font-style: oblique;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n", "",{"version":3,"sources":["webpack://./src/components/CustomerMoneySegregationComputation.vue","webpack://./CustomerMoneySegregationComputation.vue"],"names":[],"mappings":"AA2JA;EAEQ,mBAAA;EACA,iBAAA;EACA,gCAAA;AC3JR;AD+JA;EACI,yBAAA;EACA,uBAAA;EACA,sCAAA;EACA,uBAAA;EACA,qBAAA;EACA,oCAAA;AC7JJ;ADgKA;EACI,mBAAA;EACA,iBAAA;EACA,uBAAA;AC9JJ","sourcesContent":[".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n",".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n.message-align {\n  text-align: center;\n}\n", "",{"version":3,"sources":["webpack://./src/components/FutureCustomerConcentration.vue","webpack://./FutureCustomerConcentration.vue"],"names":[],"mappings":"AAkEA;EAEQ,mBAAA;EACA,iBAAA;EACA,gCAAA;AClER;ADsEA;EACI,yBAAA;EACA,uBAAA;EACA,sCAAA;EACA,uBAAA;EACA,qBAAA;EACA,oCAAA;ACpEJ;ADuEA;EACI,mBAAA;EACA,iBAAA;EACA,uBAAA;ACrEJ;ADwEA;EACI,kBAAA;ACtEJ","sourcesContent":[".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n.message-align {\n  text-align: center;\n}\n",".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n.message-align {\n  text-align: center;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n", "",{"version":3,"sources":["webpack://./src/components/FuturesMarginRequirements.vue","webpack://./FuturesMarginRequirements.vue"],"names":[],"mappings":"AAmEA;EAEQ,mBAAA;EACA,iBAAA;EACA,gCAAA;ACnER;ADuEA;EACI,yBAAA;EACA,uBAAA;EACA,sCAAA;EACA,uBAAA;EACA,qBAAA;EACA,oCAAA;ACrEJ;ADwEA;EACI,mBAAA;EACA,iBAAA;EACA,uBAAA;ACtEJ","sourcesContent":[".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n",".event-border ._tb {\n  border-style: solid;\n  border-width: 1px;\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.event-header-border {\n  border-right-style: solid;\n  border-right-width: 1px;\n  border-right-color: rgba(0, 0, 0, 0.1);\n  border-top-style: solid;\n  border-top-width: 1px;\n  border-top-color: rgba(0, 0, 0, 0.1);\n}\n.content {\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=style&index=0&lang=less&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=style&index=0&lang=less& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".myapp .thing {\n  opacity: 0.5;\n}\n", "",{"version":3,"sources":["webpack://./src/index.vue","webpack://./index.vue"],"names":[],"mappings":"AA2BA;EAEQ,YAAA;AC3BR","sourcesContent":[".myapp .thing {\n  opacity: 0.5;\n}\n",".myapp .thing {\n  opacity: 0.5;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".pointer {\n  cursor: pointer;\n}\n.over-auto {\n  overflow: auto;\n}\n.pre-wrap {\n  white-space: pre-wrap;\n}\n.panel {\n  color: #666666;\n  cursor: pointer;\n  padding: 18px;\n  width: 100%;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n  text-align: left;\n  outline: none;\n  font-size: 15px;\n}\n.active,\n.panel:hover {\n  color: #000000;\n  background-color: #DCDCDC;\n}\n.matdate label {\n  display: block;\n}\n.matdate ._field {\n  border-radius: 3px;\n}\n", "",{"version":3,"sources":["webpack://./src/view/RegulatoryInformationView.vue","webpack://./RegulatoryInformationView.vue"],"names":[],"mappings":"AAyKA;EACI,eAAA;ACxKJ;AD2KA;EACI,cAAA;ACzKJ;AD2KA;EACI,qBAAA;ACzKJ;AD4KA;EACI,cAAA;EACA,eAAA;EACA,aAAA;EACA,WAAA;EACA,mBAAA;EACA,iBAAA;EACA,uBAAA;EACA,gBAAA;EACA,aAAA;EACA,eAAA;AC1KJ;AD6KA;;EACI,cAAA;EACA,yBAAA;AC1KJ;AD6KA;EAEQ,cAAA;AC5KR;AD0KA;EAMQ,kBAAA;AC7KR","sourcesContent":[".pointer {\n  cursor: pointer;\n}\n.over-auto {\n  overflow: auto;\n}\n.pre-wrap {\n  white-space: pre-wrap;\n}\n.panel {\n  color: #666666;\n  cursor: pointer;\n  padding: 18px;\n  width: 100%;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n  text-align: left;\n  outline: none;\n  font-size: 15px;\n}\n.active,\n.panel:hover {\n  color: #000000;\n  background-color: #DCDCDC;\n}\n.matdate label {\n  display: block;\n}\n.matdate ._field {\n  border-radius: 3px;\n}\n",".pointer {\n  cursor: pointer;\n}\n.over-auto {\n  overflow: auto;\n}\n.pre-wrap {\n  white-space: pre-wrap;\n}\n.panel {\n  color: #666666;\n  cursor: pointer;\n  padding: 18px;\n  width: 100%;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #6666664f;\n  text-align: left;\n  outline: none;\n  font-size: 15px;\n}\n.active,\n.panel:hover {\n  color: #000000;\n  background-color: #DCDCDC;\n}\n.matdate label {\n  display: block;\n}\n.matdate ._field {\n  border-radius: 3px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/components/Capital.vue":
/*!************************************!*\
  !*** ./src/components/Capital.vue ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Capital_vue_vue_type_template_id_513e0130_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Capital.vue?vue&type=template&id=513e0130&lang=pug& */ "./src/components/Capital.vue?vue&type=template&id=513e0130&lang=pug&");
/* harmony import */ var _Capital_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Capital.vue?vue&type=script&lang=js& */ "./src/components/Capital.vue?vue&type=script&lang=js&");
/* harmony import */ var _Capital_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Capital.vue?vue&type=style&index=0&lang=less& */ "./src/components/Capital.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _Capital_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _Capital_vue_vue_type_template_id_513e0130_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render,
  _Capital_vue_vue_type_template_id_513e0130_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Capital.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/CustomerMoneySegregationComputation.vue":
/*!****************************************************************!*\
  !*** ./src/components/CustomerMoneySegregationComputation.vue ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _CustomerMoneySegregationComputation_vue_vue_type_template_id_bbd0e75a_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug& */ "./src/components/CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug&");
/* harmony import */ var _CustomerMoneySegregationComputation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CustomerMoneySegregationComputation.vue?vue&type=script&lang=js& */ "./src/components/CustomerMoneySegregationComputation.vue?vue&type=script&lang=js&");
/* harmony import */ var _CustomerMoneySegregationComputation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less& */ "./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _CustomerMoneySegregationComputation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _CustomerMoneySegregationComputation_vue_vue_type_template_id_bbd0e75a_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render,
  _CustomerMoneySegregationComputation_vue_vue_type_template_id_bbd0e75a_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/CustomerMoneySegregationComputation.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FutureCustomerConcentration.vue":
/*!********************************************************!*\
  !*** ./src/components/FutureCustomerConcentration.vue ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _FutureCustomerConcentration_vue_vue_type_template_id_0ecf4f2c_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug& */ "./src/components/FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug&");
/* harmony import */ var _FutureCustomerConcentration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FutureCustomerConcentration.vue?vue&type=script&lang=js& */ "./src/components/FutureCustomerConcentration.vue?vue&type=script&lang=js&");
/* harmony import */ var _FutureCustomerConcentration_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less& */ "./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _FutureCustomerConcentration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _FutureCustomerConcentration_vue_vue_type_template_id_0ecf4f2c_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render,
  _FutureCustomerConcentration_vue_vue_type_template_id_0ecf4f2c_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FutureCustomerConcentration.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/FuturesMarginRequirements.vue":
/*!******************************************************!*\
  !*** ./src/components/FuturesMarginRequirements.vue ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _FuturesMarginRequirements_vue_vue_type_template_id_e4c634e4_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug& */ "./src/components/FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug&");
/* harmony import */ var _FuturesMarginRequirements_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FuturesMarginRequirements.vue?vue&type=script&lang=js& */ "./src/components/FuturesMarginRequirements.vue?vue&type=script&lang=js&");
/* harmony import */ var _FuturesMarginRequirements_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less& */ "./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _FuturesMarginRequirements_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _FuturesMarginRequirements_vue_vue_type_template_id_e4c634e4_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render,
  _FuturesMarginRequirements_vue_vue_type_template_id_e4c634e4_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/FuturesMarginRequirements.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/index.vue":
/*!***********************!*\
  !*** ./src/index.vue ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _index_vue_vue_type_template_id_2964abc9_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=2964abc9&lang=pug& */ "./src/index.vue?vue&type=template&id=2964abc9&lang=pug&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./src/index.vue?vue&type=script&lang=js&");
/* harmony import */ var _index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&lang=less& */ "./src/index.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _index_vue_vue_type_template_id_2964abc9_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render,
  _index_vue_vue_type_template_id_2964abc9_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/index.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/view/RegulatoryInformationView.vue":
/*!************************************************!*\
  !*** ./src/view/RegulatoryInformationView.vue ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _RegulatoryInformationView_vue_vue_type_template_id_9dc40870_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug& */ "./src/view/RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug&");
/* harmony import */ var _RegulatoryInformationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RegulatoryInformationView.vue?vue&type=script&lang=js& */ "./src/view/RegulatoryInformationView.vue?vue&type=script&lang=js&");
/* harmony import */ var _RegulatoryInformationView_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RegulatoryInformationView.vue?vue&type=style&index=0&lang=less& */ "./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _RegulatoryInformationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _RegulatoryInformationView_vue_vue_type_template_id_9dc40870_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render,
  _RegulatoryInformationView_vue_vue_type_template_id_9dc40870_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/view/RegulatoryInformationView.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Capital.vue?vue&type=script&lang=js&":
/*!*************************************************************!*\
  !*** ./src/components/Capital.vue?vue&type=script&lang=js& ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Capital.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/components/CustomerMoneySegregationComputation.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./src/components/CustomerMoneySegregationComputation.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CustomerMoneySegregationComputation.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/components/FutureCustomerConcentration.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./src/components/FutureCustomerConcentration.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FutureCustomerConcentration.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/components/FuturesMarginRequirements.vue?vue&type=script&lang=js&":
/*!*******************************************************************************!*\
  !*** ./src/components/FuturesMarginRequirements.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FuturesMarginRequirements.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/index.vue?vue&type=script&lang=js&":
/*!************************************************!*\
  !*** ./src/index.vue?vue&type=script&lang=js& ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/view/RegulatoryInformationView.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./src/view/RegulatoryInformationView.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RegulatoryInformationView.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_1_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/components/Capital.vue?vue&type=template&id=513e0130&lang=pug&":
/*!****************************************************************************!*\
  !*** ./src/components/Capital.vue?vue&type=template&id=513e0130&lang=pug& ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_template_id_513e0130_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_template_id_513e0130_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_template_id_513e0130_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Capital.vue?vue&type=template&id=513e0130&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=template&id=513e0130&lang=pug&");


/***/ }),

/***/ "./src/components/CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug&":
/*!********************************************************************************************************!*\
  !*** ./src/components/CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug& ***!
  \********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_template_id_bbd0e75a_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_template_id_bbd0e75a_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_template_id_bbd0e75a_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug&");


/***/ }),

/***/ "./src/components/FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug&":
/*!************************************************************************************************!*\
  !*** ./src/components/FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug& ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_template_id_0ecf4f2c_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_template_id_0ecf4f2c_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_template_id_0ecf4f2c_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug&");


/***/ }),

/***/ "./src/components/FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug&":
/*!**********************************************************************************************!*\
  !*** ./src/components/FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug& ***!
  \**********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_template_id_e4c634e4_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_template_id_e4c634e4_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_template_id_e4c634e4_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug&");


/***/ }),

/***/ "./src/index.vue?vue&type=template&id=2964abc9&lang=pug&":
/*!***************************************************************!*\
  !*** ./src/index.vue?vue&type=template&id=2964abc9&lang=pug& ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_2964abc9_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_2964abc9_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_2964abc9_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=template&id=2964abc9&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=template&id=2964abc9&lang=pug&");


/***/ }),

/***/ "./src/view/RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug&":
/*!****************************************************************************************!*\
  !*** ./src/view/RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug& ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_template_id_9dc40870_lang_pug___WEBPACK_IMPORTED_MODULE_0__.render; },
/* harmony export */   "staticRenderFns": function() { return /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_template_id_9dc40870_lang_pug___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns; }
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_pug_plain_loader_index_js_clonedRuleSet_4_0_rules_0_use_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_template_id_9dc40870_lang_pug___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug&");


/***/ }),

/***/ "./src/components/Capital.vue?vue&type=style&index=0&lang=less&":
/*!**********************************************************************!*\
  !*** ./src/components/Capital.vue?vue&type=style&index=0&lang=less& ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader/index.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Capital.vue?vue&type=style&index=0&lang=less& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Capital_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less&":
/*!**************************************************************************************************!*\
  !*** ./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less& ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader/index.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CustomerMoneySegregationComputation_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less&":
/*!******************************************************************************************!*\
  !*** ./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less& ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader/index.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FutureCustomerConcentration_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less&":
/*!****************************************************************************************!*\
  !*** ./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less& ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader/index.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FuturesMarginRequirements_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./src/index.vue?vue&type=style&index=0&lang=less&":
/*!*********************************************************!*\
  !*** ./src/index.vue?vue&type=style&index=0&lang=less& ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/vue-style-loader/index.js!../node_modules/css-loader/dist/cjs.js!../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=style&index=0&lang=less& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less&":
/*!**********************************************************************************!*\
  !*** ./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less& ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-style-loader/index.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RegulatoryInformationView.vue?vue&type=style&index=0&lang=less& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = function(key) { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_less_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RegulatoryInformationView_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__[key]; }.bind(0, __WEBPACK_IMPORT_KEY__)
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=template&id=513e0130&lang=pug&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=template&id=513e0130&lang=pug& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "inset-32 content" },
    [
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("capital_para_1"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8 content-oblique" }, [
        _vm._v(_vm._s(_vm.$t("all_in_millions"))),
      ]),
      _c(
        "ib-table-basic",
        {
          ref: "table",
          staticClass: "ib-row shrink fs7 fg70 event-border",
          attrs: {
            data: _vm.netCapitalList,
            spacing: "huge",
            height: "400px",
            wrap: "",
            rowstripe: "",
            rowborder: "",
            colborder: "",
          },
          scopedSlots: _vm._u([
            {
              key: "body",
              fn: function (row) {
                return [
                  _c("td", [_c("span", [_vm._v(_vm._s(row.month_year))])]),
                  _c("td", [
                    _c("span", [_vm._v(_vm._s(row.total_equity) + " ")]),
                  ]),
                  _c("td", [
                    _c("span", [_vm._v(_vm._s(row.tentative_net_capital))]),
                  ]),
                  _c("td", [_c("span", [_vm._v(_vm._s(row.net_capital))])]),
                  _c("td", [
                    _c("span", [_vm._v(_vm._s(row.excess_net_capital))]),
                  ]),
                ]
              },
            },
          ]),
        },
        [
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("month_end")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("total_equity")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("adj_net_capital")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("net_capital")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("exc_net_capital")))]
          ),
        ],
        1
      ),
      _c("hr", { staticClass: "before-32" }),
      _c(
        "div",
        { staticClass: "insety-16" },
        [
          _c(
            "ib-button",
            {
              attrs: { tone: "sell", appearance: "link" },
              on: { click: _vm.getURLFocusFilingData },
            },
            [
              _vm._v(" " + _vm._s(_vm.$t("capital_focus_link")) + " "),
              _c("svg", { attrs: { viewBox: "0 0 24 24" } }, [
                _c("path", {
                  attrs: { d: "M15 4l7 7-7 7v-4C3 14 2 19 2 19S3 8 15 8z" },
                }),
              ]),
            ]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=template&id=bbd0e75a&lang=pug& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "inset-32 content" },
    [
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("cust_money_seg_para_1_1")) + " "),
        _c(
          "a",
          {
            staticClass: "fg-sell",
            attrs: { href: "/en/index.php?f=2334", target: "_blank" },
          },
          [_vm._v(_vm._s(_vm.$t("strength_and_security")))]
        ),
        _vm._v(" " + _vm._s(_vm.$t("cust_money_seg_para_1_2"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("cust_money_seg_para_2"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("cust_money_seg_para_3"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("cust_money_seg_para_4"))),
      ]),
      _c("h3", { staticClass: "insety-32" }, [
        _vm._v(_vm._s(_vm.$t("cust_money_seg_domestic"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8 content-oblique" }, [
        _vm._v(_vm._s(_vm.$t("all_in_millions"))),
      ]),
      _c(
        "ib-table-basic",
        {
          ref: "table",
          staticClass: "ib-row shrink fs7 fg70 event-border",
          attrs: {
            data: _vm.CommodityDomesticSegregationList,
            spacing: "huge",
            height: "400px",
            wrap: "",
            rowstripe: "",
            rowborder: "",
            colborder: "",
          },
          scopedSlots: _vm._u([
            {
              key: "body",
              fn: function (row) {
                return [
                  _c("td", [_c("span", [_vm._v(_vm._s(row.date))])]),
                  _c("td", [
                    _c("span", [_vm._v(_vm._s(row.requirement) + " ")]),
                  ]),
                  _c("td", [_c("span", [_vm._v(_vm._s(row.funds_secured))])]),
                  _c("td", [_c("span", [_vm._v(_vm._s(row.excess_deficit))])]),
                ]
              },
            },
          ]),
        },
        [
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("date")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("requirement")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("funds_seg")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("excess")))]
          ),
        ],
        1
      ),
      _c("h3", { staticClass: "insety-32" }, [
        _vm._v(_vm._s(_vm.$t("cust_money_seg_foreign"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8 content-oblique" }, [
        _vm._v(_vm._s(_vm.$t("all_in_millions"))),
      ]),
      _c(
        "ib-table-basic",
        {
          ref: "table",
          staticClass: "ib-row shrink fs7 fg70 event-border",
          attrs: {
            data: _vm.CommodityForeignSegregationList,
            spacing: "huge",
            height: "400px",
            wrap: "",
            rowstripe: "",
            rowborder: "",
            colborder: "",
          },
          scopedSlots: _vm._u([
            {
              key: "body",
              fn: function (row) {
                return [
                  _c("td", [_c("span", [_vm._v(_vm._s(row.date))])]),
                  _c("td", [
                    _c("span", [_vm._v(_vm._s(row.requirement) + " ")]),
                  ]),
                  _c("td", [_c("span", [_vm._v(_vm._s(row.funds_secured))])]),
                  _c("td", [_c("span", [_vm._v(_vm._s(row.excess_deficit))])]),
                ]
              },
            },
          ]),
        },
        [
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("date")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("requirement")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("funds_seg")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("excess")))]
          ),
        ],
        1
      ),
      _c("hr", { staticClass: "before-64" }),
      _c(
        "div",
        { staticClass: "insety-16" },
        [
          _c(
            "ib-button",
            {
              attrs: { tone: "sell", appearance: "link" },
              on: { click: _vm.getURLCFTCDisclosure },
            },
            [
              _vm._v(_vm._s(_vm.$t("cftc_reg_link")) + " "),
              _c("svg", { attrs: { viewBox: "0 0 24 24" } }, [
                _c("path", {
                  attrs: { d: "M15 4l7 7-7 7v-4C3 14 2 19 2 19S3 8 15 8z" },
                }),
              ]),
            ]
          ),
        ],
        1
      ),
      _c(
        "div",
        { staticClass: "insety-16" },
        [
          _c(
            "ib-button",
            {
              attrs: { tone: "sell", appearance: "link" },
              on: { click: _vm.getURLCFTCDetails },
            },
            [
              _vm._v(_vm._s(_vm.$t("cftc_comp_detail_link"))),
              _c("svg", { attrs: { viewBox: "0 0 24 24" } }, [
                _c("path", {
                  attrs: { d: "M15 4l7 7-7 7v-4C3 14 2 19 2 19S3 8 15 8z" },
                }),
              ]),
            ]
          ),
        ],
        1
      ),
      _c("h3", { staticClass: "insety-32" }, [
        _vm._v(_vm._s(_vm.$t("cust_money_seg_security"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8 content-oblique" }, [
        _vm._v(_vm._s(_vm.$t("all_in_millions"))),
      ]),
      _c(
        "ib-table-basic",
        {
          ref: "table",
          staticClass: "ib-row shrink fs7 fg70 event-border",
          attrs: {
            data: _vm.Securities15c3SegregationList,
            spacing: "huge",
            height: "400px",
            wrap: "",
            rowstripe: "",
            rowborder: "",
            colborder: "",
          },
          scopedSlots: _vm._u([
            {
              key: "body",
              fn: function (row) {
                return [
                  _c("td", [_c("span", [_vm._v(_vm._s(row.date))])]),
                  _c("td", [
                    _c("span", [_vm._v(_vm._s(row.requirement) + " ")]),
                  ]),
                  _c("td", [_c("span", [_vm._v(_vm._s(row.funds_secured))])]),
                  _c("td", [_c("span", [_vm._v(_vm._s(row.excess_deficit))])]),
                ]
              },
            },
          ]),
        },
        [
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("date")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("requirement")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("funds_seg")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("excess")))]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=template&id=0ecf4f2c&lang=pug& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "inset-32 content" },
    [
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("fut_cust_concent_para_1"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("fut_cust_concent_para_2"))),
      ]),
      _c(
        "ib-table-basic",
        {
          ref: "table",
          staticClass: "ib-row shrink fs7 fg70 event-border",
          attrs: {
            data: _vm.Cust50PercentNetLiqList,
            height: "400px",
            spacing: "huge",
            wrap: "",
            rowstripe: "",
            rowborder: "",
            colborder: "",
          },
          scopedSlots: _vm._u([
            {
              key: "body",
              fn: function (row) {
                return [
                  _c("td", [_c("span", [_vm._v(_vm._s(row.date))])]),
                  _c("td", [
                    row.num_customers_domestic_req != ""
                      ? _c("span", [
                          _vm._v(_vm._s(row.num_customers_domestic_req)),
                        ])
                      : _c("span", [_vm._v(_vm._s(_vm.$t("n_a")))]),
                  ]),
                  _c("td", [
                    row.num_customers_foreign_req != ""
                      ? _c("span", [
                          _vm._v(_vm._s(row.num_customers_foreign_req)),
                        ])
                      : _c("span", [_vm._v(_vm._s(_vm.$t("n_a")))]),
                  ]),
                ]
              },
            },
          ]),
        },
        [
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("date")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("domestic_Seg")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "15ch" } },
            [_vm._v(_vm._s(_vm.$t("foreign_sec")))]
          ),
          _c(
            "p",
            {
              staticClass: "fs7 message-align",
              attrs: { slot: "caption" },
              slot: "caption",
            },
            [_vm._v(_vm._s(_vm.$t("fut_cust_concent_table_msg")))]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=template&id=e4c634e4&lang=pug& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "inset-32 content" },
    [
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("fut_mar_req_para_1"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8" }, [
        _vm._v(_vm._s(_vm.$t("fut_mar_req_para_2"))),
      ]),
      _c("p", { staticClass: "fs7 insety-8 content-oblique" }, [
        _vm._v(_vm._s(_vm.$t("all_in_millions"))),
      ]),
      _c(
        "ib-table-basic",
        {
          ref: "table",
          staticClass: "ib-row shrink fs7 fg70 event-border",
          attrs: {
            data: _vm.netCapitalList,
            spacing: "huge",
            height: "400px",
            wrap: "",
            rowstripe: "",
            rowborder: "",
            colborder: "",
          },
          scopedSlots: _vm._u([
            {
              key: "body",
              fn: function (row) {
                return [
                  _c("td", [_c("span", [_vm._v(_vm._s(row.month_year))])]),
                  _c("td", [
                    _c("span", [
                      _vm._v(_vm._s(row.prop_margin_requirement) + " "),
                    ]),
                  ]),
                  _c("td", [
                    _c("span", [_vm._v(_vm._s(row.cust_margin_requirement))]),
                  ]),
                  _c("td", [
                    _c("span", [
                      _vm._v(_vm._s(row.percent_prop_vs_cust_margin)),
                    ]),
                  ]),
                ]
              },
            },
          ]),
        },
        [
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("month_end")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("aff_prop_mar_req")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "10ch" } },
            [_vm._v(_vm._s(_vm.$t("tot_cust_mar_req")))]
          ),
          _c(
            "ib-table-col",
            { staticClass: "event-header-border", attrs: { width: "20ch" } },
            [_vm._v(_vm._s(_vm.$t("precentage_aff_total_cust")))]
          ),
        ],
        1
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=template&id=2964abc9&lang=pug&":
/*!********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=template&id=2964abc9&lang=pug& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "ib-application",
    { attrs: { layout: "full", translations: _vm.translations } },
    [_c("RegulatoryInformationView")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/pug-plain-loader/index.js??clonedRuleSet-4[0].rules[0].use!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=template&id=9dc40870&lang=pug& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": function() { return /* binding */ render; },
/* harmony export */   "staticRenderFns": function() { return /* binding */ staticRenderFns; }
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "ib-col flex" },
    [
      _c("div", { staticClass: "ib-row" }, [
        _c("div", { staticClass: "ib-col" }, [
          _c("h1", { staticClass: "insety-32" }, [
            _vm._v(_vm._s(_vm.$t("ib_regulatory_information_header"))),
          ]),
        ]),
      ]),
      _c("div", { staticClass: "ib-row" }, [
        _c("div", { staticClass: "ib-col" }, [
          _c("p", { staticClass: "fs7 insety-8" }, [
            _vm._v(_vm._s(_vm.$t("ib_regulatory_information_para_1")) + " "),
          ]),
          _c("p", { staticClass: "fs7 insety-8" }, [
            _vm._v(_vm._s(_vm.$t("ib_regulatory_information_para_2")) + " "),
          ]),
          _c("p", { staticClass: "fs7 insety-8" }, [
            _vm._v(_vm._s(_vm.$t("ib_regulatory_information_para_3")) + " "),
          ]),
          _c(
            "span",
            { staticClass: "insety-32" },
            [
              _c(
                "ib-button",
                {
                  staticClass: "insety-16",
                  attrs: { tone: "sell", appearance: "link" },
                  on: { click: _vm.getUrlIBAnnualFinStatement },
                },
                [
                  _vm._v(_vm._s(_vm.$t("ib_financial_statements"))),
                  _c("svg", { attrs: { viewBox: "0 0 24 24" } }, [
                    _c("path", {
                      attrs: { d: "M15 4l7 7-7 7v-4C3 14 2 19 2 19S3 8 15 8z" },
                    }),
                  ]),
                ]
              ),
            ],
            1
          ),
        ]),
      ]),
      _c("hr", { staticClass: "before-24" }),
      _c("div", { staticClass: "ib-row grow insety-16" }, [
        _c("div", { staticClass: "ib-col" }, [
          _c("p", { staticClass: "fs3 insety-16" }, [
            _vm._v(_vm._s(_vm.$t("fin_info"))),
          ]),
        ]),
      ]),
      _c(
        "div",
        {
          staticClass: "panel",
          class: { active: this.isCapital === true },
          on: {
            click: function ($event) {
              return _vm.expand(1)
            },
          },
        },
        [
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isCapital == false,
                  expression: "this.isCapital == false",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M14.98 2.98a2 2 0 0 0-1.4 3.43L32.19 25l-18.6 18.59a2 2 0 1 0 2.83 2.82l20-20a2 2 0 0 0 0-2.82l-20-20a2 2 0 0 0-1.43-.61z",
                  },
                }),
              ]),
            ]
          ),
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isCapital == true,
                  expression: "this.isCapital == true",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M44.98 12.97c-.53.01-1.03.23-1.4.62L25 32.17 6.41 13.6a2 2 0 0 0-2.83 2.83l20 20a2 2 0 0 0 2.83 0l20-20a2 2 0 0 0-1.43-3.45z",
                  },
                }),
              ]),
            ]
          ),
          _c("span", { staticClass: "insetx-8" }, [
            _vm._v(_vm._s(_vm.$t("capital"))),
          ]),
        ]
      ),
      _c("Capital", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: this.isCapital,
            expression: "this.isCapital",
          },
        ],
        attrs: { netCapitalList: _vm.netCapitalList },
      }),
      _c(
        "div",
        {
          staticClass: "panel",
          class: {
            active: this.isCustomerMoneySegregationComputations === true,
          },
          on: {
            click: function ($event) {
              return _vm.expand(2)
            },
          },
        },
        [
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isCustomerMoneySegregationComputations == false,
                  expression:
                    "this.isCustomerMoneySegregationComputations == false",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M14.98 2.98a2 2 0 0 0-1.4 3.43L32.19 25l-18.6 18.59a2 2 0 1 0 2.83 2.82l20-20a2 2 0 0 0 0-2.82l-20-20a2 2 0 0 0-1.43-.61z",
                  },
                }),
              ]),
            ]
          ),
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isCustomerMoneySegregationComputations == true,
                  expression:
                    "this.isCustomerMoneySegregationComputations == true",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M44.98 12.97c-.53.01-1.03.23-1.4.62L25 32.17 6.41 13.6a2 2 0 0 0-2.83 2.83l20 20a2 2 0 0 0 2.83 0l20-20a2 2 0 0 0-1.43-3.45z",
                  },
                }),
              ]),
            ]
          ),
          _c("span", { staticClass: "insetx-8" }, [
            _vm._v(_vm._s(_vm.$t("cust_money_seg"))),
          ]),
        ]
      ),
      _c("CustomerMoneySegregationComputation", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: this.isCustomerMoneySegregationComputations,
            expression: "this.isCustomerMoneySegregationComputations",
          },
        ],
        attrs: {
          CommodityDomesticSegregationList:
            _vm.CommodityDomesticSegregationList,
          CommodityForeignSegregationList: _vm.CommodityForeignSegregationList,
          Securities15c3SegregationList: _vm.Securities15c3SegregationList,
        },
      }),
      _c(
        "div",
        {
          staticClass: "panel",
          class: { active: this.isFutureCustomerConcentration === true },
          on: {
            click: function ($event) {
              return _vm.expand(3)
            },
          },
        },
        [
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isFutureCustomerConcentration == false,
                  expression: "this.isFutureCustomerConcentration == false",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M14.98 2.98a2 2 0 0 0-1.4 3.43L32.19 25l-18.6 18.59a2 2 0 1 0 2.83 2.82l20-20a2 2 0 0 0 0-2.82l-20-20a2 2 0 0 0-1.43-.61z",
                  },
                }),
              ]),
            ]
          ),
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isFutureCustomerConcentration == true,
                  expression: "this.isFutureCustomerConcentration == true",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M44.98 12.97c-.53.01-1.03.23-1.4.62L25 32.17 6.41 13.6a2 2 0 0 0-2.83 2.83l20 20a2 2 0 0 0 2.83 0l20-20a2 2 0 0 0-1.43-3.45z",
                  },
                }),
              ]),
            ]
          ),
          _c("span", { staticClass: "insetx-8" }, [
            _vm._v(_vm._s(_vm.$t("fut_cust_concent"))),
          ]),
        ]
      ),
      _c("FutureCustomerConcentration", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: this.isFutureCustomerConcentration,
            expression: "this.isFutureCustomerConcentration",
          },
        ],
        attrs: { Cust50PercentNetLiqList: _vm.Cust50PercentNetLiqList },
      }),
      _c(
        "div",
        {
          staticClass: "panel",
          class: { active: this.isFutureMarginRequirements === true },
          on: {
            click: function ($event) {
              return _vm.expand(4)
            },
          },
        },
        [
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isFutureMarginRequirements == false,
                  expression: "this.isFutureMarginRequirements == false",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M14.98 2.98a2 2 0 0 0-1.4 3.43L32.19 25l-18.6 18.59a2 2 0 1 0 2.83 2.82l20-20a2 2 0 0 0 0-2.82l-20-20a2 2 0 0 0-1.43-.61z",
                  },
                }),
              ]),
            ]
          ),
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: this.isFutureMarginRequirements == true,
                  expression: "this.isFutureMarginRequirements == true",
                },
              ],
            },
            [
              _c("svg", { attrs: { viewBox: "0 0 50 50" } }, [
                _c("path", {
                  attrs: {
                    d: "M44.98 12.97c-.53.01-1.03.23-1.4.62L25 32.17 6.41 13.6a2 2 0 0 0-2.83 2.83l20 20a2 2 0 0 0 2.83 0l20-20a2 2 0 0 0-1.43-3.45z",
                  },
                }),
              ]),
            ]
          ),
          _c("span", { staticClass: "insetx-8" }, [
            _vm._v(_vm._s(_vm.$t("fut_mar_req"))),
          ]),
        ]
      ),
      _c("FuturesMarginRequirements", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: this.isFutureMarginRequirements,
            expression: "this.isFutureMarginRequirements",
          },
        ],
        attrs: { netCapitalList: _vm.netCapitalList },
      }),
      _c("hr", { staticClass: "before-32" }),
      _c("div", { staticClass: "ib-row grow insety-16" }, [
        _c("div", { staticClass: "ib-col" }, [
          _c("p", { staticClass: "fs3 insety-16" }, [
            _vm._v(" " + _vm._s(_vm.$t("reg_disclosures_header"))),
          ]),
          _c("span", [
            _c("p", { staticClass: "fs7 insety-8" }, [
              _vm._v(_vm._s(_vm.$t("reg_disclosures_para_1"))),
            ]),
          ]),
          _c("span", { staticClass: "insety-16" }, [
            _c(
              "a",
              {
                staticClass: "fs7 fg-sell",
                attrs: {
                  target: "_blank",
                  href: "https://gdcdyn.interactivebrokers.com/Universal/servlet/Registration_v2.formSampleView?formdb=3355",
                },
              },
              [
                _vm._v(_vm._s(_vm.$t("reg_disclosures_link"))),
                _c("svg", { attrs: { viewBox: "0 0 24 24" } }, [
                  _c("path", {
                    attrs: { d: "M15 4l7 7-7 7v-4C3 14 2 19 2 19S3 8 15 8z" },
                  }),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _c("hr", { staticClass: "before-32" }),
      _c("div", { staticClass: "ib-row grow insety-16" }, [
        _c("div", { staticClass: "ib-col" }, [
          _c("p", { staticClass: "fs3 insety-16" }, [
            _vm._v(_vm._s(_vm.$t("add_info_header"))),
          ]),
          _c("span", [
            _c("p", { staticClass: "fs7" }, [
              _vm._v(_vm._s(_vm.$t("add_info_para_1_1")) + " "),
              _c(
                "a",
                {
                  staticClass: "fg-sell",
                  attrs: {
                    href: "http://www.nfa.futures.org/basicnet/",
                    target: "_blank",
                  },
                },
                [_vm._v(_vm._s(_vm.$t("add_info_nfa_link")))]
              ),
              _vm._v(" " + _vm._s(_vm.$t("add_info_para_1_2"))),
            ]),
          ]),
          _c("span", [
            _c("p", { staticClass: "bold fs7 insety-8" }, [
              _vm._v(_vm._s(_vm.$t("add_info_para_2")) + "  "),
              _c(
                "a",
                {
                  staticClass: "fg-sell",
                  attrs: {
                    href: "http://www.cftc.gov/MarketReports/financialfcmdata/index.htm",
                    target: "_blank",
                  },
                },
                [_vm._v(_vm._s(_vm.$t("here")))]
              ),
              _vm._v(".        "),
            ]),
          ]),
        ]),
      ]),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ normalizeComponent; }
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=style&index=0&lang=less&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=style&index=0&lang=less& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Capital.vue?vue&type=style&index=0&lang=less& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Capital.vue?vue&type=style&index=0&lang=less&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("2f312132", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/CustomerMoneySegregationComputation.vue?vue&type=style&index=0&lang=less&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("2efecfd2", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FutureCustomerConcentration.vue?vue&type=style&index=0&lang=less&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("6d0c20b2", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/FuturesMarginRequirements.vue?vue&type=style&index=0&lang=less&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("364f2af2", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=style&index=0&lang=less&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=style&index=0&lang=less& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=style&index=0&lang=less& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/index.vue?vue&type=style&index=0&lang=less&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("1889732c", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RegulatoryInformationView.vue?vue&type=style&index=0&lang=less& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/less-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/view/RegulatoryInformationView.vue?vue&type=style&index=0&lang=less&");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! !../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("5a3e1aa1", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "./node_modules/vue-style-loader/lib/addStylesClient.js":
/*!**************************************************************!*\
  !*** ./node_modules/vue-style-loader/lib/addStylesClient.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ addStylesClient; }
/* harmony export */ });
/* harmony import */ var _listToStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./listToStyles */ "./node_modules/vue-style-loader/lib/listToStyles.js");
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = (0,_listToStyles__WEBPACK_IMPORTED_MODULE_0__.default)(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = (0,_listToStyles__WEBPACK_IMPORTED_MODULE_0__.default)(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ (function(module) {

"use strict";
module.exports = Vue;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue */ "./src/index.vue");
/* harmony import */ var _view_RegulatoryInformationView_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view/RegulatoryInformationView.vue */ "./src/view/RegulatoryInformationView.vue");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



 //new Vue(App).$mount('#app');

var router = new VueRouter({
  mode: "hash",
  hashbang: true,
  history: true,
  scrollBehavior: function scrollBehavior(to, from, saved) {
    return {
      x: 0,
      y: 0
    };
  },
  routes: [{
    path: '/',
    component: _view_RegulatoryInformationView_vue__WEBPACK_IMPORTED_MODULE_2__.default
  }]
});
var app = new (vue__WEBPACK_IMPORTED_MODULE_0___default())(_objectSpread({
  router: router
}, _index_vue__WEBPACK_IMPORTED_MODULE_1__.default));
app.$mount('#app');
}();
/******/ })()
;
//# sourceMappingURL=index.js.map