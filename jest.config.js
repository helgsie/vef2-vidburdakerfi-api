export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./src/tests/setup.ts'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            useESM: true,
        }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
};