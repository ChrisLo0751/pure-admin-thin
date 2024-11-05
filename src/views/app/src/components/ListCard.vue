<script setup lang="ts">
import { computed, PropType } from "vue";
import BotIcon from "@/assets/svg/bot.svg";
import More2Fill from "@iconify-icons/ri/more-2-fill";

defineOptions({
  name: "ReCard"
});

interface CardProductType {
  type: number; // 默认为 0，或者可以按需要进行调整
  isSetup: boolean; // 可能基于实际逻辑判断是否设置完成，可以用 boolean
  app_description: string; // app_description
  app_name: string; // app_name
  appId: string; // app_id
  createdAt: string; // created_at
  autoReply: number; // auto_reply
  knowledgeId: number; // knowledge_id
  knowledgeName: number; // knowledge_name
}

const props = defineProps({
  product: {
    type: Object as PropType<CardProductType>
  }
});

const product = computed(() => props.product);

const emit = defineEmits(["manage-product", "delete-item", "product-detail"]);

const handleClickManage = (product: CardProductType) => {
  emit("manage-product", product);
};

const handleClickDelete = (product: CardProductType) => {
  emit("delete-item", product);
};

const handleClick = (product: CardProductType) => {
  emit("product-detail", product);
};
</script>

<template>
  <div class="list-card-item" @click="handleClick(product)">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between">
        <div class="list-card-item_detail--logo">
          <BotIcon />
        </div>
        <div class="list-card-item_detail--operation">
          <el-tag
            color="#00a870"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            应用
          </el-tag>
          <el-dropdown trigger="click" :disabled="false">
            <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
            <template #dropdown>
              <el-dropdown-menu :disabled="false">
                <el-dropdown-item @click="handleClickManage(product)">
                  管理
                </el-dropdown-item>
                <el-dropdown-item @click="handleClickDelete(product)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-row>
      <p class="list-card-item_detail--name text-text_color_primary">
        {{ product && product.app_name }}
      </p>
      <p class="list-card-item_detail--desc text-text_color_regular">
        {{ product && product.app_description }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 32px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      font-size: 26px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
