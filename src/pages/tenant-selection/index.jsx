import { Card, Flex, Typography } from 'antd'
import './index.css'
import TenantSwitch from '../../components/tenant-switch'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import { switchTenant } from '../../redux/slices/layoutSlice';
import { fetchUserTenant, switchTenantByTenantId } from '../../services/UserProfileService';

const TenantSelection = () => {

    const dispatch = useDispatch()

    const [tenantList, setTenantList] = useState([])

    useEffect(() => {
        fetchUserTenant()
            .then(
                (data) => {
                    setTenantList(data)
                }
            )
    }, [])

    // 当只有一个租户时直接跳转 无需选择
    useEffect(() => {
        if (tenantList.length === 1) {
            const tenant = tenantList[0]
            switchTenantByTenantId(tenant.id)
                .then(() => {
                    dispatch(switchTenant({ tenant: tenant }))
                    window.location.href = '/'
                })
        }
    }, [tenantList])

    if (tenantList && tenantList.length === 1) {

        return null
    }

    return (
        <Flex className="h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400" justify="center" align="center">
            <Card className="w-1/2 h-1/2 bg-white rounded-lg shadow-lg">
                <Flex className="h-full flex-col items-center justify-center space-y-4">
                    <Typography.Title level={2} className="text-gray-700">请选择租户</Typography.Title>
                    <TenantSwitch tenantList={tenantList} />
                </Flex>
            </Card>
        </Flex>
    )
}

export default TenantSelection
