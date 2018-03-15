const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");
const myConfig = require("../webpack.config.js");

module.exports = (baseConfig, env) => {
    const config = genDefaultConfig(baseConfig, env);
    config.module.rules = myConfig.module.rules;
    return config;
};
