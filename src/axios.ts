import axios from "axios";
import router from "@/router";
import { message } from "antd";
const service = axios.create({
    baseURL: '/api',
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
        Promise.reject(err)
        return
    }
)

service.interceptors.response.use(
    (res) => {
        const { data, config } = res
        if (data.code === '200') {
            return data.data
        } else if (data.code === '-1') {
            if (!config.url?.includes('/login')) {
                message.error(data.msg || '登录过期,请重新登录')
                localStorage.removeItem('mental-token')
                localStorage.removeItem('userInfo')
                router.navigate('/auth/login', { replace: true })
            }
        } else {
            message.error(data.msg)
            Promise.reject('网络请求失败')
            return
        }
    },
    (err) => {
        Promise.reject(err)
        return
    }
)
export default service