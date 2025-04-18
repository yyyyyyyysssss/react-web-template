import './index.css'
import React, { useEffect, useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { findRouteByPath } from '../../../router/router';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveKey, setOpenKeys } from '../../../redux/slices/layoutSlice';

const TopBreadcrumbTab = ({ style }) => {

    const location = useLocation()

    const dispatch = useDispatch()

    useEffect(() => {
        if(location.pathname){
            dispatch(setActiveKey({key : location.pathname}))
        }
    },[])

    const breadcrumbItems = useMemo(() => {
        const pathnames = location.pathname.split('/').filter(item => item !== '')
        let path = ''
        return pathnames.map((value, index) => {
            path += `/${value}`
            const route = findRouteByPath(path)
            if(route){
                return (
                    <Breadcrumb.Item key={path}>
                        <Link to={path}>{route.breadcrumbName}</Link>
                    </Breadcrumb.Item>
                )
            }
        })
    }, [location.pathname])

    return <Breadcrumb style={style}>{breadcrumbItems}</Breadcrumb>;

}

export default TopBreadcrumbTab
