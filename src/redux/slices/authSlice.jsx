import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    userInfo: null,
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
    }
})

export const { reset, setUserInfo} = authSlice.actions

export default authSlice.reducer