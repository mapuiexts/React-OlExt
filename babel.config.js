module.exports = {
    presets: [
        [
          "@babel/preset-env", {
            "useBuiltIns": "usage",
            "corejs": 3
          }
        ],
        ["@babel/preset-react", { "runtime": "automatic" }]
    ],
    // env: {
    //   test: {
    //     plugins: [
    //       '@babel/plugin-transform-modules-commonjs'
    //     ]
    //   }
    // },
    // plugins: [
    //   '@babel/plugin-syntax-dynamic-import',
    //   '@babel/plugin-proposal-class-properties',
    //   [
    //     'import',
    //     {
    //       libraryName: 'antd',
    //       libraryDirectory: 'es',
    //       style: true
    //     },
    //     'import-antd'
    //   ]
    // ]
  };