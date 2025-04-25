import React from 'react';
import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {

  console.log('App')

  return (
    <Provider store={store}>
      <RouterProvider
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
        router={router}
      />
    </Provider>
  );
}

export default App;
