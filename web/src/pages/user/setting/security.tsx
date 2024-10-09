import React from 'react'
import cs from 'clsx'
import { Button } from 'antd'
import { useModel } from '@/store'
import useLocale from '@/hooks/useLocale'
import locales from './locale'
import styles from './style/index.less?modules'
import BindPasswordDialog from './mods/bind-password'
import BindEmailDialog from './mods/bind-email'
function Security() {
  const locale = useLocale(locales)

  const store = useModel((state) => state)
  const { info: userInfo = {} } = store

  const data = [
    {
      title: locale['userSetting.security.password'],
      value: locale['userSetting.security.password.tips'],
    },
    {
      title: locale['userSetting.security.email'],
      value: userInfo.email,
      placeholder: locale['userSetting.security.email.placeholder'],
    },
  ]

  return (
    <div className={styles['security']}>
      {data.map((item, index) => (
        <div className={styles['security-item']} key={index}>
          <span className={styles['security-item-title']}>{item.title}</span>
          <div className={styles['security-item-content']}>
            <span
              className={cs({
                [`${styles['security-item-placeholder']}`]: !item.value,
              })}
            >
              {item.value || item.placeholder}
            </span>

            <span>
              {
                item.title === locale['userSetting.security.password'] ? (
                  <BindPasswordDialog>
                    <Button type="text">
                      {item.value
                        ? locale['userSetting.btn.edit']
                        : locale['userSetting.btn.set']}
                    </Button>
                  </BindPasswordDialog>
                ) : item.title === locale['userSetting.security.email'] ? (
                  <BindEmailDialog>
                    <Button type="text">
                      {item.value
                        ? locale['userSetting.btn.edit']
                        : locale['userSetting.btn.set']}
                    </Button>
                  </BindEmailDialog>
                ) : (
                  <Button type="text">
                    {item.value
                      ? locale['userSetting.btn.edit']
                      : locale['userSetting.btn.set']}
                  </Button>
                )
              }
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Security
