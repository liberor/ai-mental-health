import axios from "axios";
import router from "@/router";
import { message } from "antd";
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
})

service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('mental-token')
        if (token) {
            config.headers['token'] = token
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

service.interceptors.response.use(
    (res) => {
        const { data, config } = res
        if (data.code === '200') {
            return data.data
        } else if (data.code === '-1') {
            if (data.msg !== "无效的会话ID格式" && !config.url?.includes('/login')) {
                message.error(data.msg || '登录过期,请重新登录')
                localStorage.removeItem('mental-token')
                localStorage.removeItem('userInfo')
                router.navigate('/auth/login', { replace: true })
            }
            return res
        } else {
            message.error(data.msg)
            return Promise.reject('网络请求失败')
        }
    },
    (err) => {
        // if(err.status === 403){
        //     message.error('登录过期,请重新登录')
        //     localStorage.removeItem('mental-token')
        //     localStorage.removeItem('userInfo')
        //     window.location.replace('/auth/login')
        // }
        return Promise.reject(err)
    }
)
export default service