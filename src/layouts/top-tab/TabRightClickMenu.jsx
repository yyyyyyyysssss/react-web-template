import { Flex, theme } from "antd"
import { useCallback, useEffect, useMemo, useRef } from "react"
import './index.css'
import { useDispatch, useSelector } from 'react-redux';
import { removeAllTabItem, removeLeftTabItem, removeOtherTabItem, removeRightTabItem } from "../../redux/slices/layoutSlice";
import { useTranslation } from 'react-i18next';


const TabRightClickMenu = ({ tabKey, index, x, y, close }) => {

    const dispatch = useDispatch()

    const { t } = useTranslation()

    const { token } = theme.useToken()
    const { borderRadius, colorBgContainer, colorBorder,boxShadow } = token

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
        // eslint-disable-next-line
    }, [])

    const closeOther = () => {
        dispatch(removeOtherTabItem({ key: tabKey, index: index }))
        close(tabKey)
    }

    const closeAll = () => {
        dispatch(removeAllTabItem())
        const selectKey = afterCloseAllSelectKey()
        close(selectKey)
    }

    const afterCloseAllSelectKey = useCallback(() => {
        if (tabSize > 0) {
            return tabItems[0].key
        }
        return null
    }, [tabItems, tabSize])

    const closeRight = () => {
        dispatch(removeRightTabItem({ key: tabKey, index: index }))
        close(tabKey)
    }

    const closeLeft = () => {
        dispatch(removeLeftTabItem({ key: tabKey, index: index }))
        close(tabKey)
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
                borderRadius: borderRadius,
                backgroundColor: colorBgContainer,
                border: colorBorder,
                boxShadow: boxShadow,
                padding: '8px 0',
            }}
            vertical
        >
            <Flex
                gap={6}
                flex={1}
                vertical
            >
                {tabSize !== 0 && (
                    <div style={{borderRadius: borderRadius}} className='menu-btn' onClick={closeOther}>{t('关闭其它')}</div>
                )}
                <div style={{borderRadius: borderRadius}} className='menu-btn' onClick={closeAll}>{t('关闭所有')}</div>
                {index === tabSize && tabSize !== 0 && (
                    <div style={{borderRadius: borderRadius}} className='menu-btn' onClick={closeLeft}>{t('关闭左侧')}</div>
                )}
                {index === 0 && tabSize !== 0 && (
                    <div style={{borderRadius: borderRadius}} className='menu-btn' onClick={closeRight}>{t('关闭右侧')}</div>
                )}
                {index > 0 && index < tabSize && (
                    <>
                        <div style={{borderRadius: borderRadius}} className='menu-btn' onClick={closeLeft}>{t('关闭左侧')}</div>
                        <div style={{borderRadius: borderRadius}} className='menu-btn' onClick={closeRight}>{t('关闭右侧')}</div>
                    </>
                )}

            </Flex>
        </Flex>
    )
}

export default TabRightClickMenu