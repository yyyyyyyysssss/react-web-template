import { apiRequestWrapper } from "./ApiRequestWrapper"
import httpWrapper from "./AxiosWrapper"

// 用户列表
export const fetchUserList = async (queryParam) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/user/query', queryParam, { meta: { critical: true } }))
}

// 用户详情
export const fetchUserDetails = async (userId) => {

    return apiRequestWrapper(() => httpWrapper.get(`/api/system/user/${userId}`))
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

// 用户搜索
export const fetchSearchUser = async (keyword, pageNum, pageSize) => {
    const searchUserReq = {
        pageNum: pageNum,
        pageSize: pageSize
    }
    if (Array.isArray(keyword)) {
        searchUserReq.ids = keyword
    } else {
        searchUserReq.keyword = keyword
    }
    return apiRequestWrapper(() => httpWrapper.post('/api/system/user/search', searchUserReq))
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

// 用户选择
export const fetchUserOptions = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/authenticated/user/options'))
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

// 角色详情
export const fetchRoleDetails = async (roleId) => {

    return apiRequestWrapper(() => httpWrapper.get(`/api/system/role/${roleId}`))
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
    return apiRequestWrapper(() => httpWrapper.patch('/api/system/authority', req))
}

// 获取权限树
export const fetchAuthorityTree = async () => {

    return apiRequestWrapper(() => httpWrapper.get('/api/authenticated/authority/options'))
}



// 租户列表
export const fetchTenantList = async (queryParam) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/system/tenant/query', queryParam, { meta: { critical: true } }))
}


// 新增租户
export const createTenant = async (tenant) => {

    return apiRequestWrapper(() => httpWrapper.post(`/api/system/tenant`, tenant))
}

// 修改租户
export const updateTenant = async (tenant) => {

    return apiRequestWrapper(() => httpWrapper.patch(`/api/system/tenant/${tenant.id}`, tenant))
}

// 租户绑定用户
export const bindTenantUser = async (id, userIds) => {
    const req = {
        userIds: userIds
    }
    return apiRequestWrapper(() => httpWrapper.post(`/api/system/tenant/${id}/users`, req))
}

// 修改租户状态
export const updateTenantStatus = async (tenantId, status) => {

    return apiRequestWrapper(() => httpWrapper.patch(`/api/system/tenant/${tenantId}`, { status: status }))
}

// 删除租户
export const deleteTenantById = async (tenantId) => {

    return apiRequestWrapper(() => httpWrapper.delete(`/api/system/tenant/${tenantId}`))
}

// 根据租户id获取关联的用户id
export const fetchUserIdByTenantId = async (tenantId) => {

    return apiRequestWrapper(() => httpWrapper.get(`/api/system/tenant/${tenantId}/userId`))
}

// 获取字典
export const fetchDictByCode = async (code, category = '') => {

    return apiRequestWrapper(() => httpWrapper.get(`/api/options/dict?code=${code}&category=${category}`))
}