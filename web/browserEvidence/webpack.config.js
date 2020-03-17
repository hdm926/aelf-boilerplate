const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'evidence.bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, './public/'),
        publicPath: '/',
        host: '127.0.0.1',
        port: 3000,
        stats: {
            colors: true
        }
    },
    resolve: {
        alias: {
            'aelf-sdk$': 'aelf-sdk/dist/aelf.umd.js'
        }
    },

    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // jsx/js文件的正则
                exclude: /node_modules/, // 排除 node_modules 文件夹
                use: {
                    // loader 是 babel
                    loader: 'babel-loader',
                    options: {
                        // babel 转义的配置选项
                        babelrc: false,
                        presets: [
                            // 添加 preset-react
                            require.resolve('@babel/preset-react'),
                            [require.resolve('@babel/preset-env'), {modules: false}]
                        ],
                        cacheDirectory: true
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            inject: true
        })
    ]
};
