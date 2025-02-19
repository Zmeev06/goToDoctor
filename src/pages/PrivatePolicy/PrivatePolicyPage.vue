<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import Loader from "@//components/shared/Loader.vue";
import back from "@assets/icons/back.png";

const router = useRouter();
const policyHTML = ref("");
const isLoading = ref(true);

const fetchPrivacyPolicy = async () => {
  try {
    const response = await fetch(
      "https://idykvrachy.ru/api/service/getStaticResource?typePage=legal"
    );
    if (response.ok) {
      const data = await response.json();
      const paragraphs = data.text
        .split(/\r\n/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => `<p>${line}</p>`)
        .join("");
      policyHTML.value = paragraphs;
    } else {
      console.error("Ошибка на сервере");
    }
  } catch (error) {
    console.error("Ошибка при загрузке политики конфиденциальности", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPrivacyPolicy();
});
</script>

<template>
  <PagesTemplate class="pb-[80px]">
    <div class="flex back-button-private">
      <img
        :src="back"
        class="w-[11px] h-[16px] cursor-pointer"
        @click="router.back()"
      />
    </div>

    <div class="flex justify-center px-4">
      <div class="w-full max-w-screen-lg pb-[20px]">
        <div class="flex flex-col gap-[22px] translate-y-[-10px]">
          <div class="flex justify-center items-center">
            <p class="font-semibold text-[14px] leading-[13px] text-black">
              Политика конфиденциальности
            </p>
          </div>
          <div v-if="isLoading" class="flex justify-center my-4">
            <Loader />
          </div>
          <div v-else class="prose">
            <div v-html="policyHTML"></div>
          </div>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>

<style>
.prose p {
  margin-bottom: 1em;
  line-height: 1.5;
  text-align: justify;
}
.back-button-private {
  height: 15vh;
  align-items: center;
}
.back-button-private img {
  margin-left: 20px;
}
.prose a {
  color: blue;
  text-decoration: none;
}
</style>
