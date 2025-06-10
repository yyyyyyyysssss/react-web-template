import { Spin } from 'antd';
import { createContext, useContext, useEffect, useState } from 'react';
import { checkTokenValid, clearToken, saveToken } from '../services/LoginService';
import { setGlobalSignout } from './auth';
import reduxStore from '../redux/store';
import { reset } from '../redux/slices/layoutSlice';

const AuthContext = createContext({
    isLoginIn: null,
    setIsLoginIn: () => { },
    signin: async (tokenInfo) => { },
    signout: async () => { }
})

export const AuthProvider = ({ children }) => {

    const [isLoginIn, setIsLoginIn] = useState(null)

    useEffect(() => {
        const check = async () => {
            const isValid = await checkTokenValid()
            setIsLoginIn(isValid)
        }
        check()
        setGlobalSignout(signout)
    }, [])

    const signin = async (tokenInfo) => {
        saveToken(tokenInfo)
        setIsLoginIn(true)
    }

    const signout = async () => {
        setIsLoginIn(false)
        clearToken()
        reduxStore.dispatch(reset())
    }

    if (isLoginIn === null) {
        return <Spin fullscreen />
    }

    return (
        <AuthContext.Provider value={{ isLoginIn, setIsLoginIn, signin, signout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)