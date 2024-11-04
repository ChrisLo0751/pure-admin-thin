<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, watch, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { QrCode } from "@/components/Qrcode";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import { setToken } from "@/utils/auth";
import { addPathMatch, getTopMenu } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStoreHook } from "@/store/modules/user";
import { bindGoogleCodeApi, getCaptcha, getGoogleCodeApi } from "@/api/user";
import ReImageVerifyFromServer from "@/components/ReImageVerifyFromServer";
import { hbmd5 } from "@/utils/md5/md5";
import { getLogin } from "@/api/user";

defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const imgCode = ref("");
const captchaId = ref("");
const isGoogle = ref(false);
const accountSecretKey = ref("");
const codeUrl = ref("");
const isGoogleBind = ref(true);

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  username: "",
  password: "",
  verifyCode: "",
  verificationCode: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      getLogin({
        username: ruleForm.username,
        password: hbmd5(ruleForm.password),
        code: ruleForm.verifyCode,
        captcha_id: captchaId.value,
        google_code: ruleForm.verificationCode
      })
        .then(data => {
          setToken({
            accessToken: data.token,
            username: data.username,
            avatar: data.avatar
          });
          usePermissionStoreHook().handleWholeMenus([]);
          addPathMatch();
          router.push(getTopMenu(true).path);
          message("登录成功", { type: "success" });
          loading.value = false;
        })
        .catch(error => {
          message(error.message, { type: "error" });
          loading.value = false;
        });
    }
  });
};

const onBindGoogle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      bindGoogleCodeApi({
        username: ruleForm.username,
        password: hbmd5(ruleForm.password),
        account_secret_key: accountSecretKey.value,
        code: ruleForm.verificationCode
      })
        .then(data => {
          console.log(data);
          message("绑定成功", { type: "success" });
          isGoogleBind.value = true;
          loading.value = false;
          onLogin(ruleFormRef.value);
        })
        .catch(error => {
          message(error.message, { type: "error" });
        });
    }
  });
};

const checkGoogleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      try {
        getGoogleCodeAndUrl().then(data => {
          isGoogle.value = true;
          accountSecretKey.value = data.account_secret_key;
          codeUrl.value = data.code_url;
          if (data.google_changed != 0) {
            isGoogleBind.value = false;
            console.log("用户已绑定谷歌验证码");
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      message("验证失败", { type: "error" });
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    if (!isGoogle.value) {
      checkGoogleLogin(ruleFormRef.value);
    } else {
      onLogin(ruleFormRef.value);
    }
  }
}

const refreshCode = async () => {
  const data = await getCaptcha();
  imgCode.value = data.captcha_image;
  captchaId.value = data.captcha_id;
};

const getGoogleCodeAndUrl = async () => {
  try {
    const data = await getGoogleCodeApi({
      username: ruleForm.username,
      password: hbmd5(ruleForm.password)
    });
    return data;
  } catch (error) {
    message(error.message, { type: "error" });
    throw error;
  }
};

const copySecretKey = () => {
  if (!accountSecretKey.value) {
    message("没有密钥可复制", { type: "error" });
    return;
  }

  navigator.clipboard
    .writeText(accountSecretKey.value)
    .then(() => {
      message("密钥已复制");
    })
    .catch(() => {
      message("没有密钥可复制", { type: "error" });
    });
};

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
  refreshCode();
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

watch(imgCode, value => {
  useUserStoreHook().SET_VERIFYCODE(value);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            v-if="!isGoogle"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item
                prop="verifyCode"
                :rules="[
                  {
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="ruleForm.verifyCode"
                  clearable
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                >
                  <template v-slot:append>
                    <ReImageVerifyFromServer
                      :codeImage="imgCode"
                      @refreshCode="refreshCode"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="checkGoogleLogin(ruleFormRef)"
              >
                下一步
              </el-button>
            </Motion>
          </el-form>
          <el-form
            v-if="isGoogleBind && isGoogle"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <h3>Google 验证</h3>
            <Motion :delay="250">
              <div class="mt-4 flex justify-center items-center text-xs">
                <QrCode :value="codeUrl" :width="280" class="inline-block" />
              </div>
            </Motion>

            <Motion :delay="250">
              <div class="mt-4 flex justify-between items-center text-xs">
                <p>密钥:</p>
                <span>{{ accountSecretKey }}</span>
                <el-button size="small" type="text" @click="copySecretKey"
                  >复制</el-button
                >
              </div>
            </Motion>

            <Motion :delay="250">
              <el-form-item prop="verificationCode" class="w-full mt-4">
                <el-input
                  v-model="ruleForm.verificationCode"
                  placeholder="请输入谷歌验证器的6位验证码"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onBindGoogle(ruleFormRef)"
              >
                绑定
              </el-button>
            </Motion>
          </el-form>
          <el-form
            v-if="!isGoogleBind && isGoogle"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <h3>Google 验证</h3>
            <Motion :delay="250">
              <el-form-item prop="verificationCode" class="w-full mt-4">
                <el-input
                  v-model="ruleForm.verificationCode"
                  placeholder="请输入谷歌验证器的6位验证码"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
