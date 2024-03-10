<script setup lang="ts">
import { ref } from "vue";
import { useAppInfo } from "../stores/global";

const value = ref("label_1");
const list = ref([
  { value: "label_1", label: "首页", icon: "home" },
  { value: "label_2", label: "应用", icon: "app" },
  { value: "label_3", label: "聊天", icon: "chat" },
  { value: "label_4", label: "我的", icon: "user" },
]);

const showEventId = ref(null);
const hideEventId = ref(null);
const resJson = ref(undefined);

const appInfo = useAppInfo();

const handleGetLocation = async () => {
  try {
    const res = await UniBridge.getLocation();
    console.log({ res });
    resJson.value = res;
  } catch (error) {
    console.error(error);
  }
};

const handleScanCode = async () => {
  try {
    const res = await UniBridge.scanCode();
    console.log({ res });
    resJson.value = res;
  } catch (error) {
    console.error(error);
  }
};
const handleGetAppInfo = async () => {
  try {
    const res = await UniBridge.getAppInfo();
    console.log({ res });
    resJson.value = res;
  } catch (error) {
    console.error(error);
  }
};

const handleShow = (t: Boolean) => {
  try {
    if (t) {
      showEventId.value = UniBridge.addShowListener(() => {
        console.log("页面显示");
        resJson.value = "页面显示";
      });
    } else {
      UniBridge.removeShowListener(showEventId.value);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleHide = (t: Boolean) => {
  try {
    if (t) {
      hideEventId.value = UniBridge.addHideListener(() => {
        console.log("页面隐藏");
        resJson.value = "页面隐藏";
      });
    } else {
      UniBridge.removeHideListener(hideEventId.value);
    }
  } catch (error) {
    console.error(error);
  }
};

const obj = window.UniBridge;
</script>

<template>
  <t-navbar
    v-if="appInfo.client === 'H5'"
    title="H5 环境默认显示navbar"
    class="custom-navbar"
    left-arrow
  />
  <p v-if="appInfo.client === 'H5'" style="height: 42px"></p>
  <h1>当前环境：{{ appInfo.client }}</h1>
  <p>当前 APIs：{{ JSON.stringify(obj) }}</p>
  <div>返回值：{{ resJson }}</div>
  <p class="row">
    <t-button @click="handleGetAppInfo">App 信息</t-button>
    <t-button @click="handleGetLocation">获取定位</t-button>
    <t-button @click="handleScanCode">打开扫码</t-button>
  </p>
  <t-cell title="监听页面显示">
    <template #rightIcon>
      <t-switch @change="handleShow"></t-switch>
    </template>
  </t-cell>
  <t-cell title="监听页面隐藏">
    <template #rightIcon>
      <t-switch @change="handleHide"></t-switch>
    </template>
  </t-cell>
  <t-tab-bar v-model="value" shape="round" theme="tag" :split="false">
    <t-tab-bar-item v-for="item in list" :key="item.value" :value="item.value">
      <template #icon>
        <t-icon :name="item.icon" />
      </template>
    </t-tab-bar-item>
  </t-tab-bar>
</template>

<style scoped>
.custom-navbar {
  --td-navbar-bg-color: #0052d9;
  --td-navbar-color: #fff;
}
.row {
  display: flex;
  padding: 0 16px;
}

.row + .row {
  margin-top: 16px;
}

.t-button + .t-button {
  margin-left: 16px;
}
</style>
