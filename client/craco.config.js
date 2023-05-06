// TODO : We really have to move on to manual webpack settings(OR rollup)

const webpack = require('webpack'); 
const CracoAlias = require('craco-alias')
// const CracoEslintWebpackPlugin = require('craco-eslint-webpack-plugin')

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    fs: false,
                    path: require.resolve("path-browserify"),
                    crypto: require.resolve("crypto-browserify"),
                    stream: require.resolve("stream-browserify"),
                },
                symlinks: false
            },
            plugins: [
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                    Buffer: ["buffer", "Buffer"]
               })
            ],
            module: {
                rules: [
                    {
                       test: /\.m?js/,
                       resolve: {
                           fullySpecified: false
                       }
                    }
                ]
            }
        },
    },
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'options',
                baseUrl: './src',
                aliases: {
                    "#": ".",
                    "#common": "./common" // symlink 
                },
                // tsconfig: './tsconfig.json'
            }
            // {
            //     source: 'tsconfig',
            //     baseUrl: './src',
            //     tsConfigPath: './tsconfig.extend.json'
            // }
        },
        // {
        //     plugin: CracoEslintWebpackPlugin,
        //     options: {
        //         skipPreflightCheck: true,
        //         eslintOptions: {
        //             files: 'src/**/*.{js,jsx,ts,tsx}',
        //             lintDirtyModulesOnly: true,
        //         },
        //     },
        // },
    ],
}