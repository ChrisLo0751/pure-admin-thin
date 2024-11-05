<script setup lang="ts">
import { ref } from "vue";
import { useColumns, useForm } from "./columns";
import { type FieldValues } from "plus-pro-components";
import From from "./form.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";

const tableRef = ref();

const dialogVisible = ref(false);
const formValues = ref<FieldValues>({
  // 初始值
});

const isUpdate = ref(false);

const handleOpen = () => {
  dialogVisible.value = true;
  isUpdate.value = false;
};

// const handleEdit = (row: any) => {
//   dialogVisible.value = true;
//   isUpdate.value = true;
// };
const handleEdit = (index: number, row) => {
  message(`您修改了第 ${index} 行，数据为：${JSON.stringify(row)}`, {
    type: "success"
  });
};

const handleDelete = (index: number, row) => {
  message(`您删除了第 ${index} 行，数据为：${JSON.stringify(row)}`);
};

const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns(handleEdit, handleDelete);

const { formColumns } = useForm();
</script>

<template>
  <div class="my-2 flex justify-end">
    <el-button
      type="primary"
      :icon="useRenderIcon('ep:circle-plus')"
      @click="handleOpen"
      >新建</el-button
    >
  </div>
  <From
    v-model:visible="dialogVisible"
    v-model:values="formValues"
    :columns="formColumns"
    :is-update="isUpdate"
  />
  <pure-table
    ref="tableRef"
    border
    adaptive
    :adaptiveConfig="adaptiveConfig"
    row-key="id"
    alignWhole="center"
    showOverflowTooltip
    :loading="loading"
    :loading-config="loadingConfig"
    :data="
      dataList.slice(
        (pagination.currentPage - 1) * pagination.pageSize,
        pagination.currentPage * pagination.pageSize
      )
    "
    :columns="columns"
    :pagination="pagination"
    @page-size-change="onSizeChange"
    @page-current-change="onCurrentChange"
  />
</template>
