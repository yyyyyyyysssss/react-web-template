import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import layoutReducer, { initialState } from './slices/layoutSlice'

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('layoutState')
        if (serializedState === null) {
            return null
        }
        const layoutState = JSON.parse(serializedState)
        if (layoutState && layoutState.menuCollapsed === true) {
            layoutState.openKeys = []
        }
        return layoutState
    } catch (e) {
        return null
    }
}

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state.layout)
        localStorage.setItem('layoutState', serializedState)
    } catch (e) {
        console.log(e)
    }
}

const loadedState = loadState();
const reduxStore = configureStore({
    preloadedState: {
        layout: loadedState === null ? initialState : { ...loadedState, menuItems: [] }
    },
    reducer: {
        auth: authReducer,
        layout: layoutReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

reduxStore.subscribe(() => {
    saveState(reduxStore.getState())
})

export default reduxStore