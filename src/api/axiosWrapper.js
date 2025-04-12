import axios from "axios";
import Cookies from 'js-cookie'
import { message } from "antd"
import router from '../router/router';
import { jwtDecode } from 'jwt-decode'
import env from "../env";


const httpWrapper = axios.create({
    baseURL: env.apiUrl,
    timeout: 60000
})

httpWrapper.interceptors.request.use(
    (req) => {
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
        Promise.reject(error);
    }
)


httpWrapper.interceptors.response.use(
    (res) => {
        if (res.status < 200 || res.status > 300) {
            message.error(res.msg)
            return Promise.reject(new Error(res.msg) || 'Unknown Error');
        } else {
            return res.data;
        }
    },
    (error) => {
        if (!error.response) {
            message.error(error.message || '网络错误');
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
                message.error("未经授权的访问");
                break;
            case 500:
                message.error('服务器内部错误')
                break;
            default:
                message.error(errorMessage || '未知错误');
                break;
        }
        return Promise.reject(error);
    }
)



export default httpWrapper;
