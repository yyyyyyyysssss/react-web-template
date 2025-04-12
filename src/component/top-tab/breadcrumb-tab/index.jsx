import './index.css'
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { findRouteByPath } from '../../../router/router';

const TopBreadcrumbTab = ({style}) => {

    const location = useLocation()

    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbItems = pathnames.map((value, index) => {
        const route = findRouteByPath(value)
        // 构造面包屑的路径
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={to}>
                <Link to={to}>{route.breadcrumbName}</Link>
            </Breadcrumb.Item>
        )
    });
    return <Breadcrumb style={style}>{breadcrumbItems}</Breadcrumb>;

}

export default TopBreadcrumbTab
