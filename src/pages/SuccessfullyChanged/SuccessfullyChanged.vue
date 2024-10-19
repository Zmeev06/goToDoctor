<script setup lang="ts">
import fon from "@assets/Fon.png";
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
</script>

<template>
  <PagesTemplate class="w-full">
    <Teleport to="#head-bg">
      <div class="h-[15vh]">
        <img :src="fon" class="mt-[43px] mx-auto w-full" />
      </div>
    </Teleport>
    <div class="flex">
      <img
        :src="back"
        class="w-[11px] h-[16px] translate-y-[-110px] translate-x-[30px] cursor-pointer"
      />
    </div>
    <div class="ml-[34px] translate-y-[-70px]">
      <h3 class="text-[32px] font-semibold leading-10 text-[#2C3E4F]">
        Номер успешно изменен
      </h3>
      <p
        class="text-[#2C3E4F] font-medium text-[15px] leading-[22px] mt-[16px]"
      >
        Вернуться в профиль
      </p>
    </div>

    <div class="flex justify-center">
      <div class="pt-[20px] w-[354px] max-w-full pb-[20px]">
        <div
          class="w-full h-[55px] rounded-[30px] bg-[#00B9C2] flex items-center justify-center"
        >
          <p
            class="text-[20px] leading-[24px] font-bold text-white cursor-pointer"
          >
            Вернуться
          </p>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>
