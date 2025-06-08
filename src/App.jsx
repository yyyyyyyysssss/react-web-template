import React, { useEffect, useState } from 'react';
import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ConfigProvider, Empty, message } from 'antd';
import 'antd/dist/reset.css';

import NProgress from 'nprogress';
import { setMessageApi } from './utils/MessageUtil.jsx';
import { ThemeContext } from './context/ThemeContext';

NProgress.configure({
  parent: '.layout-header',
  showSpinner: false
})

const defaultColorPrimary = '#1DA57A'


const App = () => {

  const [api, contextHolder] = message.useMessage()

  const [colorPrimary, setColorPrimary] = useState(defaultColorPrimary)

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', defaultColorPrimary)
  }, [colorPrimary])

  setMessageApi(api)

  const zhCustomLocale = {
    Pagination: {
      items_per_page: '条每页', // 会显示为 “10 条每页”
      jump_to: '跳至',
      jump_to_confirm: '确认',
      page: '页',
      prev_page: '上一页',
      next_page: '下一页',
      prev_5: '向前 5 页',
      next_5: '向后 5 页',
      prev_3: '向前 3 页',
      next_3: '向后 3 页',
    },
  };

  return (
    <ConfigProvider
      locale={{
        Pagination: zhCustomLocale.Pagination
      }}
      theme={{
        cssVar: true,
        token: {
          colorText: 'rgba(0,0,0,0.88)',
          colorPrimary: colorPrimary,
          borderRadius: 8,
          colorBgContainer: 'white',
          fontSize: 14,
          colorSplit: 'rgba(5,5,5,0.06)'
        },
        components: {
          Breadcrumb: {
            linkHoverColor: colorPrimary
          },
          Table: {
            headerBg: '#fafafa',
            rowHoverBg: '#fafafa'
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
          Menu: {

          }
        }
      }}
      renderEmpty={() => (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />)}
    >
      <Provider store={store}>
        {contextHolder}
        <ThemeContext.Provider value='dark'>
          <RouterProvider
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
            router={router}
          />
        </ThemeContext.Provider>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
