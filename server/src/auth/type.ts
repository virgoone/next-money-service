export enum VerifyCodeType {
  Signin = 'Signin',
  Signup = 'Signup',
  ResetPassword = 'ResetPassword',
  Bind = 'Bind',
  Unbind = 'Unbind',
  Change = 'Change',
}

export const VerifyCodeTypeMap = {
  [VerifyCodeType.Signin]: '登录验证',
  [VerifyCodeType.Signup]: '注册验证',
  [VerifyCodeType.ResetPassword]: '重置密码',
  [VerifyCodeType.Bind]: '绑定邮箱',
  [VerifyCodeType.Unbind]: '解绑邮箱',
  [VerifyCodeType.Change]: '修改邮箱',
}

export enum UserState {
  Active = 'active',
  Inactive = 'inactive',
}

export enum VerifyCodeState {
  Used = 'used',
  Unused = 'unused',
}