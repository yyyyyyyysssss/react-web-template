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
        token: {
          colorPrimary: '#1DA57A',
          borderRadius: 8,
        },
        components: {
          Breadcrumb: {
            linkHoverColor: '#1DA57A'
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
