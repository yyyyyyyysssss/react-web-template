import { Card, Flex, Typography } from 'antd'
import './index.css'
import TenantSwitch from '../../components/tenant-switch'

const TenantSelection = () => {

    return (
        <Flex className="h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400" justify="center" align="center">
            <Card className="w-1/2 h-1/2 bg-white rounded-lg shadow-lg">
                <Flex className="h-full flex-col items-center justify-center space-y-4">
                    <Typography.Title level={2} className="text-gray-700">请选择租户</Typography.Title>
                    <TenantSwitch />
                </Flex>
            </Card>
        </Flex>
    )
}

export default TenantSelection
