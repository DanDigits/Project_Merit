const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "https://merit.testing.systems",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
