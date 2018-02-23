const path = require('path'),//引入node的path对象
uglify = require('uglifyjs-webpack-plugin'),//压缩JS代码
htmlPlugin= require('html-webpack-plugin'),//html使用img标签
extractTextPlugin = require("extract-text-webpack-plugin"),//抽取分离css
glob = require('glob'),//引入node的glob对象
PurifyCSSPlugin = require("purifycss-webpack"),//消除未使用的CSS，注意：使用这个插件必须配合extract-text-webpack-plugin这个插件
entry=require("./webpack_config/entry_webpack.js"),//模块化入口文件
webpack = require('webpack');//引入

// var website ={
//     publicPath:"http://localhost:1717/"//主要作用就是处理静态文件路径的;
// }
if(process.env.type== "build"){
    var website={
        publicPath:"http://localhost:1717/"//开发环境
    }
}else{
    var website={
        publicPath:"http://localhost:1717/"//生产环境
    }
}
module.exports={
    //生产source maps 文件，方便调试,正式环境注意注释！！！
    // devtool: 'eval-source-map',
    //入口文件的配置项
    entry:entry.path,
    //出口文件的配置项
    output:{
            //打包的路径文职    
            path:path.resolve(__dirname,'dist'),
            filename:'[name].js',
            publicPath:website.publicPath
            },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules: [
            {
              test: /\.css$/,
              use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            })
            },
            {
                test:/\.(png|jpg|gif)/ ,
               use:[{
                   loader:'url-loader',
                   options:{
                       limit:500000,
                       outputPath:'images/',
                   }
               }]
            },
            {
                test: /\.(htm|html)$/i,
                 use:[ 'html-withimg-loader'] 
            },
            {
                test: /\.less$/,
                use:extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/
            },
            /* 用来解析vue后缀的文件 */
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
          ]
    },
    //插件，用于生产模版和各项功能
    plugins:[
        new uglify(),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
           
        }),
        new extractTextPlugin("/css/index.css"),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),//主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了
            }),
            
            new webpack.BannerPlugin('李伟鹏版权所有！')
    ],
    //配置webpack开发服务功能
    devServer:{ //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717
    },
    watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/, 
    },
    externals: {
        jquery: "jQuery" //如果要全局引用jQuery，不管你的jQuery有没有支持模块化，用externals就对了。
    }
}