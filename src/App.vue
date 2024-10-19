<template>
  <div id="head-bg"></div>
  <div>
    <Transition>
      <div class="preloader" v-if="isPreloader">
        <Preloader />
      </div>
    </Transition>

    <DefaultLayout>
      <Toast />
      <router-view />
    </DefaultLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Toast from "primevue/toast";
import DefaultLayout from "@/components/DefaultLayout.vue";
import { addDeviceToken } from "@/services/User/addDeviceToken";
import Preloader from "@/pages/Preloader";

import { PushNotifications } from "@capacitor/push-notifications";
import { Device } from "@capacitor/device";

const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    throw new Error("User denied permissions!");
  }

  await deviceToken();
};

const isToken = ref(false);
const deviceToken = async () => {
  await PushNotifications.addListener("registration", async (token) => {
    localStorage.setItem("deviceToken", token.value);
    if (!isToken.value) {
      const platform = (await Device.getInfo()).platform;

      addDeviceToken(token.value, platform).then(({ status }) => {
        if (status === 200) {
          isToken.value = true;
        }
      });
    }
  });
};

const isPreloader = ref(true);
onMounted(() => {
  registerNotifications();

  setTimeout(() => {
    isPreloader.value = false;
  }, 1000);
});
</script>

<style scoped>
.preloader {
  position: fixed;
  z-index: 999999;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #fff;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
