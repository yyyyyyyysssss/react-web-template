import { apiRequestWrapper } from "./ApiRequestWrapper"
import httpWrapper from "./AxiosWrapper"

// 用户列表
export const fetchUserList = async (queryParam) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/user/query', queryParam))
}

// 用户停启用
export const updateUserEnabled = async (userId, enabled) => {
    const roleBody = {
        id: userId,
        enabled: enabled
    }
    return apiRequestWrapper(() => httpWrapper.patch('/api/system/user', roleBody))
}

// 创建用户
export const createUser = async (userBody) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/user', userBody))
}

// 更新用户
export const updateUser = async (userBody) => {

    return apiRequestWrapper(() => httpWrapper.put('/api/system/user', userBody))
}

// 用户分配角色
export const bindRoleByUserId = async (userId, roleIds) => {
    const req = {
        roleIds: roleIds
    }
    return apiRequestWrapper(() => httpWrapper.post(`/api/system/user/${userId}/roles`, req))
}

// 删除用户
export const deleteUserById = async (userId) => {

    return apiRequestWrapper(() => httpWrapper.delete(`/api/system/user/${userId}`))
}

// 重置用户密码
export const resetPassword = async (userId) => {

    return apiRequestWrapper(() => httpWrapper.put(`/api/system/user/${userId}/password`))
}

// 创建角色
export const createRole = async (roleBody) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/role', roleBody))
}


// 更新角色
export const updateRole = async (roleBody) => {

    return apiRequestWrapper(() => httpWrapper.put('/api/system/role', roleBody))
}

// 角色停启用
export const updateRoleEnabled = async (roleId, enabled) => {
    const roleBody = {
        id: roleId,
        enabled: enabled
    }
    return apiRequestWrapper(() => httpWrapper.patch('/api/system/role', roleBody))
}

// 删除角色
export const deleteRoleById = async (roleId) => {

    return apiRequestWrapper(() => httpWrapper.delete(`/api/system/role/${roleId}`))
}

// 角色列表
export const fetchRoleList = async (queryParam) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/role/query', queryParam))
}

// 角色选择
export const fetchRoleOptions = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/authenticated/role/options'))
}

// 角色分配权限
export const bindAuthorityByRoleId = async (roleId, authorityIds) => {
    const req = {
        authorityIds: authorityIds
    }
    return apiRequestWrapper(() => httpWrapper.post(`/api/system/role/${roleId}/authorities`, req))
}

// 菜单树
export const fetchMenuTree = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/system/menu/tree'))
}

// 菜单详情
export const fetchMenuDetails = async (menuId) => {

    return apiRequestWrapper(() => httpWrapper.get(`/api/system/menu/${menuId}`))
}

// 菜单拖动
export const menuDrag = async (dragId, targetId, position) => {
    const req = {
        dragId: dragId,
        targetId: targetId,
        position: position
    }
    return apiRequestWrapper(() => httpWrapper.post('/api/system/menu/drag', req))
}

// 创建菜单
export const createMenu = async (req) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/menu', req))
}

// 更新菜单
export const updateMenu = async (req) => {

    return apiRequestWrapper(() => httpWrapper.put('/api/system/menu', req))
}

// 删除菜单
export const deleteMenu = async (id) => {

    return apiRequestWrapper(() => httpWrapper.delete(`/api/system/menu/${id}`))
}

// 添加权限
export const addAuthority = async (req) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/authority', req))
}

// 更新权限
export const updateAuthority = async (req) => {

    return apiRequestWrapper(() => httpWrapper.put('/api/system/authority', req))
}

// 删除权限
export const deleteAuthorityById = async (id) => {

    return apiRequestWrapper(() => httpWrapper.delete(`/api/system/authority/${id}`))
}

// 更新权限api路径
export const updateAuthorityUrlsById = async (id, authorityUrls) => {
    const req = {
        id: id,
        urls: authorityUrls,
    }
    return apiRequestWrapper(() => httpWrapper.patch('/api/system/authority',req))
}

// 获取权限树
export const fetchAuthorityTree = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/authenticated/authority/options'))
}