// import { hash } from 'spark-md5'
import type { StateCreator } from 'zustand'
import ajax from '@/utils/ajax'
import { AuthControllerSignin } from '@/apis/v1/auth'
import { UserControllerGetProfile } from '@/apis/v1/user'
import type { RootStoreState } from '../rootModel'
import type {
  PersistMiddleware,
  DevtoolsMiddleware,
  ImmerMiddleware,
} from '../type'

interface UserModelSlice {
  token?: string // 用户token

  setToken: (token: string) => void
  setUser: (info: any) => void
  setUserInfo: () => void
  logout: () => void
  login: (params: {
    username?: string
    password?: string
    email: string
    code: string
  }) => Promise<{ error: string | null }>
  // updateUserInfo: (
  //   payload: Parameters<typeof updateUserInfoAPI>[number]
  // ) => Promise<string>

  // emitLoginCallback: (callback?: () => void) => void
  // emitLoginCallbackWithPathname: (
  //   pathname: string,
  //   callback?: () => void
  // ) => void
}

/**
 * 用户模型切片
 */
const createUserModelSlice: StateCreator<
  RootStoreState,
  [
    DevtoolsMiddleware,
    PersistMiddleware<unknown>,
    ImmerMiddleware<RootStoreState>,
  ],
  [],
  UserModelSlice
> = (set, get) => ({
  token: null,
  info: null,

  // /**
  //  * 触发登录状态
  //  * 未登录 打开登录Modal
  //  */
  // emitLoginCallback: (callback) => {
  //   const { userInfo } = get()
  //   if (userInfo) {
  //     callback?.()
  //     return
  //   }

  //   get().setLoginModalVisible(true)
  // },

  // // 判断路由
  // emitLoginCallbackWithPathname: (pathname, callback) => {
  //   // 首页 发现页 继续操作
  //   if (allowNotLoginInPath(pathname)) {
  //     callback?.()
  //   } else {
  //     get().emitLoginCallback(callback)
  //   }
  // },

  // 登录
  login: async (params) => {
    const { data, error } = await AuthControllerSignin(params)
    if (error) {
      return { error }
    }
    set((state) => {
      state.isLogin = true
      ajax.defaults.headers.common['Authorization'] = `Bearer ${data}`
      localStorage.setItem('@@token', data)
    })

    get().setToken(data)
    return { error: null }
  },

  // 设置用户信息
  setUser: (info) => {
    set((state) => {
      state.info = info
      state.loading = false
    })
  },

  // 设置用户信息
  setUserInfo: async () => {
    const res = await UserControllerGetProfile({})

    if (res.error) {
      get().showError(res.error)
      return
    }

    get().setUser(res.data)
  },

  // // 修改用户信息
  // updateUserInfo: async (payload) => {
  //   try {
  //     await updateUserInfoAPI(payload)
  //     set((state) => {
  //       if (!state.userInfo) return
  //       state.userInfo.avatar = payload.avatar ?? state.userInfo.avatar
  //       state.userInfo.nickName = payload.nickName ?? state.userInfo.nickName
  //       state.userInfo.signature = payload.signature ?? state.userInfo.signature
  //       state.userInfo.bilibiliLink =
  //         payload.bilibiliLink ?? state.userInfo.bilibiliLink
  //       state.userInfo.xhsLink = payload.xhsLink ?? state.userInfo.xhsLink
  //       state.userInfo.tiktokLink =
  //         payload.tiktokLink ?? state.userInfo.tiktokLink
  //     })

  //     return ''
  //   } catch (error) {
  //     const { message } = error as Error
  //     return message
  //   }
  // },

  // 登录
  // 设置token
  setToken: (token) =>
    set((state) => {
      state.token = token
      localStorage.setItem('@@token', token)
    }),
  logout: () => {
    set((state) => {
      state.token = null
      state.info = null
      state.isLogin = false
      localStorage.removeItem('@@token')
    })
  },
})

export type { UserModelSlice }
export { createUserModelSlice }
