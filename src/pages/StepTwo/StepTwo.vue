<script setup lang="ts">
import { ref, onMounted } from "vue";
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import Loader from "@//components/shared/Loader.vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const services = ref<string[]>([]);

onMounted(() => {
  if (route.query.services) {
    services.value = JSON.parse(route.query.services as string);
  }
});

const selectService = (service: string) => {
  localStorage.setItem("selectedService", service);
  router.push("/stepfive");
};
</script>

<template>
  <PagesTemplate class="pb-[80px]">
    <div class="h-[15vh]"></div>
    <div class="flex">
      <img
        :src="back"
        class="mx-auto w-[11px] h-[16px] translate-y-[-70px] translate-x-[-165px] cursor-pointer"
        @click="router.back()"
      />
    </div>
    <div class="flex justify-center">
      <div class="w-[354px] max-w-full pb-[20px]">
        <div class="flex flex-col gap-[22px] translate-y-[-10px]">
          <div class="flex justify-center items-center">
            <p class="font-semibold text-[14px] leading-[13px] text-black">
              Шаг 4
            </p>
          </div>
          <div v-if="isLoading" class="flex justify-center my-4">
            <Loader />
          </div>
          <div v-else>
            <input type="text" name="search" placeholder="Услуги" />
            <div class="mt-[20px] flex flex-col gap-[18px]">
              <div
                v-for="service in services"
                :key="service"
                @click="selectService(service)"
                class="w-full h-[73px] rounded-[13px] border shadow-lg flex px-[12px] py-[10px] gap-[9px] cursor-pointer"
              >
                <div class="flex flex-col justify-center">
                  <p
                    class="font-semibold text-[15px] leading-[18px] text-[#00B9C2]"
                  >
                    {{ service }}
                  </p>
                  <p
                    class="font-medium text-[13px] leading-[18px] text-[#979797]"
                  >
                    {{ route.query?.doctorSpecialization }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>

<style scoped>
input[type="text"] {
  width: 100%;
  height: 49px;
  box-sizing: border-box;
  border: 1px solid #cdcdcd;
  border-radius: 10px;
  font-size: 19px;
  background-color: white;
  background-image: url("@assets/icons/Magnifier.svg");
  background-position: 10px;
  background-repeat: no-repeat;
  padding: 12px 20px 12px 50px;
}
</style>
