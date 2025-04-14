import { Button, Flex } from 'antd'
import './index.css'
import { useNavigate } from 'react-router-dom';

const User = () => {

    const navigate = useNavigate()

    const toUserDetails = () => {
        // navigate('/system/user/details',{
        //     state: {
        //         id: 1
        //     }
        // })

        // navigate('/system/user/details?id=1')

        navigate('/system/user/details/1')
    }

    return (
        <Flex vertical>
            <h1>This is User</h1>
            <Button onClick={toUserDetails}>UserDetails</Button>
        </Flex>
    )
}

export default User