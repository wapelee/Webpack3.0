关于Webpack3.0的学习

打包：可以把多个Javascript文件打包成一个文件，减少服务器压力和下载带宽。

转换：把拓展语言转换成为普通的JavaScript，让浏览器顺利运行。

优化：前端变的越来越复杂后，性能也会遇到问题，而WebPack也开始肩负起了优化和提升性能的责任。


具体安装方法：

用win+R打开运行对话框，输入cmd进入命令行模式。然后找到你想开始项目的地方，输入下方代码：

mkdir webpack_demo
cd webpack_demo
第一句是建立一个文件夹，第二句是进入这个文件夹。这个文件夹就是我们的项目文件目录了，文件夹建立好后，可以通过下面命令安装WebPack。

需要注意的是,你在执行下一步时必须安装node，可以通过 node -v来查看node安装情况和版本，如果没有安装，要先安装node才可以继续进行。



//全局安装
npm install -g webpack
如果你这时安装失败了（出现了报错信息），一般有三种可能：

检查你node的版本号，如果版本号过低，升级为最新版本。
网络问题，可以考虑使用cnpm来安装（这个是淘宝实时更新的镜像）,具体可以登录cnpm的官方网站学习http://npm.taobao.org/。
权限问题，在Liux、Mac安装是需要权限，如果你是Windows系统，主要要使用以管理员方式安装。
注意：全局安装是可以的，但是webpack官方是不推荐的。这会将您项目中的 webpack 锁定到指定版本，并且在使用不同的 webpack 版本的项目中，可能会导致构建失败。

只有项目安装webpack，如何打包？

有的小伙伴在学习视频时，并没有全局安装webpack，而是使用了项目安装。首先我要说的是，这种做法是webpack推崇的，webpack并不鼓励全局安装webpack。但是小伙伴看我视频中直接在终端用webpack进行打包项目，他使用时会出现不是内部命令或者外部命令。

这时候需要配置package.json里的scripts选项，我们以前的课程已经学习了配置 webpack-dev-server命令，在这个命令下面我们再加一个build命令进行打包项目使用。"scripts": {
    "server": "webpack-dev-server --open",
    "build":"webpack"
  },

配置完成后，可以在控制台输入npm run build 进行打包。
	
npm init  初始化生成package.json文件
npm install --save-dev webpack 进行项目目录的安装：这里的参数–save是要保存到package.json中，dev是在开发时使用这个包，而生产环境中不使用
查看webpack版本

webpack -v

配置文件webpack.config.js

webpack.config.js就是Webpack的配置文件，这个文件需要自己在项目根目录下手动建立。建立好后我们对其进行配置，先看下面的代码（webpack.config.js的基本结构），这是一个没有内容的标准webpack配置模版。

module.exports={
    //入口文件的配置项
    entry:{},
    //出口文件的配置项
    output:{},
    //模块：例如解读CSS,图片如何转换，压缩
    module:{},
    //插件，用于生产模版和各项功能
    plugins:[],
    //配置webpack开发服务功能
    devServer:{}
}

entry：配置入口文件的地址，可以是单一入口，也可以是多入口。
output：配置出口文件的地址，在webpack2.X版本后，支持多出口配置。
module：配置模块，主要是解析CSS和图片转换压缩等功能。
plugins：配置插件，根据你的需要配置不同功能的插件。
devServer：配置开发服务功能，后期我们会详细讲解。


配置文件： 服务和热更新
npm install webpack-dev-server --save-dev    安装webpack-dev-server
package.json里配置一下scripts选项
"scripts": {
    "server":"webpack-dev-server"
 },

在npm run server  启动后，它是有一种监控机制的（也叫watch）。它可以监控到我们修改源码，并立即在浏览器里给我们更新。



npm install style-loader --save-dev
npm install --save-dev css-loader

修改webpack.config.js中module属性中的配置代码如下：
module:{
        rules: [
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
          ]
    },
loader的三种写法：
第一种写法：直接用use。
module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },
第二种写法：把use换成loader。
module:{
        rules:[
            {
                test:/\.css$/,
                loader:['style-loader','css-loader']
            }
        ]
    },
第三种写法：用use+loader的写法：
module:{
        rules:[
            {
                test:/\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    },

插件配置：配置JS压缩
现在你写的JS代码，在上线之前，都是需要进行压缩的，在没有webpack和gulp这些工具前，你可能需要找一个压缩软件或者在线进行压缩，在Webpack中可以很轻松的实现JS代码的压缩，它是通过插件的方式实现的，这里我们就先来引入一个uglifyjs-webpack-plugin(JS压缩插件，简称uglify)。

注意：虽然uglifyjs是插件，但是webpack版本里默认已经集成，不需要再次安装。
我们需要在webpack.config.js中引入uglifyjs-webpack-glugin插件
const uglify = require('uglifyjs-webpack-plugin');

引入后在plugins配置里new一个 uglify对象就可以了，代码如下。

plugins:[
        new uglify()
    ],

打包HTML文件：
先引入我们的html-webpack-plugin插件
	
const htmlPlugin= require('html-webpack-plugin');
引入后使用npm进行安装包。

npm install --save-dev html-webpack-plugin
最后在webpack.config.js里的plugins里进行插件配置，配置代码如下。
new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
           
        })
minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
hash：为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
template：是要打包的html模版路径和文件名称。

上边的都配置完成后，我们就可以在终端中使用webpack，进行打包。你会看到index.html文件已经被打包到我们的dist目录下了，并且自动为我们引入了路口的JS文件。

CSS中的图片处理：
我们先安装两个解析图片用的loader。

安装file-loader和url-loader

npm install --save-dev file-loader url-loader
file-loader：解决引用路径的问题，拿background样式用url引入背景图来说，我们都知道，webpack最终会将各个模块打包成一个文件，因此我们样式中的url路径是相对入口html页面的，而不是相对于原始css文件所在的路径的。这就会导致图片引入失败。这个问题是用file-loader解决的，file-loader可以解析项目中的url引入（不仅限于css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。

url-loader：如果图片较多，会发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此url-loader提供了一个limit参数，小于limit字节的文件会被转为DataURl，大于limit的还会使用file-loader进行copy。
配置url-loader

我们安装好后，就可以使用这个loader了，记得在loader使用时不需要用require引入，在plugins才需要使用require引入。

webpack.config.js文件
//模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules: [
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            },{
               test:/\.(png|jpg|gif)/ ,
               use:[{
                   loader:'url-loader',
                   options:{
                       limit:500000
                   }
               }]
            }
          ]
    },
test:/\.(png|jpg|gif)/是匹配图片文件后缀名称。
use：是指定使用的loader和loader的配置参数。
limit：是把小于500000B的文件打成Base64的格式，写入JS。
写好后就可以使用webpack进行打包了，这回你会发现打包很顺利的完成了。

CSS分离:extract-text-webpack-plugin
有些简单的交互页面中，你的JavasScript页面代码会非常少，而大部分代码都在CSS中，这时候项目组长会要求把CSS单独提取出来，方便以后更改。遇到这个需求你不要惊慌，已经有大神为我们准备好了对象的插件（plugin）。

extract-text-webpack-plugin


1
npm install --save-dev extract-text-webpack-plugin
引入：安装完成后，需要先用require引入。
const extractTextPlugin = require("extract-text-webpack-plugin");
设置Plugins：引入成功后需要在plugins属性中进行配置。这里只要new一下这个对象就可以了。
new extractTextPlugin("/css/index.css")

这里的/css/index.css是分离后的路径位置。这部配置完成后，包装代码：还要修改原来我们的style-loader和css-loader。

修改代码如下。
module:{
        rules: [
            {
              test: /\.css$/,
              use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
              })
            },{
               test:/\.(png|jpg|gif)/ ,
               use:[{
                   loader:'url-loader',
                   options:{
                       limit:500000
                   }
               }]
            }
          ]
    },

图片路径问题：
publicPath：是在webpack.config.js文件的output选项中，主要作用就是处理静态文件路径的。
在处理前，我们在webpack.config.js 上方声明一个对象，叫website。
var website ={
    publicPath:"http://192.168.1.108:1717/"
}
注意，这里的IP和端口，是你本机的ip或者是你devServer配置的IP和端口。

然后在output选项中引用这个对象的publicPath属性。
//出口文件的配置项
    output:{
        //输出的路径，用了Node语法
        path:path.resolve(__dirname,'dist'),
        //输出的文件名称
        filename:'[name].js',
        publicPath:website.publicPath
    },

处理HTML中的图片：
html-withimg-loader：解决的问题就是在hmtl文件中引入<img>标签的问题。
npm install html-withimg-loader --save
配置loader
{
    test: /\.(htm|html)$/i,
     use:[ 'html-withimg-loader'] 
}

Less文件的打包和分离
安装:
npm install --save-dev less
还需要安装Less-loader用来打包使用。
npm install --save-dev less-loader
写loader配置：

{
    test: /\.less$/,
    use: [{
           loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        , {
            loader: "less-loader" // compiles Less to CSS
        }]
}
把Lees文件分离：
extract-text-webpack-plugin这个插件；分离插件
配置一下loader就好
{
            test: /\.less$/,
            use: extractTextPlugin.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }],
                // use style-loader in development
                fallback: "style-loader"
            })
 }

SASS文件的打包和分离：
安装SASS打包的loader：

npm install --save-dev node-sass
sass-loader:
npm install --save-dev sass-loader
编写loader配置

{
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
}

把SASS文件分离：

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
 }

自动处理CSS3属性前缀：
PostCSS是一个CSS的处理平台，它可以帮助你的CSS实现更多的功能，但是今天我们就通过其中的一个加前缀的功能，初步了解一下PostCSS。
安装：需要安装两个包postcss-loader 和autoprefixer（自动添加前缀的插件）
npm install --save-dev postcss-loader autoprefixer
postCSS推荐在项目根目录（和webpack.config.js同级），建立一个postcss.config.js文件
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
这就是对postCSS一个简单的配置，引入了autoprefixer插件。让postCSS拥有添加前缀的能力，它会根据 can i use 来增加相应的css3属性前缀。

编写loader
{
      test: /\.css$/,
      use: [
            {
              loader: "style-loader"
            }, {
              loader: "css-loader",
              options: {
                 modules: true
              }
            }, {
              loader: "postcss-loader"
            }
      ]
}
提取CSS：
配置提取CSS的loader配置.：
{
    test: /\.css$/,
    use: extractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
        ]
    })
    
}
这里给出postcss-loader的github地址：https://github.com/postcss/postcss-loader

消除未使用的CSS：
PurifyCSS：使用PurifyCSS可以大大减少CSS冗余，比如我们经常使用的BootStrap(140KB)就可以减少到只有35KB大小。这在实际开发当中是非常有用的。
安装PurifyCSS-webpack：从名字你就可以看出这是一个插件，而不是loader。所以这个需要安装还需要引入。 PurifyCSS-webpack要以来于purify-css这个包，所以这两个都需要安装。
npm i -D purifycss-webpack purify-css

引入glob：因为我们需要同步检查html模板，所以我们需要引入node的glob对象使用。在webpack.config.js文件头部引入glob。
const glob = require('glob');

引入purifycss-webpack：

const PurifyCSSPlugin = require("purifycss-webpack");

配置plugins：
new PurifyCSSPlugin({
        // Give paths to parse for rules. These should be absolute!
        paths: glob.sync(path.join(__dirname, 'src/*.html')),
        })

这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。

给webpack增加babel支持
Babel其实是一个编译JavaScript的平台，它的强大之处表现在可以通过便宜帮你达到以下目的：

使用下一代的javaScript代码(ES6,ES7….)，即使这些标准目前并未被当前的浏览器完全支持。
使用基于JavaScript进行了扩展的语言，比如React的JSX。

Babel的安装与配置

Babel其实是几个模块化的包，其核心功能位于称为babel-core的npm包中，webpack可以把其不同的包整合在一起使用，对于每一个你需要的功能或拓展，你都需要安装单独的包（用得最多的是解析ES6的babel-preset-es2015包和解析JSX的babel-preset-react包）。

我们先一次性安装这些依赖包
cnpm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react

在webpack中配置Babel的方法如下：
{
    test:/\.(jsx|js)$/,
    use:{
        loader:'babel-loader',
        options:{
            presets:[
                "es2015","react"
            ]
        }
    },
    exclude:/node_modules/
}
.babelrc配置：虽然Babel可以直接在webpack.config.js中进行配置，但是考虑到babel具有非常多的配置选项，如果卸载webapck.config.js中会非常的雍长不可阅读，所以我们经常把配置卸载.babelrc文件里。


{
    "presets":["react","es2015"]
}
.webpack.config.js里的loader配置

{
    test:/\.(jsx|js)$/,
    use:{
        loader:'babel-loader',
    },
    exclude:/node_modules/
}

ENV：现在网络上已经不流行babel-preset-es2015，现在官方推荐使用的是babel-preset-env,env的配置方法。
首先需要下载：

npm install --save-dev babel-preset-env

然后修改.babelrc里的配置文件。其实只要把之前的es2015换成env就可以了。
{
    "presets":["react","env"]
}

打包后如何调试:
在使用webpack时只要通过简单的devtool配置，webapck就会自动给我们生产source maps 文件，map文件是一种对应编译文件和源文件的方法，让我们调试起来更简单。
四种选项

在配置devtool时，webpack给我们提供了四种选项。

source-map:在一个单独文件中产生一个完整且功能完全的文件。这个文件具有最好的source map,但是它会减慢打包速度；
cheap-module-source-map:在一个单独的文件中产生一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号）,会对调试造成不便。
 eval-source-map:使用eval打包源文件模块，在同一个文件中生产干净的完整版的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定要不开启这个选项。
cheap-module-eval-source-map:这是在打包文件时最快的生产source map的方法，生产的 Source map 会和打包后的JavaScript文件同行显示，没有影射列，和eval-source-map选项具有相似的缺点。
四种打包模式，有上到下打包速度越来越快，不过同时也具有越来越多的负面作用，较快的打包速度的后果就是对执行和调试有一定的影响。

个人意见是，如果大型项目可以使用source-map，如果是中小型项目使用eval-source-map就完全可以应对，需要强调说明的是，source map只适用于开发阶段，上线前记得修改这些调试设置。
module.exports = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}
注意：调试在开发中也是必不可少的，但是一定要记得在上线前一定要修改webpack配置，在打出上线包。

实战技巧：开发和生产并行设置

npm安装：
假如我们要在项目中使用jquery库，这时候我们一般有三种安装方法，每种我都详细讲解一下。

第一种：
npm install jquery
安装完成后，你会发现在package.json中并不存在这个包的依赖。如果你项目拷贝给别人继续开发，或者别人和你git合作，再次下载项目npm install时就会缺少这个jquery包。项目就会无法正常运行，所以这也是我们最不赞成的安装方法。

第二种：
npm install jquery --save
安装完成后，它存在于package.json的dependencies中，也就是说它是生产环境需要依赖的包（上线时需要的以来包）。

第三种：
npm install jquery --save-dev

安装完成后，它存在于package.json的devDependencies中，也就是说它是开发环境中需要的，上线并不需要这个包的依赖。

安装全部项目依赖包：
npm install

安装生产环境依赖包：
npm install --production

配置生产和开发并行：
在以前的配置中设置了一个变量website，用于静态资源正确找到路径。那如果生产环境和开发环境不一样，而且我们需要来回切换，这时候我们需要更好的设置方法。

修改package.json命令：
其实就是添加一个dev设置，并通过环境变量来进行区分，下面是package.json里的值。
"scripts": {
    "server": "webpack-dev-server --open",
    "dev":"set type=dev&webapck",
    "build": "set type=build&webpack"
  },

修改webpack.config.js文件：
可以利用node的语法来读取type的值，然后根据type的值用if–else判断。
if(process.env.type== "build"){
    var website={
        publicPath:"http://192.168.0.104:1717/"
    }
}else{
    var website={
        publicPath:"http://cdn.jspang.com/"
    }
}

如果你说我想看一下传过来的值到底是什么？可以用下面的输出语句。

console.log( encodeURIComponent(process.env.type) );

Mac下的package.json设置：
MAC电脑下需要把set换成export，并且要多加一个&符，具体代码如下。
 "scripts": {
    "server": "webpack-dev-server --open",
    "dev":"export type=dev&&webpack",
    "build": "export type=build&&webpack"
  },

实战技巧：webpack模块化配置

把webpack.config.js中的entry入口文件进行模块化设置，单独拿出来制作成一个模块。
首先在根目录，新建一个webpack_config文件夹，然后新建entry_webpack.js文件，代码如下：

//声明entry变量
const entry ={};  
//声明路径属性
entry.path={
    entry:'./src/entry.js'  
}
//进行模块化
module.exports =entry;

配置的模块化代码编写好以后，需要在webpack.config.js中引入，注意这里的引入只能使用require的方法。

const entry = require("./webpack_config/entry_webpack.js")
然后在入口文件部分，修改成如下代码：
entry:entry.path,

这时候你可以再次使用npm  run dev 进行测试，你会发现模块化成功了。

实战技巧：优雅打包第三方类库

引入JQuery

安装JQuery
	
npm install --save jquery

修改entry.js文件
import $ from 'jquery';
引入好后我们就可以在entry.js里使用jquery

用plugin引入：

ProvidePlugin是一个webpack自带的插件，Provide的意思就是装备、提供。因为ProvidePlugin是webpack自带的插件，所以要先再webpack.config.js中引入webpack。
const webpack = require('webpack');

引入成功后配置我们的plugins模块，代码如下。
plugins:[
    new webpack.ProvidePlugin({
        $:"jquery"
    })
],

配置好后，就可以在你的入口文件中使用了，而不用再次引入了。这是一种全局的引入，在实际工作中也可以很好的规范项目所使用的第三方库。


实战技巧：watch的正确使用方法
watch的配置：
watchOptions:{
    //检测修改的时间，以毫秒为单位
    poll:1000, 
    //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
    aggregateTimeout:500, 
    //不监听的目录
    ignored:/node_modules/, 
}

在没配置的情况下，直接用webpack –watch是不起作用的，这时候你需要进行配置这些选项。

BannerPlugin插件---版权插件
new webpack.BannerPlugin('李伟鹏版权所有')


实战技巧：webpack优化黑技能
