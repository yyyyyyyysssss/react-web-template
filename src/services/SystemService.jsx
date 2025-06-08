import httpWrapper from "./AxiosWrapper"


export const fetchUserList = async (queryParam) => {
    try {
        const res = await httpWrapper.post('/api/system/user/query', queryParam)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateUserEnabled = async (userId, enabled) => {
    const roleBody = {
        id: userId,
        enabled: enabled
    }
    try {
        const res = await httpWrapper.patch('/api/system/user', roleBody)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const createUser = async (userBody) => {
    try {
        const res = await httpWrapper.post('/api/system/user', userBody)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateUser = async (userBody) => {
    try {
        const res = await httpWrapper.put('/api/system/user', userBody)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const bindRoleByUserId = async (userId, roleIds) => {
    const req = {
        roleIds: roleIds
    }
    try {
        const res = await httpWrapper.post(`/api/system/user/${userId}/roles`, req)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const deleteUserById = async (userId) => {
    try {
        const res = await httpWrapper.delete(`/api/system/user/${userId}`)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const resetPassword = async (userId) => {
    try {
        const res = await httpWrapper.put(`/api/system/user/${userId}/password`)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const createRole = async (roleBody) => {
    try {
        const res = await httpWrapper.post('/api/system/role', roleBody)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateRole = async (roleBody) => {
    try {
        const res = await httpWrapper.put('/api/system/role', roleBody)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateRoleEnabled = async (roleId, enabled) => {
    const roleBody = {
        id: roleId,
        enabled: enabled
    }
    try {
        const res = await httpWrapper.patch('/api/system/role', roleBody)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const deleteRoleById = async (roleId) => {
    try {
        const res = await httpWrapper.delete(`/api/system/role/${roleId}`)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const fetchRoleList = async (queryParam) => {
    try {
        const res = await httpWrapper.post('/api/system/role/query', queryParam)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const fetchRoleOptions = async () => {
    try {
        const res = await httpWrapper.get('/api/system/role/options')
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}


export const bindAuthorityByRoleId = async (roleId, authorityIds) => {
    const req = {
        authorityIds: authorityIds
    }
    try {
        const res = await httpWrapper.post(`/api/system/role/${roleId}/authorities`, req)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const fetchMenuTree = async () => {
    try {
        const res = await httpWrapper.get('/api/system/menu/tree')
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const fetchMenuDetails = async (menuId) => {
    try {
        const res = await httpWrapper.get(`/api/system/menu/${menuId}`)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const menuDrag = async (dragId, targetId, position) => {
    try {
        const res = await httpWrapper.post('/api/system/menu/drag', {
            dragId: dragId,
            targetId: targetId,
            position: position
        })
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}


export const createMenu = async (req) => {
    try {
        const res = await httpWrapper.post('/api/system/menu', req)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateMenu = async (req) => {
    try {
        const res = await httpWrapper.put('/api/system/menu', req)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const deleteMenu = async (id) => {
    try {
        const res = await httpWrapper.delete(`/api/system/menu/${id}`)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}


export const addAuthority = async (req) => {
    try {
        const res = await httpWrapper.post('/api/system/authority', req)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateAuthority = async (req) => {
    try {
        const res = await httpWrapper.put('/api/system/authority', req)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const deleteAuthorityById = async (id) => {
    try {
        const res = await httpWrapper.delete(`/api/system/authority/${id}`)
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const updateAuthorityUrlsById = async (id, authorityUrls) => {
    try {
        const res = await httpWrapper.patch('/api/system/authority',
            {
                id: id,
                urls: authorityUrls,
            }
        )
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}

export const fetchAuthorityTree = async () => {
    try {
        const res = await httpWrapper.get('/api/system/authority/tree')
        return res.data
    } catch (error) {
        handleError(error)
        throw error
    }
}



const handleError = (error) => {
    // 这里可以加入更多的错误处理逻辑，比如发送错误日志、显示错误信息等
}