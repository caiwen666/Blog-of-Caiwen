// eslint.config.mjs

import path from 'path';

export default {
  // ESLint 配置
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',  // 使用 TypeScript 解析器
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',  // 举例：警告使用 console
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',  // 关闭 any 类型的警告
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off', // 关闭对 TS 文件的 no-undef 检查
      }
    }
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve('./src')]  // 配置模块解析的路径
      }
    }
  }
};
