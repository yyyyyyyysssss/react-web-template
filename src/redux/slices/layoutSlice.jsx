import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    activeKey: '',
    menuCollapsed: false,
    openKeys: [],
    tabItems: []
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState: initialState,
    reducers: {
        reset: () => initialState,
        setOpenKeys: (state, action) => {
            const { payload } = action
            const { keys } = payload
            state.openKeys = keys
        },
        setActiveKey: (state, action) => {
            const { payload } = action
            const { key } = payload
            state.activeKey = key
            state.openKeys = state.menuCollapsed ? [] : key.split('/')
        },
        menuCollapsed: (state, action) => {
            state.menuCollapsed = !state.menuCollapsed
            if(!state.menuCollapsed){
                state.openKeys = state.activeKey.split('/')
            }
        },
        addTabIems: (state, action) => {
            const { payload } = action
            const { key, tabItem } = payload
            const item = state.tabItems.find(item => item.key === key)
            if (item) {
                state.activeKey = item.key
                return
            }
            state.tabItems.push(tabItem)
            state.activeKey = key
            state.openKeys = state.menuCollapsed ? [] : key.split('/')
        },
        removeTabItems: (state, action) => {
            const { payload } = action
            const { targetKey } = payload
            const targetIndex = state.tabItems.findIndex(pane => pane.key === targetKey)
            const newPanes = state.tabItems.filter(pane => pane.key !== targetKey);
            if (newPanes.length && targetKey === state.activeKey) {
                const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                state.activeKey = key
                state.openKeys = state.menuCollapsed ? [] : key.split('/')
            }
            state.tabItems = newPanes
        }
    }
})

export const { reset, setActiveKey, menuCollapsed, setOpenKeys, addTabIems, removeTabItems } = layoutSlice.actions

export default layoutSlice.reducer