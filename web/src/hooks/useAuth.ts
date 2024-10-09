import { useEffect } from 'react'

import { useModel } from '@/store'

// 自定义事件
const getAuthEvent = new CustomEvent('getAuthEvent', {
  bubbles: true,
  cancelable: true,
  composed: true,
  detail: {
    needLogin: true,
  },
})

/**
 * Hook
 * @description 检查用户是否需要重新登录
 * @returns {void}
 */
const useAuth = () => {
  /**
   * Context
   */
  const reset = useModel((state) => state.reset)

  /**
   * Effect
   * @description 监听自定义事件
   * @returns {void}
   */
  useEffect(() => {
    const unLogin = () => {
      reset()
      window.location.href = window.location.origin + '/user/login'
    }

    window.addEventListener('getAuthEvent', unLogin)

    return () => {
      window.removeEventListener('getAuthEvent', unLogin)
    }
  }, [reset])
}

export default useAuth
export { getAuthEvent }
