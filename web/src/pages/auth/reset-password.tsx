import React, { useEffect, useRef, useState } from 'react'
import { Form, message, Input, Checkbox, Button, Space, Row, Col } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useModel } from '@/store'
import { debounce } from 'lodash'
import { VerifyCodeType } from '@/constants/type'
import useLocale from './locale/useLocale'
import type { FormProps } from 'antd/lib/form'
import styles from './style.less?modules'
import { useSendCodeMutation } from './service'
import { UserControllerResetPassword } from '@/apis/v1/user'

function ResetPasswordForm() {
  const [form] = Form.useForm()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const store = useModel((state) => state)
  const locale = useLocale()
  const [countdown, setCountdown] = useState(0)
  const email = Form.useWatch('email', form)
  const sendCodeMutation = useSendCodeMutation()

  function afterLoginSuccess(params: Record<string, string>) {
    // 跳转首页
    navigate('/auth/login')
  }

  async function login(params: Record<string, any>) {
    if (!email) {
      message.error(locale['login.form.email.required'])
      return
    }
    setErrorMessage('')
    setLoading(true)

    const res = await UserControllerResetPassword({
      email: params.email,
      code: params.code,
      password: params.password,
    })
    if (res.error) {
      setErrorMessage(res.error)
      return
    }
    message.success(locale['login.form.button.reset-password.success'])
    afterLoginSuccess(params)
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
      const { error } = await sendCodeMutation.mutateAsync({ email, type: VerifyCodeType.ResetPassword })
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

  const onFinish: FormProps['onFinish'] = async (values) => {
    await login(values)
  }
  const onFinishDebounce = debounce(onFinish, 1000)

  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('errorInfo', errorInfo)
    if (errorInfo.errorFields.length > 0) {
      form.scrollToField(errorInfo.errorFields[0].name?.[0], {
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{locale['auth.reset-password.title']}</div>
      <div className={styles['login-form-sub-title']}>
        {locale['login.subtitle']}
      </div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form form={form} onFinishFailed={onFinishFailed}
        onFinish={onFinishDebounce} className={styles['login-form']} layout="vertical">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: locale['login.form.email.required'] },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={locale['login.form.email.tips']}
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
            { required: true, message: locale['login.form.reset-password.tips'] },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={locale['login.form.reset-password.tips']}
          />
        </Form.Item>
        <Space size={16} style={{ width: '100%' }} direction="vertical">
          <Button
            type="primary"
            block
            htmlType="submit"
            loading={loading}
          >
            {locale['login.form.button.reset-password']}
          </Button>
          <Button
            type="text"
            block
            href='/auth/login'
            className={styles['login-form-register-btn']}
          >
            {locale['login.form.button.login']}
          </Button>
        </Space>
      </Form>
    </div>
  )
}
export default ResetPasswordForm
