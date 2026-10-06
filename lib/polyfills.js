// Stands in for Next's client polyfill module (aliased in next.config.ts).
// That one patches Array#at/flat/flatMap, Object.fromEntries/hasOwn,
// String#trimStart/trimEnd and Promise#finally, all native in every browser
// since 2022 (Safari 15.4); PageSpeed flagged them as 12 KiB of legacy
// JavaScript. URL.canParse is newer (Safari 17, Chrome 120), so it stays.
if (typeof URL !== 'undefined' && !('canParse' in URL)) {
  URL.canParse = function (url, base) {
    try {
      return !!new URL(url, base);
    } catch (e) {
      return false;
    }
  };
}
