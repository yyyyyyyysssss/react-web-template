import './index.css'
import { Button, Dropdown, Flex, Typography } from 'antd'
import {
    DownOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { menuCollapsed } from '../../redux/slices/layoutSlice';
import TopBreadcrumbTab from '../breadcrumb-tab';
import { LogOut, Lock, UserPen } from 'lucide-react';
import { logout } from '../../services/LoginService';
import { useAuth } from '../../router/AuthProvider';


const Header = () => {

    const { signout } = useAuth()

    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const dispatch = useDispatch()

    const handleCollapsed = () => {
        dispatch(menuCollapsed())
    }

    const handleLogout = () => {
        logout()
            .then(
                () => {
                    signout()
                }
            )
    }

    return (
        <Flex justify="space-between" style={{ height: '100%' }}>
            <Flex
                align='center'
            >
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={handleCollapsed}
                    style={{
                        fontSize: '16px',
                        width: 48,
                        height: 48,
                    }}
                />
                {/* 面包屑 */}
                <TopBreadcrumbTab />
            </Flex>
            <Flex
                style={{ paddingRight: 10 }}
                align='center'
            >
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'profile',
                                label: (
                                    <Typography.Link>
                                        <Flex
                                            gap={8}
                                            align='center'
                                        >
                                            <UserPen size={16} />
                                            <span>个人信息</span>
                                        </Flex>

                                    </Typography.Link>
                                )
                            },
                            {
                                key: 'change_password',
                                label: (
                                    <Typography.Link>
                                        <Flex
                                            gap={8}
                                            align='center'
                                        >
                                            <Lock size={16} />
                                            <span>修改密码</span>
                                        </Flex>

                                    </Typography.Link>
                                )
                            },
                            {
                                key: 'logout',
                                label: (
                                    <Typography.Link onClick={handleLogout}>
                                        <Flex
                                            gap={8}
                                            align='center'
                                        >
                                            <LogOut size={16} />
                                            <Flex
                                                justify='space-between'
                                                flex={1}
                                            >
                                                <span>注</span>
                                                <span>销</span>
                                            </Flex>
                                        </Flex>
                                    </Typography.Link>
                                )
                            }
                        ]
                    }}
                    trigger={['click']}
                >
                    <Typography.Link>
                        <span className='text-lg'>admin</span> <DownOutlined className='text-xs' />
                    </Typography.Link>
                </Dropdown>
            </Flex>
        </Flex>
    )
}

export default Header