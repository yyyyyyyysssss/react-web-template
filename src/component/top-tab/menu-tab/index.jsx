import { useEffect, useRef } from 'react';
import './index.css'
import { Tabs } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { findRouteByHierarchy } from '../../../router/router';
import { useDispatch, useSelector } from 'react-redux';
import { addTabIems, removeTabItems, setActiveKey } from '../../../redux/slices/layoutSlice';


const TopMenuTab = () => {

    const location = useLocation()

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const activeKey = useSelector(state => state.layout.activeKey)
    const prevActiveKey = useRef(activeKey);

    const tabItems = useSelector(state => state.layout.tabItems)

    useEffect(() => {
        const pathnames = location.pathname
        const route = findRouteByHierarchy(pathnames.split('/'))
        console.log('route',route)
        if (route && route.path !== '') {
            add(pathnames, route.breadcrumbName, route.path !== 'home')
        }
    }, [location])

    useEffect(() => {
        if(prevActiveKey.current !== activeKey){
            navigate(activeKey)
        }
    },[activeKey])

    const add = (key, label, closable = true) => {
        const tabItem = {
            label: label, 
            key: key, 
            closable: closable
        }
        dispatch(addTabIems({key: key, tabItem: tabItem}))
    }
    const remove = targetKey => {
        dispatch(removeTabItems({targetKey: targetKey}))
    }

    const onChange = key => {
        dispatch(setActiveKey({key: key}))
    }

    const onEdit = (targetKey, action) => {
        if (action !== 'add') {
            remove(targetKey)
        }
    }

    return (
        <div className='layout-panel-tabs'>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={tabItems}
            />
        </div>
    )
}

export default TopMenuTab