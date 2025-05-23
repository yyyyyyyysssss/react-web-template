import './index.css'
import { Button, Flex } from 'antd'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { menuCollapsed } from '../../redux/slices/layoutSlice';
import TopBreadcrumbTab from '../breadcrumb-tab';


const Header = () => {

    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const dispatch = useDispatch()

    const handleCollapsed = () => {
        dispatch(menuCollapsed())
    }

    return (
        <Flex style={{ height: '100%' }} align='center'>
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
            <TopBreadcrumbTab/>
        </Flex>
    )
}

export default Header