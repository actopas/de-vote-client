/*
 * @Describle: 
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2024-08-09 02:22:02
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2024-08-09 02:22:04
 */
// craco.config.js
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
