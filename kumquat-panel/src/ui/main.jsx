import React from 'react';
import ReactDOM from 'react-dom/client';

import { extendTheme } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'

import Webterm from './components/Webterm.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/error/Error.jsx';
import App from './pages/home/App.jsx';
import LoginPage from './pages/login/Login.jsx';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

const route = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "terminal",
        element: <Webterm></Webterm>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage></LoginPage>
  },
  {
    path: "/about",
    element: <div><h1>{JSON.stringify(import.meta.env)}</h1></div>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={route} />
    </ChakraProvider>
    
  </React.StrictMode>
)
