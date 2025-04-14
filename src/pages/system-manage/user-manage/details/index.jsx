import React from 'react';
import './index.css'
import { useLocation, useParams } from 'react-router-dom';
import useQueryParams from '../../../../hooks/useQueryParams';

const UserDetails = () => {

    const { id } = useParams()

    // const location  = useLocation()

    // const { id } = location.state || {}

    // const { id } = useQueryParams()

    return (
        <h1>This is UserDetails {id}</h1>
    )
}

export default UserDetails