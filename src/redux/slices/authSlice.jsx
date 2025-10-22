import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    userInfo: null,
    tenant: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        reset: () => initialState,
        setUserInfo: (state, action) => {
            const { payload } = action
            const { userInfo } = payload
            state.userInfo = userInfo
        },
        updateUserAvatar: (state, action) => {
            const { payload } = action
            const { newAvatar } = payload
            state.userInfo.avatar = newAvatar
        },
        switchTenant: (state, action) => {
            const { payload } = action
            const { tenantId } = payload
            const tenant = state.userInfo.tenants.find(f => f.id === tenantId)
            state.tenant = tenant
        }
    }
})

export const { reset, setUserInfo, updateUserAvatar, switchTenant } = authSlice.actions

export default authSlice.reducer