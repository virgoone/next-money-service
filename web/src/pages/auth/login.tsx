import React, { useEffect, useRef, useState } from 'react'
import { Form, message, Input, Checkbox, Button, Space, Row, Col } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Link from '@/components/link'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useModel } from '@/store'
import { VerifyCodeType } from '@/constants/type'
import useLocale from './locale/useLocale'
import { defaultRoute } from '@/routes'
import { debounce } from 'lodash'
import styles from './style.less?modules'
import { useSendCodeMutation } from './service'

function LoginForm() {
  const [form] = Form.useForm()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberPassword, setRememberPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const store = useModel((state) => state)
  const locale = useLocale()
  const [countdown, setCountdown] = useState(0)
  const email = Form.useWatch('email', form)
  const sendCodeMutation = useSendCodeMutation()

  // @ts-ignore
  const from = location.state?.from?.pathname || `/${defaultRoute}`

  function afterLoginSuccess(params: Record<string, string>) {
    // 记住密码
    if (rememberPassword) {
      localStorage.setItem('loginParams', JSON.stringify(params))
    } else {
      localStorage.removeItem('loginParams')
    }
    // 记录登录状态
    store.setUserInfo()
    // 跳转首页
    navigate(from)
  }

  async function login(params: Record<string, any>) {
    setErrorMessage('')
    setLoading(true)

    try {
      const res = await store.login({
        email: params.email,
        code: params.code,
        password: params.password,
        username: params.username,
      })
      if (res.error) {
        return setErrorMessage(res.error)
      }
      afterLoginSuccess(params)
    } catch (error) {
      console.log('error--->', error)
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const timerCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const sendCode = async () => {
    try {
      if (!email) {
        message.error(locale['login.form.email.required'])
        return
      }
      if (countdown > 0) {
        return
      }
      const { error } = await sendCodeMutation.mutateAsync({ email, type: VerifyCodeType.Signin })
      if (error) {
        message.error(error)
        return
      }
      timerCountdown()
    } catch (error) {
      console.log('error--->', error)
    }
  }

  const debounceSendCode = debounce(sendCode, 600)

  function onSubmitClick() {
    form?.validateFields().then((values) => {
      console.log('values-->', values)
      login(values)
    })
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const params = localStorage.getItem('loginParams')
    const rememberPassword = !!params
    setRememberPassword(rememberPassword)
    if (form && rememberPassword) {
      const parseParams = JSON.parse(params)
      form.setFieldsValue(parseParams)
    }
  }, [])

  useEffect(() => {
    if (store.isLogin) {
      navigate(from, {
        replace: true,
      })
    }
  }, [from, store.isLogin])

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{locale['login.title']}</div>
      <div className={styles['login-form-sub-title']}>
        {locale['login.subtitle']}
      </div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form form={form} className={styles['login-form']} layout="vertical">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: locale['login.form.email.required'] },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={locale['login.form.email.tips']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Row gutter={8}>
          <Col span={14}>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: locale['login.form.code.required'] },
              ]}
            >
              <Input placeholder={locale['login.form.code.tips']} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Button
              onClick={debounceSendCode}
              block
              disabled={countdown > 0 || !email}
              loading={sendCodeMutation.isPending}
            >
              {countdown > 0 ? `${countdown}s` : locale['login.form.code.send']}
            </Button>
          </Col>
        </Row>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: locale['login.form.password.tips'] },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={locale['login.form.password.tips']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} style={{ width: '100%' }} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Checkbox
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
            >
              {locale['login.form.button.remember-password']}
            </Checkbox>
            <Link href="/auth/reset-password">{locale['login.form.button.forgot-password']}？</Link>
          </div>
          <Button
            type="primary"
            block
            onClick={onSubmitClick}
            loading={loading}
          >
            {locale['login.form.button.login']}
          </Button>
          {/* <Button
            type="text"
            block
            className={styles['login-form-register-btn']}
          >
            {locale['login.form.button.signup']}
          </Button> */}
        </Space>
      </Form>
    </div>
  )
}
export default LoginForm
