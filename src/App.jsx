import React, { useEffect, useState } from 'react';
import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ConfigProvider, Empty, message } from 'antd';
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


  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', defaultColorPrimary)
  }, [colorPrimary])

  setMessageApi(api)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: true,
        token: {
          colorText: 'rgba(0,0,0,0.88)',
          colorPrimary: colorPrimary,
          colorLink: colorPrimary,
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
          Menu: {

          }
        }
      }}
      renderEmpty={() => (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />)}
    >
      <Provider store={store}>
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
      </Provider>
    </ConfigProvider>
  );
}

export default App;
