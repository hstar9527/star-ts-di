import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest', // 使用ts-jest解析TS
    testEnvironment: 'node', // 测试环境（Node，无需浏览器）
    moduleFileExtensions: ['ts', 'js'], // 支持的文件扩展名
    rootDir: __dirname, // 项目根目录
    testMatch: ['<rootDir>/test/**/*.test.ts'], // 测试用例匹配规则
    collectCoverage: true, // 开启覆盖率统计
    collectCoverageFrom: [ // 统计覆盖率的文件（源码所有TS）
        '<rootDir>/src/**/*.ts',
        '!**/node_modules/**',
        '!**/types/**'
    ],
    coverageReporters: ['text', 'lcov', 'clover'], // 覆盖率报告格式（控制台、lcov、clover）
    coverageThreshold: { // 覆盖率阈值（强制100%，不满足则测试失败）
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    clearMocks: true, // 每次测试前清除mock
    resetMocks: true  // 重置mock
};

export default config;