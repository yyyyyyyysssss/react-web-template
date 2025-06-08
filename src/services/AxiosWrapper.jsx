import axios from "axios";
import Cookies from 'js-cookie'
import router from '../router/router';
import { jwtDecode } from 'jwt-decode'
import env from "../env";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getMessageApi } from "../utils/MessageUtil.jsx";


const httpWrapper = axios.create({
    baseURL: env.apiUrl,
    timeout: 60000
})


let requestCount = 0
const startProgress = () => {
    if (requestCount === 0) {
        NProgress.start()
    }
    requestCount++
}
const stopProgress = () => {
    requestCount--
    requestCount = Math.max(requestCount, 0)
    if (requestCount === 0) {
        NProgress.done()
    }
}

httpWrapper.interceptors.request.use(
    (req) => {
        startProgress()
        const token = Cookies.get("accessToken");
        if (token) {
            const path = req.url;
            //用户id路径参数解析
            if (path.includes("{userId}")) {
                const tokenInfo = jwtDecode(token);
                req.url = path.replaceAll("{userId}", tokenInfo.subject);
            }
            req.headers['Authorization'] = `Bearer ${token}`
        }
        return req;
    },
    (error) => {
        stopProgress()
        return Promise.reject(error);
    }
)


httpWrapper.interceptors.response.use(
    (res) => {
        stopProgress()
        const result = res.data
        if(result.code !== 0){
            getMessageApi().error(result.message)
            return Promise.reject(new Error(result.message))
        }
        return result
    },
    (error) => {
        stopProgress()
        if (!error.response) {
            getMessageApi().error(error.message || '网络错误');
            return Promise.reject(error);
        }
        const { status, message: errorMessage } = error.response;
        switch (status) {
            case 401:
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                if (error.config.url !== '/login') {
                    return router.navigate('/login');
                }
                break
            case 403:
                getMessageApi().error("未经授权的访问");
                break;
            case 500:
                getMessageApi().error('服务器内部错误')
                break;
            default:
                getMessageApi().error(errorMessage || '未知错误');
                break;
        }
        return Promise.reject(error);
    }
)



export default httpWrapper;
