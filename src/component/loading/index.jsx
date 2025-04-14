import { Flex, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import './index.css'

const Loading = () => {

    return (
        <Flex
            flex={1}
            justify='center'
            align='center'
            style={{
                height: '100%',
            }}
        >
            <Spin size="large"/>
        </Flex>
    )
}

export default Loading