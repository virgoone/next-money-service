import React, { lazy, Suspense } from 'react'
import {
  UnorderedListOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  GiftOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import Loading from '@/components/loading'

export const defaultRoute = 'welcome'

export type RouteConfig = Record<string, any>

export const routes: RouteConfig[] = [
  {
    name: 'menu.welcome',
    key: 'welcome',
    icon: <GiftOutlined />,
    breadcrumb: false,
    componentPath: 'welcome',
  },
  // {
  //   name: 'menu.visualization',
  //   key: 'visualization',
  //   icon: <AppstoreOutlined />,
  //   children: [
  //     {
  //       name: 'menu.visualization.dataAnalysis',
  //       key: 'visualization/data-analysis',
  //       componentPath: 'visualization/data-analysis',
  //     },
  //     {
  //       name: 'menu.visualization.multiDimensionDataAnalysis',
  //       key: 'visualization/multi-dimension-data-analysis',
  //       componentPath: 'visualization/multi-dimension-data-analysis',
  //     },
  //   ],
  // },
  // {
  //   name: 'menu.list',
  //   key: 'list',
  //   icon: <UnorderedListOutlined />,
  //   children: [
  //     {
  //       name: 'menu.list.searchTable',
  //       key: 'list/search-table',
  //       componentPath: 'list/search-table',
  //     },
  //     {
  //       name: 'menu.list.cardList',
  //       key: 'list/card',
  //       componentPath: 'list/card',
  //     },
  //   ],
  // },
  // {
  //   name: 'menu.form',
  //   key: 'form',
  //   icon: <SettingOutlined />,
  //   children: [
  //     {
  //       name: 'menu.form.group',
  //       key: 'form/group',
  //       componentPath: 'form/group',
  //     },
  //     {
  //       name: 'menu.form.step',
  //       key: 'form/step',
  //       componentPath: 'form/step',
  //     },
  //   ],
  // },
  // {
  //   name: 'menu.profile',
  //   key: 'profile',
  //   icon: <FileTextOutlined />,
  //   children: [
  //     {
  //       name: 'menu.profile.basic',
  //       key: 'profile/basic',
  //       componentPath: 'profile/basic',
  //     },
  //   ],
  // },
  // {
  //   name: 'menu.result',
  //   key: 'result',
  //   icon: <CheckCircleOutlined />,
  //   children: [
  //     {
  //       name: 'menu.result.success',
  //       key: 'result/success',
  //       breadcrumb: false,
  //       componentPath: 'result/success',
  //     },
  //     {
  //       name: 'menu.result.error',
  //       key: 'result/error',
  //       breadcrumb: false,
  //       componentPath: 'result/error',
  //     },
  //   ],
  // },
  {
    name: 'menu.exception',
    key: 'exception',
    hideMenu: true,
    icon: <ExclamationCircleOutlined />,
    children: [
      {
        name: 'menu.exception.403',
        key: 'exception/403',
        componentPath: 'exception/403',
      },
      {
        name: 'menu.exception.404',
        key: 'exception/404',
        componentPath: 'exception/404',
      },
      {
        name: 'menu.exception.500',
        key: 'exception/500',
        componentPath: 'exception/500',
      },
    ],
  },
  {
    name: 'menu.order',
    key: 'order',
    icon: <DollarOutlined />,
    children: [
      {
        name: 'menu.order.giftCode',
        key: 'order/gift-code',
        componentPath: 'order/gift-code',
      },
      {
        name: 'menu.order.chargeProduct',
        key: 'order/charge-product',
        componentPath: 'order/charge-product',
      },
      {
        name: 'menu.order.chargeOrder',
        key: 'order/charge-order',
        componentPath: 'order/charge-order',
      },
    ],
  },
  {
    name: 'menu.user',
    key: 'user',
    icon: <UserOutlined />,
    children: [
      {
        name: 'menu.user.adminList',
        key: 'user/admin-list',
        componentPath: 'user/admin-list',
      },
      {
        name: 'menu.user.setting',
        key: 'user/setting',
        componentPath: 'user/setting',
      },
    ],
  },
]

export function LazyElement(props: any) {
  const { importFunc } = props
  const LazyComponent = lazy(importFunc)
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center min-h-96">
          <Loading />
        </div>
      }
    >
      <LazyComponent />
    </Suspense>
  )
}

export function dealRoutes(routesArr: any) {
  if (routesArr && Array.isArray(routesArr) && routesArr.length > 0) {
    routesArr.forEach((route) => {
      if (route.element && typeof route.element == 'function') {
        const importFunc = route.element
        route.element = <LazyElement importFunc={importFunc} />
      }
      if (route.children) {
        dealRoutes(route.children)
      }
    })
  }
}