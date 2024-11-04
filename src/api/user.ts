import { http } from "@/utils/http";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type CaptchaResult = {
  captcha_id: string;
  captcha_image: string;
};

export type Result<T> = {
  code: number;
  msg: string;
  data?: T;
};

const enum UserApi {
  Login = "/api/v1/user/login",
  RefreshToken = "/refresh-token",
  Captcha = "/api/v1/graphic/code",
  Logout = "/api/v1/user/logout",
  BindGoogleCode = "/api/v1/user/bind_google_captcha",
  GetGoogleCode = "/api/v1/user/login_first"
}

export type GetLoginParams = {
  username: string; // 用户名/邮箱
  password: string; // 密码
  code: string; // 图形验证码
  captcha_id: string; // 图形验证码唯一标识
  google_code: string; // 谷歌验证码
};

export type GetLoginResult = {
  token: string;
  username: string;
  avatar: string;
};

/** 登录 */
export const getLogin = async (data: GetLoginParams) => {
  const res = await http.request<Result<GetLoginResult>>(
    "post",
    UserApi.Login,
    { data }
  );
  if (res.code != 0) {
    throw new Error(res.msg);
  }
  return res.data;
};

/** 刷新`token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", UserApi.RefreshToken, {
    data
  });
};

/** 获取图形验证码 */
export const getCaptcha = async (): Promise<CaptchaResult | undefined> => {
  const res = await http.request<Result<CaptchaResult>>("get", UserApi.Captcha);
  if (res.code == 0) {
    return res.data;
  } else {
    throw new Error(res.msg);
  }
};

/** 账号退出登录 */
export const logoutApi = () => {
  return http.request("post", UserApi.Logout);
};

export type BindGoogleCodeApiParams = {
  username: string; // 用户名
  password: string; // 密码
  account_secret_key: string; // 谷歌私钥
  code: string; // 谷歌动态验证码
};

/** 账号绑定谷歌验证码 */
export const bindGoogleCodeApi = async (data: BindGoogleCodeApiParams) => {
  const result = await http.request<Result<any>>(
    "post",
    UserApi.BindGoogleCode,
    { data }
  );
  if (result.code != 0) {
    throw new Error(result.msg);
  }

  return result.data;
};

export type getGoogleCodeApiParsms = {
  username: string;
  password: string;
};

export type getGoogleCodeApiResult = {
  google_changed: number; // 谷歌验证码是否已绑定
  account_secret_key: string; // 谷歌验密钥
  code_url: string; // 谷歌验证码图片地址
};

/** 提交用户信息获取谷歌验证码 */
export const getGoogleCodeApi = async (data: getGoogleCodeApiParsms) => {
  const res = await http.request<Result<getGoogleCodeApiResult>>(
    "post",
    UserApi.GetGoogleCode,
    { data }
  );
  if (res.code == 0) {
    return res.data;
  } else {
    throw new Error(res.msg);
  }
};
