import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// 外部依赖：不打包进库，让用户自己安装（axios、crypto-js），减小包体积
const external = Object.keys(pkg.dependencies || {});

export default defineConfig([
  // 1. 打包核心代码（多格式）
  {
    input: './src/index.ts',
    output: [
      // ESModule格式（推荐，前端工程使用）
      { file: pkg.module, format: 'es', sourcemap: true },
      // CommonJS格式（Node/CommonJS工程使用）
      { file: pkg.main, format: 'cjs', sourcemap: true },
      // UMD格式（CDN/全局变量使用，导出为window.AxiosEncryptRequest）
      { file: pkg.umd, format: 'umd', name: 'star-ts-di', sourcemap: true },
    ],
    external,
    plugins: [
      nodeResolve(), // 解析Node模块
      commonjs(), // 转换CommonJS为ESModule
      typescript({
        tsconfig: './tsconfig.json',
      }), // 编译TS（使用tsconfig.json配置）
      terser(), // 压缩代码（生产包）
    ],
  },
  // 2. 打包类型声明文件（生成单一.d.ts，方便用户查看类型）
  {
    input: './src/index.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
]);
