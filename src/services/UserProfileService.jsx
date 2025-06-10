


// 获取当前用户的菜单

import { apiRequestWrapper } from "./ApiRequestWrapper"
import httpWrapper from "./AxiosWrapper"

export const fetchUserMenuTree = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/profile/menu'))
}