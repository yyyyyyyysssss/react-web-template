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



const handleError = (error) => {
    // 这里可以加入更多的错误处理逻辑，比如发送错误日志、显示错误信息等
}