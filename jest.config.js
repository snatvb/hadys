module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    modulePathIgnorePatterns: ['/node_modules/', '/dist/'],
    // collectCoverage: true,
    // collectCoverageFrom: ['src/**/*.ts'],
    // coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
    // coverageReporters: ['json', 'lcov', 'text', 'clover'],
    // coverageDirectory: 'coverage',
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //         statements: 80,
    //     },
    // },
};
