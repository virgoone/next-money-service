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
import { UserControllerBindPassword } from '@/apis/v1/user'
import zxcvbn from 'zxcvbn'; // 密码强度校验

const FormItem = Form.Item

const useBindPasswordMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      UserControllerBindPassword(data),
    onSuccess: (data) => {
      config?.onSuccess?.(data)
    },
  })
}

const BindPasswordDialog = (props: {
  children: React.ReactElement
  refresh?: () => void
}) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const bindPasswordMutation = useBindPasswordMutation()
  const password = Form.useWatch('password', form)
  const onFinish: FormProps['onFinish'] = async (values) => {
    const { error } = await bindPasswordMutation.mutateAsync({
      oldPassword: values.oldPassword,
      password: values.password,
      confirmPassword: values.confirmPassword,
    })
    if (error) {
      return message.error(error)
    }
    form.resetFields()
    message.success('修改成功')
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

  const watchStrength = (password: string): number => {
    const analysisValue = zxcvbn(password)
    // score得分只有0~4，且只有整数范围并没有小数
    return (analysisValue.score + 1) * 20
  }

  return (
    <>
      {React.cloneElement(props.children, {
        onClick: () => setOpen(true),
      })}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="修改密码"
        width={600}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinishFailed={onFinishFailed}
          onFinish={onFinishDebounce}
        >
          <FormItem
            label="旧密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password className="!w-full" placeholder="请输入旧密码" />
          </FormItem>
          <FormItem
            label="新密码"
            name="password"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password className="!w-full" placeholder="请输入新密码" />
          </FormItem>
          <FormItem
            label="确认新密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[{
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),]}
          >
            <Input.Password className="!w-full" placeholder="请输入确认密码" />
          </FormItem>
          <FormItem label="新密码强度">
            <Progress
              percent={password ? watchStrength(password) : 0}
              steps={5}
              className='w-full process-steps'
              strokeColor={['#e74242', '#EFBD47', '#ffa500', '#1bbf1b', '#008000']}
              showInfo={false}
            />
            <Row justify="space-around">
              {
                ['非常弱', '弱', '一般', '强', '非常强'].map(value => <Col span={4} key={value}>{value}  </Col>)
              }
            </Row>
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
              loading={bindPasswordMutation.isPending}
              disabled={bindPasswordMutation.isPending}
            >
              修改
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  )
}

export default BindPasswordDialog
