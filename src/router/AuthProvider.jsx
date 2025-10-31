import { Spin } from 'antd';
import { createContext, useContext, useEffect, useState } from 'react';
import { checkTokenValid, clearToken, saveToken } from '../services/LoginService';
import { setGlobalSignout } from './auth';
import reduxStore from '../redux/store';
import { loadMenuItems, reset } from '../redux/slices/layoutSlice';
import { fetchUserInfo } from '../services/UserProfileService';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../redux/slices/authSlice';
import Loading from '../components/loading';

const AuthContext = createContext({
    isLoginIn: null,
    setIsLoginIn: () => { },
    signin: async (tokenInfo) => { },
    signout: async () => { }
})

export const AuthProvider = ({ children }) => {

    const [isLoginIn, setIsLoginIn] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        const check = async () => {
            const isValid = await checkTokenValid()
            if (isValid) {
                signin()
            } else {
                signout()
            }
        }
        check()
        setGlobalSignout(signout)
    }, [])

    const signin = async (tokenInfo) => {
        if (tokenInfo) {
            saveToken(tokenInfo)
        }
        fetchUserInfo()
            .then(
                (userInfo) => {
                    dispatch(setUserInfo({userInfo: userInfo}))
                    dispatch(loadMenuItems({menuItems: userInfo.menuTree}))
                    setIsLoginIn(true)
                }
            )

    }

    const signout = async () => {
        setIsLoginIn(false)
        clearToken()
        reduxStore.dispatch(reset())
    }

    if (isLoginIn === null) {
        return <Loading fullscreen />
    }

    return (
        <AuthContext.Provider value={{ isLoginIn, setIsLoginIn, signin, signout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)