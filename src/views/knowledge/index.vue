<script setup lang="ts">
import { getApplicationList, deleteApplication } from "@/api/application";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { ref, onMounted, nextTick, reactive } from "vue";
import ListCard from "./src/components/ListCard.vue";
import ListDialogForm from "./src/components/ListDialogForm.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { useRouter } from "vue-router";

defineOptions({
  name: "CardList"
});

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

const INITIAL_DATA = {
  name: "",
  status: "",
  description: "",
  type: "",
  mark: ""
};

const pagination = ref({ current: 1, pageSize: 12, total: 0 });

let productList = reactive([]);
const dataLoading = ref(true);
const isEdit = ref(false);

const getCardListData = async () => {
  try {
    const { data } = await getApplicationList({
      page: pagination.value.current,
      page_size: pagination.value.pageSize
    });

    productList = data.list || [];

    // 更新分页信息
    pagination.value = {
      ...pagination.value,
      total: data.total
    };
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

onMounted(() => {
  getCardListData();
});

const handleRefreshProduct = () => {
  setTimeout(() => {
    getCardListData();
  }, 500);
};

const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const searchValue = ref("");

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1;
  getCardListData();
};

const onCurrentChange = (current: number) => {
  pagination.value.current = current;
  getCardListData();
};

const handleDeleteItem = product => {
  ElMessageBox.confirm(
    product
      ? `确认删除后${product.app_name}的所有应用信息将被清空, 且无法恢复`
      : "",
    "提示",
    {
      type: "warning"
    }
  )
    .then(async () => {
      const res = await deleteApplication(product.id);
      if (res.code === 0) {
        message("删除成功", { type: "success" });
        setTimeout(() => {
          getCardListData();
        }, 500);
        return;
      }

      message(res.msg, { type: "error" });
    })
    .catch(() => {});
};

const handleManageProduct = product => {
  formDialogVisible.value = true;
  isEdit.value = true;
  nextTick(() => {
    formData.value = { ...product };
  });
};

const handleOpenProduct = () => {
  formDialogVisible.value = true;
  isEdit.value = false;
  nextTick(() => {
    formData.value = { ...INITIAL_DATA };
  });
};

const router = useRouter();

const handleProductDetail = product => {
  // TODO: 跳转到应用详情页面
  console.log(product);
  router.push({ name: "Test", params: { id: product.id } });
};
</script>

<template>
  <div>
    <div class="w-full flex justify-end mb-4">
      <el-button :icon="useRenderIcon(AddFill)" @click="handleOpenProduct">
        新建应用
      </el-button>
      <!-- <el-input
        v-model="searchValue"
        style="width: 300px"
        placeholder="请输入应用名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              icon="ri:search-line"
            />
          </el-icon>
        </template>
      </el-input> -->
    </div>
    <div
      v-loading="dataLoading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <el-empty
        v-show="
          productList
            .slice(
              pagination.pageSize * (pagination.current - 1),
              pagination.pageSize * pagination.current
            )
            .filter(v =>
              v.app_name.toLowerCase().includes(searchValue.toLowerCase())
            ).length === 0
        "
        :description="`${searchValue} 应用不存在`"
      />
      <template v-if="pagination.total > 0">
        <el-row :gutter="16">
          <el-col
            v-for="(product, index) in productList
              .slice(
                pagination.pageSize * (pagination.current - 1),
                pagination.pageSize * pagination.current
              )
              .filter(v =>
                v.app_name.toLowerCase().includes(searchValue.toLowerCase())
              )"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <ListCard
              :product="product"
              @delete-item="handleDeleteItem"
              @manage-product="handleManageProduct"
              @product-detail="handleProductDetail"
            />
          </el-col>
        </el-row>
        <el-pagination
          v-model:currentPage="pagination.current"
          class="float-right"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[12, 24, 36]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </template>
    </div>
    <ListDialogForm
      v-model:visible="formDialogVisible"
      v-model:isEdit="isEdit"
      :data="formData"
      @refresh-product="handleRefreshProduct"
    />
  </div>
</template>
