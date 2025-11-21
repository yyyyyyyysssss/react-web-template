import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, Empty, message } from 'antd';
import { useSelector } from 'react-redux';
import 'antd/dist/reset.css';
import zhCN from 'antd/es/locale/zh_CN';
import NProgress from 'nprogress';
import { setMessageApi } from './utils/MessageUtil.jsx';
import { AuthProvider } from './router/AuthProvider.jsx';

NProgress.configure({
  showSpinner: false
})

const defaultColorPrimary = '#1DA57A'

const App = () => {

  const [api, contextHolder] = message.useMessage()

  const [colorPrimary, setColorPrimary] = useState(defaultColorPrimary)

  const themeValue = useSelector(state => state.layout.theme)

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', defaultColorPrimary)
  }, [colorPrimary])

  const themeConfig = useMemo(() => ({
    dark: {
      cssVar: true,
      token: {
        colorText: 'rgba(255, 255, 255, 0.88)', // 白色文本
        colorIcon: 'rgba(255, 255, 255, 0.45)', // 图标
        colorSplit: 'rgba(255, 255, 255, 0.06)', // 较浅的分割线颜色
        colorTextDescription: 'rgba(255, 255, 255, 0.45)', // 较浅的文本描述颜色
        colorTextDisabled: 'rgba(255, 255, 255, 0.45)', //控制禁用状态下的字体颜色
        colorPrimary: colorPrimary, // 保持主色一致
        colorLink: colorPrimary, // 保持链接颜色一致
        borderRadius: 8, // 圆角
        fontSize: 14, // 字体大小
        colorBgContainer: '#252525', // 容器背景色：深色背景
        colorBgElevated: '#252525', //浮层容器背景色
        controlItemBgHover: '#444444', //控制组件项在鼠标悬浮时的背景颜色。
        controlItemBgActive: colorPrimary, // 控制组件项在激活状态下的背景颜色
        controlItemBgActiveHover: colorPrimary, // 控制组件项在鼠标悬浮且激活状态下的背景颜色
        colorBorder: 'rgba(255, 255, 255, 0.2)', //边框颜色 
        colorBorderSecondary: 'rgba(255, 255, 255, 0.1)', //辅助性的边框颜色
        colorTextPlaceholder: 'rgba(255, 255, 255, 0.3)', // 提示文字
        controlOutline: 'rgba(255, 255, 255, 0.88)', //激活时的轮廓颜色
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.15)',
      },
      components: {
        Breadcrumb: {
          linkHoverColor: colorPrimary, // 面包屑链接悬浮颜色
        },
        Table: {
          headerBg: '#333333', // 表格头部背景色：更暗的背景
          rowHoverBg: '#333333', // 表格行悬浮背景色：深灰色
          bodySortBg: '#333333', // 表格排序背景色
          headerSortActiveBg: '#444444', // 排序头部激活背景色
          headerSortHoverBg: '#444444', // 排序头部悬浮背景色
          fixedHeaderSortActiveBg: '#444444', // 固定表头排序激活背景色
        },
        Layout: {
          // 顶部背景色
          headerBg: '#1c1c1c', // 更深的顶部背景色
          // 侧边栏背景色
          siderBg: '#181818', // 侧边栏背景色
          // 主体部分背景色
          bodyBg: '#121212', // 主体背景色：深色背景
          // 顶部高度
          headerHeight: 64,
          // 顶部内边距
          headerPadding: 0,
        },
        Menu: {
          // 菜单项背景
          darkItemBg: '#181818',
          // 菜单项悬浮背景
          darkItemHoverBg: '#444444',
          // 菜单项背景色
          darkSubMenuItemBg: '#333333', // 菜单项背景色，深灰色
        },
        Tree: {
          nodeSelectedBg: colorPrimary,
          nodeHoverBg: '#444444'
        },
        TreeSelect: {
          nodeSelectedBg: colorPrimary,
          nodeHoverBg: '#444444'
        },
        Tabs: {
          cardBg: '#1a1a1a'
        },
        Button: {
          primaryShadow: '0 2px 0 rgba(5,145,255,0.1)',
        },
        Input: {
          
        },
        Select: {

        },
        Splitter: {
          colorFill: 'rgba(255, 255, 255, 0.2)', // 分隔线颜色（浅灰色，适合暗色背景）
          controlItemBgHover: 'rgba(255, 255, 255, 0.1)',
          controlItemBgActive: 'rgba(255, 255, 255, 0.25)',
          controlItemBgActiveHover: 'rgba(255, 255, 255, 0.5)'
        },
      },
    },
    light: {
      cssVar: true,
      token: {
        colorText: 'rgba(0,0,0,0.88)',
        colorSplit: 'rgba(5,5,5,0.06)',
        colorTextDescription: 'rgba(0,0,0,0.45)',
        colorPrimary: colorPrimary,
        colorLink: colorPrimary,
        borderRadius: 8,
        colorBgContainer: 'white',
        fontSize: 14,
        colorBorder: '#d9d9d9',
        colorBorderSecondary: '#f0f0f0',
      },
      components: {
        Breadcrumb: {
          linkHoverColor: colorPrimary
        },
        Table: {
          headerBg: '#fafafa',
          rowHoverBg: '#fafafa',
          bodySortBg: '#fafafa',
          headerSortActiveBg: '#fafafa',
          headerSortHoverBg: '#fafafa',
          fixedHeaderSortActiveBg: '#fafafa'
        },
        Layout: {
          //顶部背景色
          headerBg: 'white',
          //侧边栏背景色
          siderBg: '#001529',
          //主体部分背景色
          bodyBg: '#f5f5f5',
          //顶部高度
          headerHeight: 64,
          //顶部内边距
          headerPadding: 0
        },
        Tabs: {
          cardBg: 'white'
        },
        Menu: {

        }
      }
    }
  }), [colorPrimary])

  setMessageApi(api)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={themeConfig[themeValue]}
      renderEmpty={() => (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />)}
    >
      <AuthProvider>
        {contextHolder}
        <RouterProvider
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
          router={router}
        />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
