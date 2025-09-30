import { Suspense, useEffect } from 'react';
import { Layout, theme } from 'antd';
import './index.css';
import { Outlet } from 'react-router-dom';
import TopMenuTab from './top-tab';
import { useSelector } from 'react-redux';
import Sider from './sider';
import Loading from '../component/loading';
import Header from './header';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useNavigate } from 'react-router-dom';
import ServerError from '../pages/ServerError';


const { Header: LayoutHeader, Content: LayoutContent, Sider: LayoutSider } = Layout;

const AppLayout = () => {


    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const themeValue = useSelector(state => state.layout.theme)

    const redirectTo = useSelector(state => state.layout.redirectTo)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo)
        }
    }, [redirectTo])

    const {
        token: {
            colorBgContainer,
            borderRadius
        }
    } = theme.useToken()

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 侧边菜单 */}
            <LayoutSider
                width='240px'
                theme={themeValue}
                collapsible
                collapsed={collapsed}
                trigger={null}
            >
                <Sider />
            </LayoutSider>
            <Layout>
                {/* 头部 */}
                <LayoutHeader className='layout-header' style={{ boxShadow: '0 4px 6px -4px rgba(0, 0, 0, 0.1)' }}>
                    <Header />
                </LayoutHeader>
                {/* 主题内容 */}
                <LayoutContent style={{ margin: '0 16px', height: 'auto', overflow: 'initial', scrollbarGutter: 'stable' }}>
                    {/* 顶部页签 */}
                    <TopMenuTab style={{ height: '45px' }} />
                    <div
                        style={{
                            height: 'calc(100vh - 109px)',
                            overflow: 'auto',
                            padding: 20,
                            borderRadius: borderRadius,
                            background: colorBgContainer
                        }}
                    >
                        <ErrorBoundary
                            fallback={<ServerError />}
                            resetKeys={[location.pathname]}
                        >
                            <Suspense fallback={<Loading />}>
                                <Outlet />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </LayoutContent>
            </Layout>
        </Layout>
    )
}

export default AppLayout