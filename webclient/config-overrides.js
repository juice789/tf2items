const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    const fileLoaderRule = getFileLoaderRule(config.module.rules);
    if (!fileLoaderRule) {
        throw new Error("File loader not found");
    }
    fileLoaderRule.exclude.push(/\.cjs$/);
    return config;
}

function getFileLoaderRule(rules) {
    for (const rule of rules) {
        if ("oneOf" in rule) {
            const found = getFileLoaderRule(rule.oneOf);
            if (found) {
                return found;
            }
        } else if (rule.test === undefined && rule.type === 'asset/resource') {
            return rule;
        }
    }
}