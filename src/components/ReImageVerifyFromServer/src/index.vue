<script setup lang="ts">
import { watch, ref } from "vue";

defineOptions({
  name: "ReImageVerify"
});

interface Props {
  codeImage?: string;
}

interface Emits {
  (e: "refreshCode"): void; // 点击验证码时触发的事件，通知父组件获取新的验证码
}

// 定义组件的属性和事件
const props = withDefaults(defineProps<Props>(), {
  codeImage: "" // 默认值为空字符串
});
const emit = defineEmits<Emits>();

// 监听 props.base64Code 的变化，实时更新验证码图像
const imgSrc = ref(props.codeImage); // 显示用的图片源

watch(
  () => props.codeImage,
  newBase64Code => {
    imgSrc.value = newBase64Code; // 更新显示的图片
  }
);

// 暴露更新验证码的方法，父组件可通过此方法主动更新验证码
defineExpose({
  updateCode(newCode: string) {
    imgSrc.value = newCode; // 主动更新 imgSrc
  }
});
</script>

<template>
  <img
    :src="imgSrc"
    alt="验证码"
    width="120"
    height="38"
    class="codeImage"
    @click="emit('refreshCode')"
  />
</template>

<style lang="scss" scoped>
.codeImage {
  height: 38px;
  cursor: pointer;
}
</style>
