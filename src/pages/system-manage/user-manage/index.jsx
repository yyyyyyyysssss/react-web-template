import { Button, Flex } from 'antd'
import './index.css'
import { useNavigate } from 'react-router-dom';

const User = () => {

    const navigate = useNavigate()

    const toUserDetails = () => {
        navigate('/system/user/details')
    }

    return (
        <Flex vertical>
            <h1>This is User</h1>
            <Button onClick={toUserDetails}>UserDetails</Button>
        </Flex>
    )
}

export default User