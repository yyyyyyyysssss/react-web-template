import './index.css'
import React, { useEffect, useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { findRouteByPath } from '../../router/router';
import { useDispatch } from 'react-redux';
import { setActiveKey } from '../../redux/slices/layoutSlice';

const TopBreadcrumbTab = ({ style }) => {

    const location = useLocation()

    const dispatch = useDispatch()

    useEffect(() => {
        if (location.pathname) {
            dispatch(setActiveKey({ key: location.pathname }))
        }
        // eslint-disable-next-line
    }, [])

    const breadcrumbItems = useMemo(() => {
        const pathnames = location.pathname.split('/').filter(item => item !== '')
        let path = ''
        return pathnames.map((value, index) => {
            path += `/${value}`
            const route = findRouteByPath(path)
            return {
                key: path,
                title: route.element ? <Link to={path}>{route.breadcrumbName}</Link> : route.breadcrumbName,
            }
        })
    }, [location.pathname])

    return <Breadcrumb style={style} items={breadcrumbItems}/>
}

export default TopBreadcrumbTab
