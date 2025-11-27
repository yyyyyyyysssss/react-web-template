import './index.css'
import { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { findRouteByPath } from '../../router/router';
import { useTranslation } from 'react-i18next';

const TopBreadcrumbTab = () => {

    const location = useLocation()

    const { t } = useTranslation()

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
                title: route?.element ? <Link to={path} state={location.state}>{t(route?.breadcrumbName)}</Link> : t(route?.breadcrumbName),
            }
        })
    }, [location,t])

    return <Breadcrumb items={breadcrumbItems}/>
}

export default TopBreadcrumbTab
