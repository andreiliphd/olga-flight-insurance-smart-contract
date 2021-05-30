const webpack = require('webpack')
const path = require('path')
const StartServerPlugin = require('start-server-webpack-plugin-2')

module.exports = {
    entry: [path.join(__dirname, '/src/server/index.js')],
    watch: true,
    target: 'node',
    module: {
        rules: [{
            test: /\.js?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        new StartServerPlugin({
                name: 'index.js',
                nodeArgs: ['--inspect']
            }
        ),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.js'
    },
    experiments: {
        topLevelAwait: true
    }
}