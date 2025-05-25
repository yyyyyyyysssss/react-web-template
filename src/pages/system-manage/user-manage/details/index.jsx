import React from 'react';
import './index.css'
import { Button, Flex } from 'antd';
import useBack from '../../../../hooks/useBack';
import useQueryParams from '../../../../hooks/useQueryParams';
// import useStateParams from '../../../../hooks/useStateParams';
// import { useParams } from 'react-router-dom';

const UserDetails = () => {

    // const { id } = useStateParams()

     const {id} = useQueryParams()

    //  const { id } =  useParams()

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