<script setup lang="ts">
import back from "@assets/icons/back.png";
import OnePatient from "@//components/OnePatient/OnePatient.vue";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import Loader from "@//components/shared/Loader.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { getPatients, IPatient } from "@//services/patients/getPatients";
import { getUserInfo } from "../../services/User/getUserInfo";
import { useToast } from "primevue/usetoast";

const patients = ref<IPatient[]>();
const user = ref();
const toast = useToast();
const token = JSON.parse(localStorage.getItem("userData") ?? "")?.auth_token;
const router = useRouter();
const isLoading = ref(true);

const fetchUserInfo = async () => {
  const { data, status } = await getUserInfo();
  if (status === 200 && data.success) {
    user.value = data.data;
  }
};

const getPatientsHandler = async () => {
  const { data } = await getPatients(token);

  if (!data) {
    console.log("Ошибка сервера");
    isLoading.value = false;
    return;
  }

  patients.value = data;
  isLoading.value = false;
};

const checkUserData = (item: IPatient) => {
  if (!user.value) return;
  const missingFields = [];

  if (!user.value.name) {
    missingFields.push("имя");
  }
  if (!user.value.last_name) {
    missingFields.push("фамилию");
  }
  if (!user.value.personal_phone) {
    missingFields.push("номер телефона");
  }

  if (missingFields.length > 0) {
    const message = `Пожалуйста, заполните следующие поля: ${missingFields.join(
      ", "
    )}.`;
    toast.add({
      severity: "warn",
      summary: "Предупреждение",
      detail: message,
      life: 3000,
    });
    router.push({ path: "/lcpatient" });
    return;
  }
  localStorage.setItem("selectedPatientId", item.patient_id);
  router.push({ path: "/stepone", query: { patient_id: item.patient_id } });
};

const savePatientId = (
  patientId: string,
  patient_last_name: string,
  patient_u_name: string
) => {
  try {
    localStorage.setItem("selectedPatientId", patientId);
    localStorage.setItem("Patient_last_name", patient_last_name);
    localStorage.setItem("Patient_u_name", patient_u_name);
    console.log(
      "Patient ID сохранен:",
      localStorage.getItem("selectedPatientId")
    );
  } catch (error) {
    console.error("Ошибка сохранения patient_id в localStorage:", error);
  }
};

onMounted(() => {
  fetchUserInfo();
  getPatientsHandler();
});
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
        <div class="flex justify-center items-center">
          <p class="font-semibold text-[15px] leading-[18px] text-[#006879]">
            Кого записать к специалисту?
          </p>
        </div>
        <div class="mt-[26px]">
          <div v-if="isLoading" class="flex justify-center my-4">
            <Loader />
          </div>
          <div v-else>
            <div
              v-for="item in patients"
              :key="item.patient_id"
              @click="checkUserData(item)"
              class="cursor-pointer"
            ></div>
            <RouterLink
              to="/stepone"
              v-for="item in patients"
              :key="item.patient_id"
              @click.native="
                savePatientId(
                  item.patient_id,
                  item.patient_last_name,
                  item.patient_u_name
                )
              "
            >
              <OnePatient
                v-bind:img="item.photo"
                v-bind:patient_last_name="item.patient_last_name"
                v-bind:patient_u_name="item.patient_u_name"
                v-bind:patient_phone="item.patient_phone"
              />
            </RouterLink>

            <p class="text-center text-gray-500 pt-[50px]">
              Хотите добавить ребенка?
            </p>
            <RouterLink to="/lcchild">
              <div
                class="w-full h-[55px] rounded-[30px] bg-[#00B9C2] flex items-center justify-center mt-[34px] cursor-pointer"
              >
                <p class="text-[20px] leading-[24px] font-bold text-white">
                  Добавить
                </p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>

<style scoped>
.p-toast {
  width: 90% !important;
  right: 15px !important;
  margin-right: auto !important;
  margin-left: auto !important;
}
</style>
