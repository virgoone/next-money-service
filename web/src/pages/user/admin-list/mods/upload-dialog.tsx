import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Progress,
  Row,
  Col,
} from 'antd'
import type { FormProps } from 'antd/lib/form'
import { useNavigate } from 'react-router'
import { debounce } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { AdminUserDto } from '../constants'
import { UserControllerCreateUser } from '@/apis/v1/user'
import zxcvbn from 'zxcvbn'; // 密码强度校验

const FormItem = Form.Item


const useCreateMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      UserControllerCreateUser(data),
    onSuccess: (data) => {
      config?.onSuccess?.(data)
    },
  })
}

const UploadDialog = (props: {
  open: boolean
  detail?: AdminUserDto
  type?: 'create' | 'view'
  onClose: () => void
  refresh?: () => void
}) => {
  const { open, detail, type = 'view', onClose, refresh } = props
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const createMutation = useCreateMutation()
  const onFinish: FormProps['onFinish'] = async (values) => {
    await createMutation.mutateAsync(values)
    message.success('创建成功')
    onClose()
    props.refresh?.()
  }
  const password = Form.useWatch('password', form)


  const watchStrength = (password: string): number => {
    const analysisValue = zxcvbn(password)
    // score得分只有0~4，且只有整数范围并没有小数
    return (analysisValue.score + 1) * 20
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

  useEffect(() => {
    if (detail) {
      form.setFieldsValue(detail)
    }
  }, [detail])

  return (
    <Drawer
      open={open}
      onClose={() => onClose()}
      title={type === 'create' ? '创建' : '查看'}
      size="large"
    >
      <Form
        form={form}
        layout="vertical"
        onFinishFailed={onFinishFailed}
        onFinish={onFinishDebounce}
        disabled={type === 'view'}
      >
        {type === 'view' &&
          <FormItem
            label="ID"
            name="id"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input className="!w-full" placeholder="Please input..." />
          </FormItem>
        }
        <FormItem
          label="用户名"
          name="name"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input className="!w-full" placeholder="Please input..." />
        </FormItem>
        <FormItem
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input className="!w-full" placeholder="Please input..." />
        </FormItem>

        {
          type === 'create' ?
            <>
              <FormItem
                label="初始密码"
                name="password"
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input className="!w-full" placeholder="Please input..." />
              </FormItem>
              <FormItem label="初始密码强度">
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
            </> : (
              <FormItem
                label="手机号"
                name="phone"
              >
                <Input className="!w-full" placeholder="Please input..." />
              </FormItem>
            )
        }
        <Space className="flex w-full justify-end gap-2 pt-2 sm:space-x-0">
          <Button
            type="default"
            htmlType="reset"
            onClick={() => onClose()}
          >
            关闭
          </Button>
          {type === 'create' &&
            <Button
              type="primary"
              htmlType="submit"
              disabled={createMutation.isPending}
            >
              提交
            </Button>
          }
        </Space>
      </Form>
    </Drawer>
  )
}

export default UploadDialog
