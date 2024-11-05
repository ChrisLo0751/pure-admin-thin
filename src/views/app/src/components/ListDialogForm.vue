<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import BotIcon from "@/assets/svg/bot.svg";
import { createApplication, updateApplication } from "@/api/application";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {};
    }
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const ruleFormRef = ref<FormInstance>();

const formVisible = ref(false);
const formData = ref(props.data);
const title = ref(props.isEdit ? "编辑应用" : "新建应用");
const isEdit = ref(props.isEdit);

const emit = defineEmits(["refresh-product", "update:visible"]);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (isEdit.value) {
        console.log("update application", formData.value);
        updateApplication({
          app_name: formData.value.app_name,
          app_description: formData.value.app_description,
          app_icon: formData.value.app_icon,
          id: props.data.id
        })
          .then((res: any) => {
            if (res.code === 0) {
              message("应用更新成功", { type: "success" });
              formVisible.value = false;
              resetForm(formEl);
              emit("refresh-product");
            } else {
              message(res.msg, { type: "error" });
            }
          })
          .catch(error => {
            message(error.message, { type: "error" });
          });
      } else {
        createApplication({
          app_name: formData.value.app_name,
          app_description: formData.value.app_description,
          app_icon: formData.value.app_icon
        })
          .then((res: any) => {
            if (res.code === 0) {
              message("应用创建成功", { type: "success" });
              formVisible.value = false;
              resetForm(formEl);
              emit("refresh-product");
            } else {
              message(res.msg, { type: "error" });
            }
          })
          .catch(error => {
            message(error.message, { type: "error" });
          });
      }
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  formVisible.value = false;
  resetForm(ruleFormRef.value);
};

watch(
  () => formVisible.value,
  val => {
    emit("update:visible", val);
  }
);

watch(
  () => props.visible,
  val => {
    formVisible.value = val;
  }
);

watch(
  () => props.data,
  val => {
    formData.value = val;
  }
);

watch(
  () => props.isEdit,
  val => {
    title.value = val ? "编辑应用" : "新建应用";
    isEdit.value = val;
  }
);

const rules = {
  app_name: [{ required: true, message: "请输入应用名称", trigger: "blur" }]
};

const triggerFileInput = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png, image/jpeg, image/jpg";

  input.addEventListener("change", async event => {
    // 使用类型断言，确保 event.target 是 HTMLInputElement 类型
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0]; // 获取选中的文件

    if (file) {
      try {
        // 你可以根据你的 API 实现来发送文件请求
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/upload-endpoint", {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          console.log("文件上传成功");
        } else {
          console.error("文件上传失败");
        }
      } catch (error) {
        console.error("上传过程中出现错误:", error);
      }
    }
  });

  input.click();
};
</script>

<template>
  <el-dialog
    v-model="formVisible"
    :title="title"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <!-- 表单内容 -->
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="应用图标" prop="icon">
        <template v-if="!formData.icon">
          <BotIcon style="cursor: pointer" @click="triggerFileInput" />
        </template>
        <template v-else>
          <img
            :src="formData.app_icon"
            alt="应用头像"
            style="width: 30px; height: 30px; cursor: pointer"
            @click="triggerFileInput"
          />
        </template>
      </el-form-item>
      <el-form-item label="应用名称" prop="name">
        <el-input
          v-model="formData.app_name"
          :style="{ width: '480px' }"
          placeholder="请输入应用名称"
        />
      </el-form-item>
      <el-form-item label="应用描述" prop="description">
        <el-input
          v-model="formData.app_description"
          type="textarea"
          :style="{ width: '480px' }"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
