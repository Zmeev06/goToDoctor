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
        Введите код
      </h3>
      <p class="text-white font-medium text-[15px] leading-[22px] mt-[16px]">
        Код подтверждения отправлен на почту pochta@email.ru
      </p>
    </div>

    <div class="flex justify-center">
      <div class="pt-[20px] w-[354px] max-w-full pb-[20px]">
        <div class="flex gap-[10px] justify-center items-center mt-[32px]">
          <input
            class="border w-[45px] h-[52px] rounded-[8px] text-center"
            type="number"
          />
          <input
            class="border w-[45px] h-[52px] rounded-[8px] text-center"
            type="number"
          />
          <input
            class="border w-[45px] h-[52px] rounded-[8px] text-center"
            type="number"
          />
          <input
            class="border w-[45px] h-[52px] rounded-[8px] text-center"
            type="number"
          />
          <input
            class="border w-[45px] h-[52px] rounded-[8px] text-center"
            type="number"
          />
          <input
            class="border w-[45px] h-[52px] rounded-[8px] text-center"
            type="number"
          />
        </div>
        <p
          class="font-medium text-[13px] leading-[16px] text-[#A4A5A5] mt-[32px] ml-[20px]"
        >
          Повторно отправить код (через 60 секунд)
        </p>

        <div
          class="w-full h-[55px] rounded-[30px] bg-[#00B9C2] flex items-center justify-center mt-[207px]"
        >
          <p
            class="text-[20px] leading-[24px] font-bold text-white cursor-pointer"
          >
            Продолжить
          </p>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>
