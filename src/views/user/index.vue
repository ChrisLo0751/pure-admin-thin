<script setup>
import { ref, watch } from "vue";
import UserIcon from "@/assets/svg/user.svg";
import KeyIcon from "@/assets/svg/key.svg";
import LogoutIcon from "@/assets/svg/logout.svg";
import UserInfo from "./src/userInfo.vue";
import Table from "./src/components/crud/index.vue";

defineOptions({
  name: "User"
});

const selectedTab = ref(localStorage.getItem("selectedTab") || "personalInfo");

const user = {
  avatar: "path/to/avatar.png", // 替换为实际的头像路径
  email: "1591410@qq.com"
};

function selectTab(tab) {
  selectedTab.value = tab;
  localStorage.setItem("selectedTab", tab);
}

function logout() {
  // 执行退出逻辑
  console.log("Logout");
}

watch(selectedTab, newTab => {
  localStorage.setItem("selectedTab", newTab);
});
</script>

<template>
  <div class="profile-container">
    <aside class="sidebar">
      <ul>
        <li
          :class="{ active: selectedTab === 'personalInfo' }"
          @click="selectTab('personalInfo')"
        >
          <div class="icon">
            <UserIcon />
          </div>
          <span>个人信息</span>
        </li>
        <li
          :class="{ active: selectedTab === 'apiKey' }"
          @click="selectTab('apiKey')"
        >
          <div class="icon">
            <KeyIcon />
          </div>
          <span>API密钥</span>
        </li>
        <li :class="{ active: selectedTab === 'logout' }" @click="logout">
          <div class="icon">
            <LogoutIcon />
          </div>
          <span>退出</span>
        </li>
      </ul>
    </aside>
    <main class="content">
      <div v-if="selectedTab === 'personalInfo'" class="personal-info">
        <userInfo />
      </div>
      <div v-else-if="selectedTab === 'apiKey'">
        <div class="table-box">
          <div class="mb-4">
            <h4 class="title">API密钥管理</h4>
            <p class="sub-title">
              一个应用只能对应一个key，具体使用可<a class="link">查看文档</a>
            </p>
          </div>
          <Table />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  gap: 10px;
  height: calc(100vh - 50px);
}

.sidebar {
  width: 200px;
  padding: 20px;
  background-color: rgb(251 251 252 / 100%);
  border-radius: 10px 0 0 10px;
}

.sidebar ul {
  padding: 0;
  list-style: none;
}

.sidebar li {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 10px;
}

.sidebar li.active {
  font-weight: bold;
  color: var(--el-color-primary);
  background-color: rgb(227 234 254 / 100%);
}

.sidebar li.active .icon {
  border: 2px solid var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.icon {
  padding: 5px;
  margin-right: 8px;
  border: 1px solid #635555;
  border-radius: 50%;
}

.content {
  width: calc(100% - 200px);
  overflow: auto;
  background-color: rgb(251 251 252 / 100%);
  border-radius: 0 10px 10px 0;
}

.content .table-box {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
}

.title {
  font-weight: bolder;
}

.sub-title {
  font-size: 14px;
  color: #646161;
}

.link {
  color: var(--el-color-primary);
}

.personal-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-picture img {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  border-radius: 50%;
}

.user-details p {
  margin: 5px 0;
}

.reset-password {
  color: #3498db;
  text-decoration: none;
}
</style>
