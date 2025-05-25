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
            if(index === pathnames.length - 1 && location.search){
                path += location.search
            }
            return {
                key: path,
                title: route?.element ? <Link to={path} state={location.state}>{route?.breadcrumbName}</Link> : route?.breadcrumbName,
            }
        })
    }, [location])

    return <Breadcrumb items={breadcrumbItems}/>
}

export default TopBreadcrumbTab
