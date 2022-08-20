const CracoAlias = require('craco-alias')
// const CracoEslintWebpackPlugin = require('craco-eslint-webpack-plugin')

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'tsconfig',
                baseUrl: './src',
                tsConfigPath: './tsconfig.path.json',
            },
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