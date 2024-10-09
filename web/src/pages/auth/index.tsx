// import Layout from './layout'
import React from 'react'
import { useRoutes } from 'react-router-dom'

import { dealRoutes } from '@/routes'
import AuthLayout from './layout'

const routes = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: () => import('@/pages/auth/login'),
      },
      {
        path: '/reset-password',
        element: () => import('@/pages/auth/reset-password'),
      },
    ],
  },
]
dealRoutes(routes)

function RouteElement() {
  const element = useRoutes(routes as any)
  return element
}
const AuthPage = () => {
  return <RouteElement />
}

export default AuthPage
