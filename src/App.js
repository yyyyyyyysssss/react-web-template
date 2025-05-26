import React from 'react';
import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';

const App = () => {

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          colorText: 'rgba(0,0,0,0.88)',
          colorPrimary: '#1DA57A',
          borderRadius: 8,
          colorBgContainer: 'white'
        },
        components: {
          Breadcrumb: {
            linkHoverColor: '#1DA57A'
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
          }
        }
      }}
    >
      <Provider store={store}>
        <RouterProvider
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
          router={router}
        />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
