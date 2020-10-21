//发布阶段需要用到的babel
//判断是不是开发环境
//const prodPlugins=[]
// if(process.env.NODE_ENV==='development'){
// 	prodPlugins.push('transform-remove-console')
// }
//config.baseUrl.dev:config.baseUrl.pro

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins':[
	  // ...prodPlugins
	  ['@babel/plugin-syntax-dynamic-import']
  ]
}
