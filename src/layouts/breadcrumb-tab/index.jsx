import './index.css'
import { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { findRouteByPath } from '../../router/router';

const TopBreadcrumbTab = () => {

    const location = useLocation()

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

    return <Breadcrumb items={breadcrumbItems}/>
}

export default TopBreadcrumbTab
