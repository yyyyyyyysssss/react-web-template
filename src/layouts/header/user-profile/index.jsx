import { useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../router/AuthProvider';
import { Avatar, Button, Divider, Drawer, Dropdown, Flex, Form, Image, Input, Modal, Tooltip, Typography, Upload } from 'antd';
import { Lock, LogOut, Pencil, UserPen, Building } from 'lucide-react';
import { logout } from '../../../services/LoginService';
import { useDispatch, useSelector } from 'react-redux';
import { changeAvatar, changePassword } from '../../../services/UserProfileService';
import { getMessageApi } from '../../../utils/MessageUtil';
import ChunkedUpload from '../../../component/ChunkedUpload';
import { updateUserAvatar } from '../../../redux/slices/authSlice';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { simpleUploadFile } from '../../../services/FileService';
import { useRequest } from 'ahooks';
import RemoteSearchSelect from '../../../component/RemoteSearchSelect';
import { fetchSearchUser } from '../../../services/SystemService';
import './index.css'
import TenantSwitch from '../../../component/tenant-switch';

const UserProfile = () => {

    const { signout } = useAuth()

    const { nickname, avatar } = useSelector(state => state.auth.userInfo)


    const [profileForm] = Form.useForm()

    const { runAsync: simpleUploadFileAsync, loading: simpleUploadFileLoading } = useRequest(simpleUploadFile, {
        manual: true
    })

    const { runAsync: changeAvatarAsync, loading: changeAvatarLoading } = useRequest(changeAvatar, {
        manual: true
    })

    const [avatarPreviewVisible, setAvatarPreviewVisible] = useState(false)

    const [crop, setCrop] = useState()

    const imgRef = useRef(null)
    const [completedCrop, setCompletedCrop] = useState()

    const [avatarCropOpen, setAvatarCropOpen] = useState({
        open: false,
        previewImage: null
    })

    const dispatch = useDispatch()

    const [form] = Form.useForm()

    const [password, setPassword] = useState('')

    const [changePasswordOpen, setChangePasswordOpen] = useState(false)

    const [profileOpen, setProfileOpen] = useState(false)

    const [tenantSwitchOpen, setTenantSwitchOpen] = useState(false)

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
                                handleClose()
                            }
                        )
                }
            )
    }

    const handleClose = () => {
        setChangePasswordOpen(false)
        form.resetFields()
        setPassword('')
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

    const strength = useMemo(() => getPasswordStrength(password), [password])

    const strengthColorMap = {
        weak: { color: 'red', label: '弱' },
        medium: { color: 'orange', label: '中' },
        strong: { color: 'green', label: '强' },
    }


    const handleUploadAvatarSuccess = (accessUrl) => {
        changeAvatarAsync(accessUrl)
            .then(() => {
                dispatch(updateUserAvatar({ newAvatar: accessUrl }))
                handleAvatarCropClose()
                getMessageApi().success('修改成功')
            })
    }

    const handleBeforeUpload = (file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            handleAvatarCropOpen(reader.result)  // 设置文件预览
        }
        reader.readAsDataURL(file)
        return false
    }

    const handleAvatarCropOpen = (previewImage) => {
        setAvatarCropOpen({
            open: true,
            previewImage: previewImage
        })
    }

    const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 100
                },
                aspect,
                mediaWidth,
                mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
        )
    }

    const handleImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    }

    const handleSetNewAvatar = async () => {
        const image = imgRef.current
        if (!image || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }
        // 确保图片已加载完成
        if (!image.complete || image.naturalWidth === 0) {
            // 如果图片未加载完成，添加加载完成的处理逻辑
            await new Promise((resolve, reject) => {
                image.onload = () => resolve();
                image.onerror = (error) => reject(error);
            });
        }
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const offscreen = new OffscreenCanvas(
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
        )
        const ctx = offscreen.getContext('2d')
        if (!ctx) {
            throw new Error('No 2d context')
        }
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
        )
        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        })

        const file = new File([blob], 'newCropaAvatar.png', { type: 'image/png' })
        const formData = new FormData()
        formData.append('file', file)
        simpleUploadFileAsync(formData)
            .then(
                (accessUrl) => {
                    handleUploadAvatarSuccess(accessUrl)
                }
            )

    }

    const handleAvatarCropClose = () => {
        setAvatarCropOpen({
            open: false,
            previewImage: null
        })
        setCrop(null)
        setCompletedCrop(null)
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
        <>
            <Dropdown
                menu={{
                    items: [
                        {
                            key: 'switch_tenant',
                            label: (
                                <Typography.Link onClick={() => setTenantSwitchOpen(true)}>
                                    <Flex
                                        gap={8}
                                        align='center'
                                    >
                                        <Building size={16} />
                                        <span>切换租户</span>
                                    </Flex>
                                </Typography.Link>
                            )
                        },
                        {
                            key: 'profile',
                            label: (
                                <Typography.Link onClick={() => setProfileOpen(true)}>
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
                                            <span>退</span>
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
                <Flex
                    gap={5}
                    justify='center'
                    align='center'
                    style={{
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: 'var(--ant-border-radius)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--ant-control-item-bg-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <Avatar src={avatar} />
                    <Typography.Text type='secondary'>
                        {nickname}
                    </Typography.Text>
                </Flex>
            </Dropdown>
            <Modal
                title='修改密码'
                width={400}
                open={changePasswordOpen}
                onOk={handleChangePassword}
                onCancel={handleClose}
                onClose={handleClose}
                okText="确认修改"
                destroyOnHidden
            >
                <Form
                    style={{ marginTop: 20 }}
                    form={form}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
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
                        validateTrigger='onBlur'
                        rules={[
                            {
                                required: true,
                                message: `新密码不能为空`,
                            },
                            {
                                min: 6,
                                message: '密码长度不能少于6位',
                            }
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入新密码"
                            onChange={(e) => {
                                const value = e.target.value
                                setPassword(value)
                            }}
                        />
                    </Form.Item>
                    {password && (
                        <div style={{ marginLeft: '30%', marginTop: -12, marginBottom: 12 }}>
                            <span style={{ color: strengthColorMap[strength].color, fontWeight: 500 }}>
                                密码强度：{strengthColorMap[strength].label}
                            </span>
                        </div>
                    )}
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
            <Drawer
                title='个人信息'
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => setProfileOpen(false)}
                open={profileOpen}
                width={400}
                destroyOnHidden
            >
                <Flex
                    vertical
                    gap={50}
                    style={{ height: '100%' }}
                >
                    <Flex
                        justify='center'
                        align='center'
                        gap={6}
                    >
                        <div style={{ position: 'relative' }}>
                            <Avatar
                                size={100}
                                src={avatar}
                                style={{
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setAvatarPreviewVisible(true)
                                }}
                            />
                            <Image
                                preview={{
                                    visible: avatarPreviewVisible,
                                    src: avatar,
                                    onVisibleChange: (visible) => {
                                        setAvatarPreviewVisible(visible)
                                    }
                                }}

                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: -8,
                                    left: 0,
                                }}
                            >
                                <ChunkedUpload
                                    showUploadList={false}
                                    maxCount={1}
                                    accept='image/*'
                                    beforeUpload={handleBeforeUpload}
                                >
                                    <Button icon={<Pencil size={18} />} />
                                </ChunkedUpload>
                            </div>
                        </div>
                    </Flex>
                    <Flex
                        justify='center'
                    >
                        <Form
                            layout='vertical'
                            form={profileForm}
                            initialValues={{
                                userIds: ['1', '2', '3']
                            }}
                        >
                            <Form.Item
                                label=""
                                name="userIds"
                            >
                                <RemoteSearchSelect
                                    mode='multiple'
                                    fetchData={fetchSearchUser}
                                    labelField='nickname'
                                    valueField='id'
                                    placeholder='请输入用户名称'
                                    allowClear

                                />
                            </Form.Item>
                        </Form>
                    </Flex>
                </Flex>
            </Drawer>
            <Modal
                title={
                    <Flex justify='center' align='center' vertical>
                        <Flex style={{ width: '100%' }} align='start'>
                            <span>裁剪你的新头像</span>
                        </Flex>
                        <Divider style={{ width: '450px', marginBottom: '6px', marginTop: '8px' }} />
                    </Flex>
                }
                open={avatarCropOpen.open}
                onCancel={handleAvatarCropClose}
                onClose={handleAvatarCropClose}
                width={450}
                maskClosable={false}
                destroyOnHidden={true}
                footer={
                    <Flex justify='center' align='center' vertical>
                        <Divider style={{ width: '450px', marginBottom: '8px', marginTop: '8px' }} />
                        <Button
                            type="primary"
                            loading={simpleUploadFileLoading || changeAvatarLoading}
                            onClick={handleSetNewAvatar}
                            style={{ width: '100%' }}
                        >
                            设置新的头像
                        </Button>
                    </Flex>
                }
            >
                <ReactCrop
                    crop={crop}
                    aspect={1}
                    minHeight={64}
                    circularCrop={true}
                    onChange={c => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                >
                    <img ref={imgRef} src={avatarCropOpen.previewImage} onLoad={handleImageLoad} />
                </ReactCrop>
            </Modal>
            <Modal
                title='切换租户'
                width={600}
                open={tenantSwitchOpen}
                onCancel={() => setTenantSwitchOpen(false)}
                onClose={() => setTenantSwitchOpen(false)}
                footer={null}
                style={{ textAlign: 'center' }}
                maskClosable={false}
                keyboard={false}
            >
                <Flex className='w-full h-[200px]'>
                    <TenantSwitch
                        onTenantChange={() => setTenantSwitchOpen(false)}
                    />
                </Flex>
            </Modal>
        </>
    )
}

export default UserProfile