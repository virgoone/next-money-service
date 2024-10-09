import { useMutation } from '@tanstack/react-query'
import { AuthControllerSendCode } from '@/apis/v1/auth'

export const useSendCodeMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) => AuthControllerSendCode(data),
    onSuccess: (data) => {
      config?.onSuccess?.(data)
    },
  })
}