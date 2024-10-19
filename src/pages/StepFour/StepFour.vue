<script setup lang="ts">
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import OneDoctor from "@//components/OneDoctor/OneDoctor.vue";
import Loader from "@//components/shared/Loader.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import {
  getDoctorsDataByCategoryId,
  IDoctor,
} from "@//services/main-doctors/getDoctorsDataByCategoryId";

const router = useRouter();
const route = useRoute();
const doctors = ref<IDoctor[] | null>(null);
const isLoading = ref(true);
const categoryId = route.params.id;
const clinicId = route.params.clinic_id;

const getDoctorsDataByCategoryIdHandler = async () => {
  const { data } = await getDoctorsDataByCategoryId(categoryId, clinicId);

  if (!data) {
    console.log("Ошибка на сервере");
    isLoading.value = false;
    return;
  }

  doctors.value = data;
  isLoading.value = false;
};

const selectDoctor = (doctor: IDoctor) => {
  localStorage.setItem("selectedDoctor", JSON.stringify(doctor));
  router.push({
    path: "/stepfour",
    query: {
      id: doctor.id,
      services: JSON.stringify(doctor.service_list),
      doctorSpecialization: doctor.doctor_specialization,
    },
  });
};

onMounted(getDoctorsDataByCategoryIdHandler);
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
              Шаг 3
            </p>
          </div>
          <div v-if="isLoading" class="flex justify-center my-4">
            <Loader />
          </div>
          <div
            v-else-if="!doctors || doctors.length === 0"
            class="text-center text-xl"
          >
            На текущий момент клиника не ведёт записи, зайдите пожалуйста позже
          </div>
          <div
            v-else
            v-for="item in doctors"
            :key="item.id"
            @click="selectDoctor(item)"
            class="cursor-pointer"
          >
            <OneDoctor v-bind="{ ...item }" />
          </div>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>
