export enum VerifyCodeType {
  Signin = 'Signin',
  Signup = 'Signup',
  ResetPassword = 'ResetPassword',
  Bind = 'Bind',
  Unbind = 'Unbind',
  Change = 'Change',
}

export enum UserState {
  Active = 'active',
  Inactive = 'inactive',
}

export enum VerifyCodeState {
  Used = 'used',
  Unused = 'unused',
}