import { configureStore  } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import layoutReducer from './slices/layoutSlice'

const loadState = () => {
    try{
        const serializedState = localStorage.getItem('layoutState')
        if(serializedState === null){
            return undefined
        }
        const layoutState = JSON.parse(serializedState)
        if(layoutState && layoutState.menuCollapsed === true){
            layoutState.openKeys = []
        }
        return layoutState
    }catch(e){
        return undefined
    }
}

const saveState = (state) => {
    try{
        const serializedState = JSON.stringify(state.layout)
        localStorage.setItem('layoutState',serializedState)
    }catch(e){
        console.log(e)
    }
}

const reduxStore = configureStore({
    preloadedState: {
        layout: {
            ...loadState(),
            menuItems: []
        }
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