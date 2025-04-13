import { Flex } from "antd"
import { useEffect, useMemo, useRef } from "react"
import './index.css'
import { useDispatch, useSelector } from 'react-redux';
import { removeAllTabItem, removeLeftTabItem, removeOtherTabItem, removeRightTabItem } from "../../../redux/slices/layoutSlice";


const TabRightClickMenu = ({ tabKey, index, x, y, close }) => {

    const dispatch = useDispatch()

    const tabItems = useSelector(state => state.layout.tabItems)

    const tabSize = useMemo(() => {
        return tabItems.length - 1
    }, [tabItems])

    const menuRef = useRef()


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                close()
            }
        }
        // 绑定事件监听器
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // 组件卸载时移除事件监听器
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    const closeOther = () => {
        close()
        dispatch(removeOtherTabItem({ key: tabKey, index: index }))
    }

    const closeAll = () => {
        close()
        dispatch(removeAllTabItem())
    }

    const closeRight = () => {
        close()
        dispatch(removeRightTabItem({ key: tabKey, index: index }))
    }

    const closeLeft = () => {
        close()
        dispatch(removeLeftTabItem({ key: tabKey, index: index }))
    }

    return (
        <Flex
            ref={menuRef}
            align='center'
            style={{
                position: 'fixed',
                top: y,
                left: x,
                zIndex: 1000,
                borderRadius: 6,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            vertical
        >
            <Flex
                gap={6}
                flex={1}
                vertical
            >
                <div className='menu-btn' onClick={closeOther}>关闭其它</div>
                <div className='menu-btn' onClick={closeAll}>关闭所有</div>
                {index === tabSize && (
                    <div className='menu-btn' onClick={closeLeft}>关闭左侧</div>
                )}
                {index === 0 && (
                    <div className='menu-btn' onClick={closeRight}>关闭右侧</div>
                )}
                {index > 0 && index < tabSize && (
                    <>
                        <div className='menu-btn' onClick={closeLeft}>关闭左侧</div>
                        <div className='menu-btn' onClick={closeRight}>关闭右侧</div>
                    </>
                )}

            </Flex>
        </Flex>
    )
}

export default TabRightClickMenu