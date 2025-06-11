


// 获取当前用户的菜单

import { apiRequestWrapper } from "./ApiRequestWrapper"
import httpWrapper from "./AxiosWrapper"

export const fetchUserInfo = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/profile/user/info'))
}