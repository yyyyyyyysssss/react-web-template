import React from 'react';
import './index.css'
import { useParams } from 'react-router-dom';
import useQueryParams from '../../../../hooks/useQueryParams';
import useStateParams from '../../../../hooks/useStateParams';

const UserDetails = () => {

    // const { id } = useParams()

    const { id } = useStateParams()

    // const { id } = useQueryParams()

    return (
        <h1>This is UserDetails {id}</h1>
    )
}

export default UserDetails