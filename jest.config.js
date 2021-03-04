module.exports = {
    roots: ['<rootDir>/tests'],
    verbose: true,
    collectCoverage: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts'],
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsConfig: '<rootDir>/tests/tsconfig.json'
        },
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
};
