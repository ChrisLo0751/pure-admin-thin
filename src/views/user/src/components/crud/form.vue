<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import {
  type PlusColumn,
  type FieldValues,
  PlusDialogForm
} from "plus-pro-components";

const props = defineProps<{
  visible: boolean;
  isUpdate: boolean;
  values: FieldValues;
  columns: PlusColumn[];
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "update:values", value: FieldValues): void;
}>();

// 本地状态，用于监听外部传入的 visible 和 values
const dialogVisible = ref(props.visible);
const formValues = ref<FieldValues>({ ...props.values });
const title = ref(props.isUpdate ? "编辑" : "新增");

const handleAllConfirm = async (handleSubmit: () => Promise<boolean>) => {
  const isPass = await handleSubmit();
  console.log(isPass, "isPass");
  isPass && (dialogVisible.value = false);
};

const handleClose = async () => {
  dialogVisible.value = false;
};

// 监听外部 visible 属性变化，并更新内部状态
watch(
  () => props.visible,
  newVal => {
    dialogVisible.value = newVal;
  }
);

// 监听本地 dialogVisible 状态变化，通知父组件
watch(dialogVisible, newVal => {
  emit("update:visible", newVal);
});

// 监听外部传入的 values 变化，并更新内部状态
watch(
  () => props.values,
  newVal => {
    formValues.value = { ...newVal };
  }
);

// 监听本地 formValues 变化，通知父组件
watch(formValues, newVal => {
  emit("update:values", newVal);
});
</script>

<template>
  <PlusDialogForm
    v-model:visible="dialogVisible"
    v-model="formValues"
    :form="{ columns: props.columns, hasFooter: true }"
    :dialog="{
      hasFooter: false,
      title: title
    }"
  >
    <template #form-footer="{ handleSubmit }">
      <div style="display: flex; justify-content: flex-end">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleAllConfirm(handleSubmit)"
          >确认</el-button
        >
      </div>
    </template>
  </PlusDialogForm>
</template>
