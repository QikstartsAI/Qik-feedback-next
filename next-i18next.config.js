const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "it", "fr", "zh", "pt"],
    localePath: path.resolve("./public/locales"),
  },
};
