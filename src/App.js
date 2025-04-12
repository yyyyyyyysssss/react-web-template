import './App.css';
import router from './router/router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <RouterProvider
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
      router={router}
    />
  );
}

export default App;
