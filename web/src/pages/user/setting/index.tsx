import React, { useState } from 'react'
import { Card, Tabs } from 'antd'
import useLocale from '@/hooks/useLocale'
import { useModel } from '@/store'
import locales from './locale'
import InfoHeader from './header'
import Security from './security'

function UserInfo() {
  const locale = useLocale(locales)
  const store = useModel((state) => state)
  const { info: userInfo = {}, loading } = store
  const [activeTab, setActiveTab] = useState('security')

  return (
    <div>
      <Card style={{ padding: '14px 20px' }}>
        <InfoHeader userInfo={userInfo} loading={loading} />
      </Card>
      <Card style={{ marginTop: '16px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="line"
          items={[
            {
              key: 'security',
              label: locale['userSetting.title.security'],
              children: <Security />,
            },
          ]}
        ></Tabs>
      </Card>
    </div>
  )
}

export default UserInfo
