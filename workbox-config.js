/**
 * Unused
 * https://developers.google.com/web/tools/workbox/guides/generate-service-worker/cli
 */
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{js,txt,png,ico,jpg,svg,html,json,css}'],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'dist/sw.js',
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
};
