// Next.js configuration

// import 'webpack' module
const webpack = require("webpack");
// load environment variables from .env file
require("dotenv").config();

// export object that configures 'webpack' bundler
module.exports = {
  // define function to modify default 'webpack' config
  webpack: (config) => {
    // Object.keys...: get array of all .env variable names, or keys
    // .reduce...: iterate over array, construct an object where the keys are `process.env.<key>`
    const env = Object.keys(process.env).reduce((account, current) => {
      account[`process.env.${current}`] = JSON.stringify(process.env[current]);

      return account;
    }, {});

    // add new plugin 'DefinePlugin' to 'webpack' config
    // 'DefinePlugin' enables creation of global constants that are configurable during compile time (real-time)
    config.plugins.push(new webpack.DefinePlugin(env));

    // return modified 'webpack' config
    return config;
  },
};
