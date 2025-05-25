import { Button, Flex } from 'antd'
import './index.css'
import { useNavigate } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';


const UserManage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        // NProgress.start()
        // setTimeout(() => {
        //     NProgress.done();
        // }, 2000);
        // return () => {
        //     NProgress.done();
        // }
    }, [])

    const toUserDetails = () => {
        // navigate('/system/user/details',{
        //     state: {
        //         id: 1
        //     }
        // })

        navigate('/system/user/details?id=1')

        // navigate('/system/user/details')
    }

    return (
        <Flex vertical>
            <h1>This is User</h1>
            <Button onClick={toUserDetails}>UserDetails</Button>
        </Flex>
    )
}

export default UserManage