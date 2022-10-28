const CracoAlias = require('craco-alias')
// const CracoEslintWebpackPlugin = require('craco-eslint-webpack-plugin')

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'options',
                baseUrl: './src',
                aliases: {
                    "#": ".",
                }
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