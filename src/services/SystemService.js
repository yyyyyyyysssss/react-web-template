import { message } from "antd"
import httpWrapper from "./AxiosWrapper"


export const fetchMenuTree = async () => {
    try {
        const res = await httpWrapper.get('/api/system/menu/tree')
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}



const handleError = (error) => {
    // 这里可以加入更多的错误处理逻辑，比如发送错误日志、显示错误信息等
    message.error(error.message || '未知错误')
}