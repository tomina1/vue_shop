// const res = await this.$axios.request({
//     url: "/",
//     method: "get",
//     params: {  
//     }
//   });

// let res= await this.$axios.request({
//     url:'/',
//     method:'post',
//     data:this.model
// })
import axios from 'axios'
import config from '@/config/config'
import router from '@/router'
import vue from 'vue'
//判断是不是开发环境
const baseUrl=process.env.NODE_ENV==='development'?config.baseUrl.dev:config.baseUrl.pro

class HttpRequest{
    constructor(baseUrl){
        this.baseUrl=baseUrl
        //请求队列
        this.queue={}
    }
    getInsideConfig(){
        //定死的配置，其他的外面定义就可以了，内外结合
        const config={
            baseURL:this.baseUrl,
            headers:{
                
            }
        }
        if(localStorage.getItem('token') && localStorage.getItem('id')){
            config.headers.Authorization='Bearer '+localStorage.getItem('token')
        }
        return config
    }
    //拦截，传入实例和url
    interceptors(instance,url){
        //实例拦截请求使用配置config
        instance.interceptors.request.use((config)=>{
            //拦截和处理config
            return config
        })
        instance.interceptors.response.use((res)=>{
            //处理响应
            return res
        },(error)=>{
            //请求出问题，处理问题
            if(error.response.status==401||error.response.status==402){
                router.push('login');
                vue.prototype.$Toast.fail(error.response.data.message)
            }
            return {error:"请求出错了"}
        })
    }
    request(options){
        //创造实例对象
        const instance=axios.create()
        //两者结合,如有相同，则覆盖掉原有数据：配置请求体内容
        options =Object.assign(this.getInsideConfig(),options);
        //配置实例拦截器
        this.interceptors(instance,options.url)
        return instance(options)
    }
}

const axiosObj=new HttpRequest(baseUrl);
export default axiosObj;