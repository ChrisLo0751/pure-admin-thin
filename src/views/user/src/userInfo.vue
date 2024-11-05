<template>
  <div class="user-info">
    <div class="box-card">
      <div class="clearfix">
        <span>个人信息</span>
      </div>
      <el-form :model="user" label-width="80px">
        <el-form-item label="头像">
          <el-avatar :size="80" :src="userInfos.avatar" />
          <el-upload
            ref="uploadRef"
            accept="image/*"
            action="#"
            :limit="1"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onChange"
          >
            <el-button plain class="ml-4">
              <IconifyIconOffline :icon="uploadLine" />
              <span class="ml-2">更新头像</span>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openResetPasswordDialog"
            >重置密码</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 重置密码弹窗 -->
    <el-dialog
      v-model:visible="dialogVisible"
      title="重置密码"
      width="30%"
      @close="resetForm"
    >
      <el-form
        ref="resetPasswordForm"
        :model="resetPasswordForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="resetPasswordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
            placeholder="请设置6-12位密码"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "UserInfo",
  setup() {
    const user = ref({
      email: "1591410@qq.com"
    });

    const userInfos = reactive({
      avatar: "",
      nickname: "",
      email: "",
      phone: "",
      description: ""
    });

    const avatarUrl = ref("https://path-to-your-avatar-image"); // 替换为头像的实际 URL
    const dialogVisible = ref(false);
    const resetPasswordForm = ref({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    const rules = {
      oldPassword: [
        { required: true, message: "请输入旧密码", trigger: "blur" }
      ],
      newPassword: [
        { required: true, message: "请输入新密码", trigger: "blur" },
        { min: 6, max: 12, message: "密码长度应为6-12位", trigger: "blur" }
      ],
      confirmPassword: [
        { required: true, message: "请确认新密码", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value !== resetPasswordForm.value.newPassword) {
              callback(new Error("两次输入的密码不一致"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        }
      ]
    };

    const openResetPasswordDialog = () => {
      dialogVisible.value = true;
    };

    const handleConfirm = () => {
      // 提交表单
      resetPasswordForm.value.validate(valid => {
        if (valid) {
          console.log("提交重置密码表单:", resetPasswordForm.value);
          dialogVisible.value = false;
          resetForm();
        } else {
          console.log("表单验证失败");
          return false;
        }
      });
    };

    const resetForm = () => {
      resetPasswordForm.value.oldPassword = "";
      resetPasswordForm.value.newPassword = "";
      resetPasswordForm.value.confirmPassword = "";
    };

    return {
      user,
      avatarUrl,
      dialogVisible,
      resetPasswordForm,
      rules,
      openResetPasswordDialog,
      handleConfirm,
      resetForm,
      userInfos
    };
  }
};
</script>

<style scoped>
.user-info {
  width: 800px;
  margin: auto;
}

.box-card {
  background-color: none;
  border: none;
}

.avatar-section {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
