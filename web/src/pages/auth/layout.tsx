import React, { useEffect } from 'react'
import { ReactComponent as Logo } from '@/assets/logo.svg'
import Footer from '../../components/footer'
import LoginBanner from './banner'
import { Outlet } from 'react-router-dom'

import styles from './style.less?modules'

export default () => {
  useEffect(() => {
    document.body.setAttribute('antd-theme', 'light')
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.banner}>
        <div className={styles['banner-inner']}>
          <LoginBanner />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles['content-inner']}>
          <Outlet />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  )
}
