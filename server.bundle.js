/** ****/ (function (modules) { // webpackBootstrap
/** ****/ 	// The module cache
  /** ****/ 	const installedModules = {};

/** ****/ 	// The require function
  /** ****/ 	function __webpack_require__(moduleId) {
/** ****/ 		// Check if module is in cache
    /** ****/ 		if (installedModules[moduleId])
  /** ****/ 			{ return installedModules[moduleId].exports; }

/** ****/ 		// Create a new module (and put it into the cache)
    /** ****/ 		const module = installedModules[moduleId] = {
    /** ****/ 			i: moduleId,
    /** ****/ 			l: false,
    /** ****/ 			exports: {}
  /** ****/ 		};

/** ****/ 		// Execute the module function
    /** ****/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/** ****/ 		// Flag the module as loaded
    /** ****/ 		module.l = true;

/** ****/ 		// Return the exports of the module
    /** ****/ 		return module.exports;
  /** ****/ 	}


/** ****/ 	// expose the modules object (__webpack_modules__)
  /** ****/ 	__webpack_require__.m = modules;

/** ****/ 	// expose the module cache
  /** ****/ 	__webpack_require__.c = installedModules;

/** ****/ 	// identity function for calling harmony imports with the correct context
  /** ****/ 	__webpack_require__.i = function (value) { return value; };

/** ****/ 	// define getter function for harmony exports
  /** ****/ 	__webpack_require__.d = function (exports, name, getter) {
    /** ****/ 		if (!__webpack_require__.o(exports, name)) {
    /** ****/ 			Object.defineProperty(exports, name, {
    /** ****/ 				configurable: false,
    /** ****/ 				enumerable: true,
    /** ****/ 				get: getter
  /** ****/ 			});
  /** ****/ 		}
  /** ****/ 	};

/** ****/ 	// getDefaultExport function for compatibility with non-harmony modules
  /** ****/ 	__webpack_require__.n = function (module) {
    /** ****/ 		const getter = module && module.__esModule ?
/** ****/ 			function getDefault() { return module.default; } :
/** ****/ 			function getModuleExports() { return module; };
    /** ****/ 		__webpack_require__.d(getter, 'a', getter);
    /** ****/ 		return getter;
  /** ****/ 	};

/** ****/ 	// Object.prototype.hasOwnProperty.call
  /** ****/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/** ****/ 	// __webpack_public_path__
  /** ****/ 	__webpack_require__.p = '';

/** ****/ 	// Load entry module and return exports
  /** ****/ 	return __webpack_require__(__webpack_require__.s = 3);
/** ****/ }([
/* 0 */
/** */ (function (module, exports) {

  module.exports = require('compression');

/** *
/ }),
/* 1 */
/** */ (function (module, exports) {

  module.exports = require('express');

/** *
/ }),
/* 2 */
/** */ (function (module, exports) {

  module.exports = require('path');

/** *
/ }),
/* 3 */
/** */ (function (module, exports, __webpack_require__) {

'use strict';

  /* WEBPACK VAR INJECTION */(function (__dirname) {

let _express = __webpack_require__(1);

let _express2 = _interopRequireDefault(_express);

let _path = __webpack_require__(2);

let _path2 = _interopRequireDefault(_path);

let _compression = __webpack_require__(0);

let _compression2 = _interopRequireDefault(_compression);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app = (0, _express2.default)(); // server.js


  app.use((0, _compression2.default)());

// serve our static stuff like index.css
  app.use(_express2.default.static(_path2.default.join(__dirname, 'build')));

  app.get('*', (req, res) => {
  res.sendFile('index.html', { root: _path2.default.join(__dirname, 'build') });
});

let PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
  console.log(`Production Express server running at localhost: ${  PORT}`);
});
/* WEBPACK VAR INJECTION */ }.call(exports, ''));

/** *
/ })
/******/ ]));
