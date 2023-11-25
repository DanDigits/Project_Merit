module.exports = {
  testEnvironment: "node",

  // Directories that Jest should use for tests
  roots: ["<rootDir>"],

  // File patterns that Jest uses to detect test files
  testMatch: ["**/__tests__/report.test.js", "user.test.js"],

  // Transform files before running tests, for example, transform JavaScript using Babel
  transform: {
    "^.+\\.js$": "babel-jest",
  },

  // Coverage report configuration
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["src/**/*.js"],
};
