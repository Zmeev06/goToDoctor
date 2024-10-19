<script setup lang="ts">
import { ref, computed } from "vue";
import imgHome from "@//assets/icons/iconamoon_home-duotone.png";
import imgNotebook from "@//assets/icons/lets-icons_notebook-light.png";
import imgMedical from "@//assets/icons/solar_medical-kit-linear.png";
import imgProfile from "@//assets/icons/iconamoon_profile.png";

const userInfo = ref(JSON.parse(localStorage.getItem("userData") || "{}"));

const appointmentRoute = computed(() => {
  return userInfo.value.isDoctor ? "/reception" : "/appointmentwithspecialist";
});
const preparationRoute = computed(() => {
  return userInfo.value.isDoctor ? "/preparationdoc" : "/steponeappointment";
});
const medicalcardsRoute = computed(() => {
  return userInfo.value.isDoctor ? "/medicalcards2" : "/medicalcards";
});
const mainpageRoute = computed(() => {
  return userInfo.value.isDoctor ? "/mainpage2" : "/mainpage";
});
</script>

<template>
  <Teleport to="body">
    <div
      class="footer-panel flex justify-around pt-3 pb-6 w-full fixed bottom-0 bg-white"
    >
      <RouterLink :to="mainpageRoute">
        <div class="flex flex-col justify-center items-center cursor-pointer">
          <img :src="imgHome" />
          <p class="text-[11px] font-medium leading-[13px] text-[#A3A3A3]">
            Главная
          </p>
        </div>
      </RouterLink>
      <RouterLink :to="appointmentRoute">
        <div class="flex flex-col justify-center items-center cursor-pointer">
          <img :src="imgNotebook" />
          <p class="text-[11px] font-medium leading-[13px] text-[#A3A3A3]">
            Запись
          </p>
        </div>
      </RouterLink>

      <RouterLink :to="preparationRoute">
        <div class="flex flex-col justify-center items-center cursor-pointer">
          <img :src="imgMedical" />
          <p class="text-[11px] font-medium leading-[13px] text-[#A3A3A3]">
            Подготовка
          </p>
        </div>
      </RouterLink>
      <RouterLink :to="medicalcardsRoute">
        <div class="flex flex-col justify-center items-center cursor-pointer">
          <img :src="imgProfile" />
          <p class="text-[11px] font-medium leading-[13px] text-[#A3A3A3]">
            Медкарта
          </p>
        </div>
      </RouterLink>
    </div>
  </Teleport>
</template>
<style scoped>
img {
  height: 30px;
}
.footer-panel {
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
}
</style>
