module.exports = {
    verbose: true,
    setupFiles: [
        '<rootDir>/__mocks__/admin-bar.js'
    ],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
   }
};
