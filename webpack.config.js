'use strict';
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    //入口
    entry: {
        main: './src/main.js',
        vendor: ['vue', 'vue-router', 'axios', 'mint-ui', 'moment', 'vue-preview'], //第三方库
    },
    output: {
        path: __dirname + '/dist/'
    },
    module: {
        loaders: [{
                test: /.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader", //最终的回路使用style-loader
                    use: ["css-loader", 'autoprefixer-loader']
                })
            }, {
                test: /.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader", //最终的回路使用style-loader
                    use: ["css-loader", 'autoprefixer-loader', 'less-loader']
                })
            }, {
                test: /.(jpg|png|ttf|svg|bmp|gif|eot|woff|woff2)$/,
                loader: 'url-loader?limit=4096',
            }, {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }, {
                test: /.vue$/,
                loader: 'vue-loader', //vue-loader 依赖vue-template-compiler
            }, { //如果是用vue-cli 脚手架生成的代码使用vue-preview的时候需要加上下面代码
                test: /vue-preview.src.*?js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }


        ]
    },
    plugins: [new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new ExtractTextPlugin('[chunkhash].css'), //处理css，生成文件
        //内置提取公共模块插件
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'minifast']
                //minifast 不给一个清单文件，修改了main也仍然会导致vender的重新生成
        }),
        //内置插件完成js的压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        //声明全局的Jquery
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        //处理vue开发环境的提示，告知vue当前是生产环境
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ],
    devServer: {
        proxy: {
            '/v2/*': {
                target: 'https://api.douban.com/',
                changeOrigin: true,
            }
        }

    }
}

// console.log(process.argv.length);
//webpack-dev-server --line --hot
if (process.argv.length === 5) {
    //webpack-dev-server启动的
    module.exports.output.filename = '[name].js';
} else { //webpack
    module.exports.output.filename = '[name].[chunkhash].js';
}
