import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    activeKey: '',
    menuCollapsed: false,
    openKeys: [],
    tabItems: [],
    menuItems: []
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
            if (!state.menuCollapsed) {
                state.openKeys = state.activeKey.split('/')
            }
        },
        addTabIem: (state, action) => {
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
        removeTabItem: (state, action) => {
            const { payload } = action
            const { targetKey, selectKey } = payload
            const newPanes = state.tabItems.filter(pane => pane.key !== targetKey)
            if (selectKey) {
                state.activeKey = selectKey
                state.openKeys = state.menuCollapsed ? [] : selectKey.split('/')
            }
            state.tabItems = newPanes
        },
        removeAllTabItem: (state, action) => {
            const newItems = state.tabItems.filter(item => item.closable === false)
            if (newItems.length) {
                const key = newItems[0].key
                state.activeKey = key
                state.openKeys = state.menuCollapsed ? [] : key.split('/')
            }
            state.tabItems = newItems
        },
        removeOtherTabItem: (state, action) => {
            const { payload } = action
            const { key, index } = payload
            const newItems = state.tabItems.filter((item, i) => item.closable === false || i === index)
            if (newItems.length) {
                state.activeKey = key
                state.openKeys = state.menuCollapsed ? [] : key.split('/')
            }
            state.tabItems = newItems
        },
        removeLeftTabItem: (state, action) => {
            const { payload } = action
            const { key, index } = payload
            const newItems = state.tabItems.filter((item, i) => i >= index || item.closable === false)
            if (newItems.length) {
                state.activeKey = key
                state.openKeys = state.menuCollapsed ? [] : key.split('/')
            }
            state.tabItems = newItems
        },
        removeRightTabItem: (state, action) => {
            const { payload } = action
            const { key, index } = payload
            const newItems = state.tabItems.filter((item, i) => i <= index || item.closable === false)
            if (newItems.length) {
                state.activeKey = key
                state.openKeys = state.menuCollapsed ? [] : key.split('/')
            }
            state.tabItems = newItems
        },
        loadMenuItems: (state, action) => {
            const { payload } = action
            const { menuItems } = payload
            state.menuItems = menuItems
        }
    }
})

export const { reset, setActiveKey, menuCollapsed, setOpenKeys, addTabIem, removeTabItem, removeAllTabItem, removeOtherTabItem, removeLeftTabItem, removeRightTabItem, loadMenuItems } = layoutSlice.actions

export default layoutSlice.reducer