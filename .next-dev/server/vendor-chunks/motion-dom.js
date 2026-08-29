"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion-dom";
exports.ids = ["vendor-chunks/motion-dom"];
exports.modules = {

/***/ "(ssr)/./node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs":
/*!*******************************************************************************!*\
  !*** ./node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hasReducedMotionListener: () => (/* reexport safe */ _state_mjs__WEBPACK_IMPORTED_MODULE_0__.hasReducedMotionListener),\n/* harmony export */   initPrefersReducedMotion: () => (/* binding */ initPrefersReducedMotion),\n/* harmony export */   prefersReducedMotion: () => (/* reexport safe */ _state_mjs__WEBPACK_IMPORTED_MODULE_0__.prefersReducedMotion)\n/* harmony export */ });\n/* harmony import */ var _state_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state.mjs */ \"(ssr)/./node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs\");\n\n\nconst isBrowser = typeof window !== \"undefined\";\nfunction initPrefersReducedMotion() {\n    _state_mjs__WEBPACK_IMPORTED_MODULE_0__.hasReducedMotionListener.current = true;\n    if (!isBrowser)\n        return;\n    if (window.matchMedia) {\n        const motionMediaQuery = window.matchMedia(\"(prefers-reduced-motion)\");\n        const setReducedMotionPreferences = () => (_state_mjs__WEBPACK_IMPORTED_MODULE_0__.prefersReducedMotion.current = motionMediaQuery.matches);\n        motionMediaQuery.addEventListener(\"change\", setReducedMotionPreferences);\n        setReducedMotionPreferences();\n    }\n    else {\n        _state_mjs__WEBPACK_IMPORTED_MODULE_0__.prefersReducedMotion.current = false;\n    }\n}\n\n\n//# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9yZWR1Y2VkLW1vdGlvbi9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUE2RTs7QUFFN0U7QUFDQTtBQUNBLElBQUksZ0VBQXdCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELDREQUFvQjtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsNERBQW9CO0FBQzVCO0FBQ0E7O0FBRW9GO0FBQ3BGIiwic291cmNlcyI6WyIvVXNlcnMvY2FuL0Rlc2t0b3Avd2VibGFicy1wb3J0Zm9saW8vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvcmVkdWNlZC1tb3Rpb24vaW5kZXgubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGhhc1JlZHVjZWRNb3Rpb25MaXN0ZW5lciwgcHJlZmVyc1JlZHVjZWRNb3Rpb24gfSBmcm9tICcuL3N0YXRlLm1qcyc7XG5cbmNvbnN0IGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI7XG5mdW5jdGlvbiBpbml0UHJlZmVyc1JlZHVjZWRNb3Rpb24oKSB7XG4gICAgaGFzUmVkdWNlZE1vdGlvbkxpc3RlbmVyLmN1cnJlbnQgPSB0cnVlO1xuICAgIGlmICghaXNCcm93c2VyKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKSB7XG4gICAgICAgIGNvbnN0IG1vdGlvbk1lZGlhUXVlcnkgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLXJlZHVjZWQtbW90aW9uKVwiKTtcbiAgICAgICAgY29uc3Qgc2V0UmVkdWNlZE1vdGlvblByZWZlcmVuY2VzID0gKCkgPT4gKHByZWZlcnNSZWR1Y2VkTW90aW9uLmN1cnJlbnQgPSBtb3Rpb25NZWRpYVF1ZXJ5Lm1hdGNoZXMpO1xuICAgICAgICBtb3Rpb25NZWRpYVF1ZXJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgc2V0UmVkdWNlZE1vdGlvblByZWZlcmVuY2VzKTtcbiAgICAgICAgc2V0UmVkdWNlZE1vdGlvblByZWZlcmVuY2VzKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcmVmZXJzUmVkdWNlZE1vdGlvbi5jdXJyZW50ID0gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgeyBoYXNSZWR1Y2VkTW90aW9uTGlzdGVuZXIsIGluaXRQcmVmZXJzUmVkdWNlZE1vdGlvbiwgcHJlZmVyc1JlZHVjZWRNb3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs\n");

/***/ }),

/***/ "(ssr)/./node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs":
/*!*******************************************************************************!*\
  !*** ./node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hasReducedMotionListener: () => (/* binding */ hasReducedMotionListener),\n/* harmony export */   prefersReducedMotion: () => (/* binding */ prefersReducedMotion)\n/* harmony export */ });\n// Does this device prefer reduced motion? Returns `null` server-side.\nconst prefersReducedMotion = { current: null };\nconst hasReducedMotionListener = { current: false };\n\n\n//# sourceMappingURL=state.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9yZWR1Y2VkLW1vdGlvbi9zdGF0ZS5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBLCtCQUErQjtBQUMvQixtQ0FBbUM7O0FBRXVCO0FBQzFEIiwic291cmNlcyI6WyIvVXNlcnMvY2FuL0Rlc2t0b3Avd2VibGFicy1wb3J0Zm9saW8vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvcmVkdWNlZC1tb3Rpb24vc3RhdGUubWpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIERvZXMgdGhpcyBkZXZpY2UgcHJlZmVyIHJlZHVjZWQgbW90aW9uPyBSZXR1cm5zIGBudWxsYCBzZXJ2ZXItc2lkZS5cbmNvbnN0IHByZWZlcnNSZWR1Y2VkTW90aW9uID0geyBjdXJyZW50OiBudWxsIH07XG5jb25zdCBoYXNSZWR1Y2VkTW90aW9uTGlzdGVuZXIgPSB7IGN1cnJlbnQ6IGZhbHNlIH07XG5cbmV4cG9ydCB7IGhhc1JlZHVjZWRNb3Rpb25MaXN0ZW5lciwgcHJlZmVyc1JlZHVjZWRNb3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0YXRlLm1qcy5tYXBcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs\n");

/***/ })

};
;