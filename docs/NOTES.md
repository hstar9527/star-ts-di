{
"name": "axios-encrypt-request", // 你的库名（npm发布时确保唯一，可修改）
"version": "1.0.0", // 版本号（发布时递增，遵循semver）
"description": "Axios请求前置加密库，支持AES加密，可自定义加密规则",
"main": "dist/cjs/index.js", // CommonJS入口
"module": "dist/es/index.js", // ESModule入口
"umd": "dist/umd/index.js", // UMD入口
"types": "dist/types/index.d.ts", // 类型声明入口
"files": [ // npm发布时包含的文件（仅发布dist和必要文档）
"dist",
"README.md",
"package.json"
],
"keywords": ["axios", "encrypt", "request-encrypt", "aes", "typescript"],
"author": "your-name", // 你的名字/团队
"license": "MIT", // 开源协议（推荐MIT）
"repository": { // 仓库地址（可选，github/gitlab）
"type": "git",
"url": "git+https://github.com/your-name/axios-encrypt-request.git"
},
"bugs": { // bug反馈地址（可选）
"url": "https://github.com/your-name/axios-encrypt-request/issues"
},
"homepage": "https://github.com/your-name/axios-encrypt-request#readme", // 主页（可选）
"dependencies": {
"axios": "^1.6.8",
"crypto-js": "^4.2.0"
},
"devDependencies": {
"@rollup/plugin-commonjs": "^25.0.7",
"@rollup/plugin-node-resolve": "^15.2.3",
"@rollup/plugin-typescript": "^11.1.6",
"@types/axios": "^0.14.0",
"@types/crypto-js": "^4.2.2",
"@types/jest": "^29.5.12",
"@types/nyc": "^15.0.3",
"@typescript-eslint/eslint-plugin": "^7.5.0",
"@typescript-eslint/parser": "^7.5.0",
"axios-mock-adapter": "^1.22.0",
"cross-env": "^7.0.3",
"eslint": "^8.57.0",
"eslint-config-prettier": "^9.1.0",
"jest": "^29.7.0",
"nyc": "^15.1.0",
"prettier": "^3.2.5",
"rimraf": "^5.0.5",
"rollup": "^4.13.0",
"rollup-plugin-dts": "^6.1.0",
"rollup-plugin-terser": "^7.0.2",
"ts-jest": "^29.1.2",
"typescript": "^5.4.4"
},
"scripts": {
"clean": "rimraf dist", // 清理打包目录
"build": "pnpm clean && rollup -c", // 打包（先清理再打包）
"test": "jest", // 执行单元测试
"test:cov": "jest --coverage", // 执行测试并生成覆盖率报告
"lint": "eslint src/**/\*.ts test/**/_.ts", // 代码检查
"format": "prettier --write src/\*\*/_.ts test/\*_/_.ts", // 代码格式化
"prepublishOnly": "pnpm lint && pnpm test:cov && pnpm build" // 发布前钩子（必过检查、测试、打包）
},
"engines": { // 兼容的Node版本
"node": ">=16.0.0"
},
"publishConfig": { // npm发布配置（可选，如发布到淘宝源/私有源）
"access": "public" // 公开包（默认，私有包需配置access: restricted）
}
}
