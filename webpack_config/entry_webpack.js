//声明entry变量
const entry = {};
//声明路径属性
entry.path = {
    entry: './src/entery.js',
    main: './src/main.js',
    jquery:'jQuery',
    vue:'vue'
}
//进行模块化
module.exports = entry;