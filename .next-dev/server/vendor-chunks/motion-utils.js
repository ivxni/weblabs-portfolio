"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion-utils";
exports.ids = ["vendor-chunks/motion-utils"];
exports.modules = {

/***/ "(ssr)/./node_modules/motion-utils/dist/es/format-error-message.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/motion-utils/dist/es/format-error-message.mjs ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   formatErrorMessage: () => (/* binding */ formatErrorMessage)\n/* harmony export */ });\nfunction formatErrorMessage(message, errorCode) {\n    return errorCode\n        ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}`\n        : message;\n}\n\n\n//# sourceMappingURL=format-error-message.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZm9ybWF0LWVycm9yLW1lc3NhZ2UubWpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0EsYUFBYSxRQUFRLHlGQUF5RixVQUFVO0FBQ3hIO0FBQ0E7O0FBRThCO0FBQzlCIiwic291cmNlcyI6WyIvVXNlcnMvY2FuL0Rlc2t0b3Avd2VibGFicy1wb3J0Zm9saW8vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Zvcm1hdC1lcnJvci1tZXNzYWdlLm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBmb3JtYXRFcnJvck1lc3NhZ2UobWVzc2FnZSwgZXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIGVycm9yQ29kZVxuICAgICAgICA/IGAke21lc3NhZ2V9LiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhbmQgc3RlcHMgZm9yIHNvbHZpbmcsIHZpc2l0IGh0dHBzOi8vbW90aW9uLmRldi90cm91Ymxlc2hvb3RpbmcvJHtlcnJvckNvZGV9YFxuICAgICAgICA6IG1lc3NhZ2U7XG59XG5cbmV4cG9ydCB7IGZvcm1hdEVycm9yTWVzc2FnZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9ybWF0LWVycm9yLW1lc3NhZ2UubWpzLm1hcFxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion-utils/dist/es/format-error-message.mjs\n");

/***/ }),

/***/ "(ssr)/./node_modules/motion-utils/dist/es/warn-once.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/motion-utils/dist/es/warn-once.mjs ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hasWarned: () => (/* binding */ hasWarned),\n/* harmony export */   warnOnce: () => (/* binding */ warnOnce)\n/* harmony export */ });\n/* harmony import */ var _format_error_message_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format-error-message.mjs */ \"(ssr)/./node_modules/motion-utils/dist/es/format-error-message.mjs\");\n\n\nconst warned = new Set();\nfunction hasWarned(message) {\n    return warned.has(message);\n}\nfunction warnOnce(condition, message, errorCode) {\n    if (condition || warned.has(message))\n        return;\n    console.warn((0,_format_error_message_mjs__WEBPACK_IMPORTED_MODULE_0__.formatErrorMessage)(message, errorCode));\n    warned.add(message);\n}\n\n\n//# sourceMappingURL=warn-once.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvd2Fybi1vbmNlLm1qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBZ0U7O0FBRWhFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDZFQUFrQjtBQUNuQztBQUNBOztBQUUrQjtBQUMvQiIsInNvdXJjZXMiOlsiL1VzZXJzL2Nhbi9EZXNrdG9wL3dlYmxhYnMtcG9ydGZvbGlvL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy93YXJuLW9uY2UubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvcm1hdEVycm9yTWVzc2FnZSB9IGZyb20gJy4vZm9ybWF0LWVycm9yLW1lc3NhZ2UubWpzJztcblxuY29uc3Qgd2FybmVkID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gaGFzV2FybmVkKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gd2FybmVkLmhhcyhtZXNzYWdlKTtcbn1cbmZ1bmN0aW9uIHdhcm5PbmNlKGNvbmRpdGlvbiwgbWVzc2FnZSwgZXJyb3JDb2RlKSB7XG4gICAgaWYgKGNvbmRpdGlvbiB8fCB3YXJuZWQuaGFzKG1lc3NhZ2UpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc29sZS53YXJuKGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpKTtcbiAgICB3YXJuZWQuYWRkKG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgeyBoYXNXYXJuZWQsIHdhcm5PbmNlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD13YXJuLW9uY2UubWpzLm1hcFxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion-utils/dist/es/warn-once.mjs\n");

/***/ })

};
;