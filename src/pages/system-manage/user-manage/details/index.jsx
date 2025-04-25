import React from 'react';
import './index.css'
import useStateParams from '../../../../hooks/useStateParams';
import { Button, Flex } from 'antd';
import useBack from '../../../../hooks/useBack';

const UserDetails = () => {

    const { id } = useStateParams()

    const { goBack } = useBack()

    const handleClose = () => {
        goBack()
    }

    return (
        <Flex vertical>
            <h1>This is UserDetails {id}</h1>
            <Button onClick={handleClose}>close</Button>
        </Flex>

    )
}

export default UserDetails