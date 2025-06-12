import {
    DownOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Flex, Form, Input, Modal, Typography } from 'antd';
import { Lock, LogOut, UserPen } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { menuCollapsed } from '../../redux/slices/layoutSlice';
import { useAuth } from '../../router/AuthProvider';
import { logout } from '../../services/LoginService';
import { changePassword } from '../../services/UserProfileService';
import { getMessageApi } from '../../utils/MessageUtil';
import TopBreadcrumbTab from '../breadcrumb-tab';
import './index.css';


const Header = () => {

    const { signout } = useAuth()

    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const nickname = useSelector(state => state.auth.userInfo.nickname)

    const [form] = Form.useForm()

    const [changePasswordOpen, setChangePasswordOpen] = useState(false)

    const dispatch = useDispatch()

    const handleCollapsed = () => {
        dispatch(menuCollapsed())
    }

    const handleChangePassword = () => {
        form.validateFields()
            .then(
                (values) => {
                    const { originPassword, newPassword, confirmNewPassword } = values
                    if (newPassword !== confirmNewPassword) {
                        getMessageApi().warning('两次输入密码不一致')
                        return
                    }
                    const req = {
                        originPassword: originPassword,
                        newPassword: newPassword
                    }
                    changePassword(req)
                        .then(
                            () => {
                                getMessageApi().success('修改成功')
                                setChangePasswordOpen(false)
                                form.resetFields()
                            }
                        )
                }
            )
    }

    const getPasswordStrength = (password) => {
        let score = 0
        if (password.length >= 8) score++
        if (/[a-z]/.test(password)) score++
        if (/[A-Z]/.test(password)) score++
        if (/\d/.test(password)) score++
        if (/[\W_]/.test(password)) score++

        if (score <= 2) return 'weak'
        if (score === 3 || score === 4) return 'medium'
        return 'strong'
    }

    const strengthColorMap = {
        weak: { color: 'red', label: '弱' },
        medium: { color: 'orange', label: '中' },
        strong: { color: 'green', label: '强' },
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
                                    <Typography.Link onClick={() => setChangePasswordOpen(true)}>
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
                                                <span>登</span>
                                                <span>出</span>
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
                        <span>{nickname}</span> <DownOutlined className='text-xs' />
                    </Typography.Link>
                </Dropdown>
            </Flex>
            <Modal
                title='修改密码'
                width={400}
                open={changePasswordOpen}
                onOk={handleChangePassword}
                onCancel={() => {
                    setChangePasswordOpen(false)
                    form.resetFields()
                }}
                onClose={() => setChangePasswordOpen(false)}
                afterClose={() => form.resetFields()}
                okText="确认修改"
                destroyOnClose
            >
                <Form
                    style={{ marginTop: 20 }}
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                >
                    <Form.Item
                        label="原密码"
                        name="originPassword"
                        rules={[
                            {
                                required: true,
                                message: `原密码不能为空`,
                            },
                        ]}
                    >
                        <Input.Password placeholder="请输入原密码" />
                    </Form.Item>
                    <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: `新密码不能为空`,
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入新密码"
                            addonAfter={
                                password ? (
                                    <span style={{ color: strengthColorMap[strength].color, fontWeight: 500 }}>
                                        {strengthColorMap[strength].label}
                                    </span>
                                ) : null
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="确认新密码"
                        name="confirmNewPassword"
                        rules={[
                            {
                                required: true,
                                message: `确认新密码不能为空`,
                            },
                        ]}
                    >
                        <Input.Password placeholder="请输入确认新密码" />
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    )
}

export default Header