
import { apiRequestWrapper } from "./ApiRequestWrapper"
import httpWrapper from "./AxiosWrapper"

export const fetchUserInfo = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/profile/user/info'))
}

export const fetchUserTenant = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/profile/user/tenant'))
}

export const switchTenantByTenantId = async (tenantId) => {
    const req = {
        tenantId: tenantId
    }
    return apiRequestWrapper(() => httpWrapper.post(`/api/profile/switch/tenant`,req))
}

export const changePassword = async (req) => {

    return apiRequestWrapper(() => httpWrapper.put('/api/profile/password', req))
}



export const changeAvatar = async (newAvatarUrl) => {
    const req = {
        newAvatarUrl: newAvatarUrl
    }
    return apiRequestWrapper(() => httpWrapper.put('/api/profile/avatar', req))
}
