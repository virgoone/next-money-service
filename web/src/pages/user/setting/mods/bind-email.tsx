import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Progress,
  Space,
  Row,
  Col,
} from 'antd'
import type { FormProps } from 'antd/lib/form'
import { useNavigate } from 'react-router'
import { debounce } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { UserControllerBindEmail } from '@/apis/v1/user'
import { useSendCodeMutation } from '@/pages/login/service'
import { VerifyCodeType } from '@/constants/type'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useModel } from '@/store'

const FormItem = Form.Item

const useBindEmailMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      UserControllerBindEmail(data),
    onSuccess: (data) => {
      config?.onSuccess?.(data)
    },
  })
}

const BindEmailDialog = (props: {
  children: React.ReactElement
  refresh?: () => void
}) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const store = useModel(state => state)
  const [form] = Form.useForm()
  const [countdown, setCountdown] = useState(0)
  const sendCodeMutation = useSendCodeMutation()
  const bindEmailMutation = useBindEmailMutation()
  const email = Form.useWatch('email', form)

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
        message.error('请输入邮箱')
        return
      }
      if (countdown > 0) {
        return
      }
      await sendCodeMutation.mutateAsync({ email, type: VerifyCodeType.Bind })
      timerCountdown()
    } catch (error) {
      console.log('error--->', error)
    }
  }

  const debounceSendCode = debounce(sendCode, 600)

  const onFinish: FormProps['onFinish'] = async (values) => {
    const { error } = await bindEmailMutation.mutateAsync({
      email: values.email,
      code: values.code,
      password: values.password,
    })
    if (error) {
      return message.error(error)
    }
    await store.setUserInfo()
    form.resetFields()
    message.success('绑定成功')
    setOpen(false)
    props.refresh?.()
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
    <>
      {React.cloneElement(props.children, {
        onClick: () => setOpen(true),
      })}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="绑定邮箱"
        width={600}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinishFailed={onFinishFailed}
          onFinish={onFinishDebounce}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入新邮箱"
            />
          </Form.Item>

          <Row gutter={8}>
            <Col span={18}>
              <Form.Item
                name="code"
                rules={[
                  { required: true, message: '请输入验证码' },
                ]}
              >
                <Input placeholder="请输入验证码" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button
                onClick={debounceSendCode}
                block
                disabled={countdown > 0 || !email}
                loading={sendCodeMutation.isPending}
              >
                {countdown > 0 ? `${countdown}s` : '发送验证码'}
              </Button>
            </Col>
          </Row>
          <FormItem
            name="password"
            rules={[{ required: true, message: '请输入账户密码' }]}
          >
            <Input.Password className="!w-full" placeholder="请输入旧密码" />
          </FormItem>
          <Space className="flex w-full justify-end gap-2 pt-2 sm:space-x-0">
            <Button
              type="default"
              htmlType="reset"
              onClick={() => setOpen(false)}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={bindEmailMutation.isPending}
              disabled={bindEmailMutation.isPending}
            >
              绑定
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  )
}

export default BindEmailDialog
