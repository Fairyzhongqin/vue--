module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true
  },
  // "globals": {
  //   "Atomics": "readonly",
  //   "SharedArrayBuffer": "readonly"
  // },
  extends: ['plugin:vue/essential', 'standard', 'prettier', "plugin:prettier/recommended"],

  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  plugins: ['vue', 'html', 'prettier'],
  rules: {
    'no-console': [{ allow: ['warn', 'log', 'info'] }],
    indent: [1, 2]
  },
  globals: {
    _: true
  }
}
