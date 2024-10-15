<script setup lang="ts">
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import pen from "@assets/icons/lucide_pen.svg";
import img1 from "@assets/icons/iconamoon_profile-fill.svg";
import img2 from "@assets/icons/Group 7588.svg";
import img3 from "@assets/icons/222.svg";
import img4 from "@assets/icons/Group 7589.svg";
import img5 from "@assets/icons/mdi_calendar.svg";
import card from "@assets/icons/material-symbols_sd-card-alert-outline.svg";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { createReception } from "@//services/reception/createReception";
import Dialog from "primevue/dialog";
import Loader from "@//components/shared/Loader.vue";
import { getClinicInfo } from "@//services/service/getClinicInfo";
const router = useRouter();

const patientName = ref("");
const service = ref("");
const clinicName = ref("");
const clinicId = ref("");
const doctorName = ref("");
const appointmentDate = ref("");

onMounted(() => {
  const patientSecondName =
    localStorage.getItem("Patient_last_name") ?? "Фамилия не указана";
  const patientUName =
    localStorage.getItem("Patient_u_name") ?? "Имя не указано";

  const selectedService =
    localStorage.getItem("selectedService") ?? "Услуга не указана";
  const selectedClinic = JSON.parse(
    localStorage.getItem("selectedClinic") ?? "{}"
  );

  const selectedDoctor = JSON.parse(
    localStorage.getItem("selectedDoctor") ?? "{}"
  );
  const selectedTime =
    localStorage.getItem("selectedTime") ?? "Время не указано";

  const formatDateTime = (dateTimeString: string) => {
    const [datePart, timePart] = dateTimeString.split(" ");
    const [year, month, day] = datePart.split("-");
    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = timePart.slice(0, 5);
    return `${formattedDate} ${formattedTime}`;
  };

  const dateTime = formatDateTime(selectedTime);

  patientName.value = `${patientSecondName} ${patientUName}`.trim();
  clinicId.value = service.value = selectedService;
  clinicName.value = selectedClinic.name ?? "Клиника не указана";
  doctorName.value = selectedDoctor.name ?? "Имя врача не указано";
  appointmentDate.value = dateTime;
  clinicId.value = selectedClinic.id;
});

const submitForm = async () => {
  try {
    const selectedDoctor = JSON.parse(
      localStorage.getItem("selectedDoctor") ?? "{}"
    );
    const selectedToken = JSON.parse(localStorage.getItem("userData") ?? "{}");
    const selectedTime = localStorage.getItem("selectedTime");

    const data = {
      token: selectedToken.auth_token,
      doctorId: String(selectedDoctor.id),
      patientId: localStorage.getItem("selectedPatientId"),
      date: selectedTime,
      service: service.value,
    };

    const response = await createReception(data);

    if (response.status === 200) {
      console.log("Запись успешно создана:", response.data);
      router.push("/successfulentry");
    } else {
      console.error("Ошибка при создании записи:", response.data);
    }
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
};

const isLoading = ref(true);

const showModal = ref(false);
const clinicInfo = ref<any>(null);
const openClinicInfo = async (clinicId: string, event: Event) => {
  event.stopPropagation();
  isLoading.value = true;
  const { data, status } = await getClinicInfo(clinicId);
  if (status === 200 && data) {
    clinicInfo.value = data;
    showModal.value = true;
  } else {
    console.error("Ошибка при получении данных о клинике");
  }
  isLoading.value = false;
};

const closeModal = () => {
  showModal.value = false;
  clinicInfo.value = null;
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
          <div class="flex justify-between">
            <div class="flex items-center justify-center">
              <img :src="img1" class="translate-y-[-10px] w-[26px] h-[26px]" />
              <div class="ml-[20px]">
                <p class="font-semibold text-lg leading-[22px] text-[#006879]">
                  Пациент
                </p>
                <p class="font-light text-[18px] leading-[22px] text-[#5D5D5D]">
                  {{ patientName }}
                </p>
              </div>
            </div>
            <img :src="pen" />
          </div>
          <div class="flex justify-between">
            <div class="flex items-center justify-center">
              <img :src="img2" class="translate-y-[-10px] w-[26px] h-[26px]" />
              <div class="ml-[20px]">
                <p class="font-semibold text-lg leading-[22px] text-[#006879]">
                  Услуга
                </p>
                <p class="font-light text-[18px] leading-[22px] text-[#5D5D5D]">
                  {{ service }}
                </p>
              </div>
            </div>
            <img :src="pen" />
          </div>
          <div class="flex justify-between">
            <div class="flex items-center justify-center">
              <img :src="img3" class="translate-y-[-10px] w-[26px] h-[26px]" />
              <div class="ml-[20px]">
                <p class="font-semibold text-lg leading-[22px] text-[#006879]">
                  Клиника
                </p>
                <div class="flex justify-center items-center">
                  <p
                    class="font-light text-[18px] leading-[22px] text-[#5D5D5D]"
                  >
                    {{ clinicName }}
                  </p>
                  <img :src="card" class="ml-[15px]" />
                  <p
                    class="font-semibold text-[11px] leading-[13px] text-[#006879]"
                    @click.stop="openClinicInfo(clinicId, $event)"
                  >
                    О клинике
                  </p>
                </div>
              </div>
            </div>
            <img :src="pen" />
          </div>
          <div class="flex justify-between">
            <div class="flex items-center justify-center">
              <img :src="img4" class="translate-y-[-10px] w-[26px] h-[26px]" />
              <div class="ml-[20px]">
                <p class="font-semibold text-lg leading-[22px] text-[#006879]">
                  Врач
                </p>
                <div class="flex justify-center items-center">
                  <p
                    class="font-light text-[18px] leading-[22px] text-[#5D5D5D]"
                  >
                    {{ doctorName }}
                  </p>
                </div>
              </div>
            </div>
            <img :src="pen" />
          </div>
          <div class="flex justify-between">
            <div class="flex items-center justify-center">
              <img :src="img5" class="translate-y-[-10px] w-[26px] h-[26px]" />
              <div class="ml-[20px]">
                <p class="font-semibold text-lg leading-[22px] text-[#006879]">
                  Дата приёма
                </p>
                <p class="font-light text-[18px] leading-[22px] text-[#5D5D5D]">
                  {{ appointmentDate }}
                </p>
              </div>
            </div>
            <img :src="pen" />
          </div>
          <div class="flex items-center justify-center mt-[51px]">
            <div
              class="w-[305px] h-[55px] bg-[#00B9C2] rounded-[30px] flex items-center justify-center cursor-pointer"
              @click="submitForm"
            >
              <p class="font-bold text-xl leading-6 text-[#FFFFFF]">
                Подтвердить
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model:visible="showModal" modal class="w-[90%]">
      <template v-if="isLoading">
        <Loader />
      </template>

      <template v-else>
        <div v-if="clinicInfo">
          <h3 class="font-semibold text-[20px] text-center mb-4">
            {{ clinicInfo.clinic_name }}
          </h3>
          <p class="text-[15px] text-gray-700 mb-2">
            Оценка: {{ clinicInfo.clinic_rating }}
          </p>
          <img
            :src="'https://idykvrachy.ru' + clinicInfo.clinic_preview_picture"
            alt="clinic preview"
            class="w-full mb-4 rounded"
          />
          <div
            v-html="clinicInfo.clinic_preview_text"
            class="text-gray-700 text-[15px]"
          ></div>
        </div>

        <div v-else class="text-center">
          <p class="text-center text-gray-500 pt-[50px]">
            Информация о клинике недоступна.
          </p>
        </div>
      </template>

      <template #footer>
        <button
          @click="closeModal"
          class="p-button p-component p-button-danger"
        >
          Закрыть
        </button>
      </template>
    </Dialog>
  </PagesTemplate>
</template>
