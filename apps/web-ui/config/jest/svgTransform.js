module.exports = {
  getCacheKey() {
    return 'svgTransform';
  },
  process() {
    return 'module.exports = {};';
  },
};
