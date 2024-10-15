<script setup lang="ts">
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import { onMounted, ref } from "vue";
import card from "@assets/icons/material-symbols_sd-card-alert-outline.svg";
import { useRouter } from "vue-router";
import axios from "axios";
import Dialog from "primevue/dialog";
import Loader from "@//components/shared/Loader.vue";
interface DoctorSchedule {
  date: string;
  free: string[];
}

const router = useRouter();
const doctorName = ref("");
const doctorImage = ref("");
const categoryName = ref("");
const selectedService = ref("");
const clinicName = ref("");
const detailText = ref("");
const schedule = ref<DoctorSchedule[]>([]);
const selectedDate = ref("");
const selectedTime = ref("");
const isDatePickerOpen = ref(false);
const isTimePickerOpen = ref(false);
const availableTimes = ref<string[]>([]);

onMounted(() => {
  const selectedDoctor = JSON.parse(
    localStorage.getItem("selectedDoctor") || "{}"
  );
  const selectedCategory = JSON.parse(
    localStorage.getItem("selectedCategory") || "{}"
  );
  const selectedServiceValue = localStorage.getItem("selectedService") || "";
  const selectedClinic = JSON.parse(
    localStorage.getItem("selectedClinic") || "{}"
  );

  doctorName.value = selectedDoctor.name || "Имя не указано";
  doctorImage.value =
    `https://idykvrachy.ru${selectedDoctor.detail_picture}` || "";
  categoryName.value = selectedCategory.name || "Категория не указана";
  selectedService.value = selectedServiceValue || "Услуга не указана";
  clinicName.value = selectedClinic.name || "Клиника не указана";
  detailText.value = selectedDoctor.detail_text;

  getDoctorSchedule(selectedDoctor.id);
});

const getDoctorSchedule = async (doctorId: string) => {
  try {
    const response = await axios.get(
      `https://idykvrachy.ru/api/receptions/getDoctorReceptions?doctorId=${doctorId}`
    );
    schedule.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке расписания:", error);
  }
};

const openDatePicker = () => {
  isDatePickerOpen.value = true;
};

const selectDate = (date: string) => {
  selectedDate.value = date;
  const dateSchedule = schedule.value.find((item) => item.date === date);
  availableTimes.value = dateSchedule ? dateSchedule.free : [];
  isDatePickerOpen.value = false;
  isTimePickerOpen.value = true;
};

const selectTime = (time: string) => {
  selectedTime.value = time;
  isTimePickerOpen.value = false;
};

const bookAppointment = () => {
  localStorage.setItem("selectedDate", selectedDate.value);
  localStorage.setItem("selectedTime", selectedTime.value);
  router.push("/createreception");
};
const showModal = ref(false);
const isLoading = ref(false);

const openModal = (event: Event) => {
  event.stopPropagation();
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const formatDate = (date: string) => {
  if (!date) return false;

  const t = date.split("-");
  return `${t[2]}.${t[1]}.${t[0]}`;
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
              Шаг 5
            </p>
          </div>
          <div class="mt-[20px] flex flex-col gap-[18px]">
            <div class="w-full h-[134px] rounded-[13px] border flex shadow-lg">
              <img
                :src="doctorImage"
                class="w-[130px] h-full object-cover"
                style="border-radius: 0 0 50% 0"
              />
              <div>
                <div class="flex justify-between w-[210px] px-[7px] py-[8px]">
                  <div class="w-[210px] mt-[5px]">
                    <p
                      class="font-semibold text-[18px] leading-[18px] text-[#00B9C2]"
                    >
                      {{ doctorName }}
                    </p>
                    <p
                      class="font-medium text-[12px] leading-[14px] text-[#00B9C2] mt-[4px]"
                    >
                      {{ categoryName }}
                    </p>

                    <p
                      class="font-medium text-[12px] leading-[14px] text-[#8E969B] mt-[12px]"
                    >
                      {{ clinicName }}
                    </p>
                    <div class="flex justify-end items-end mt-[15px]">
                      <img :src="card" class="w-[12px] h-[12px]" />
                      <p
                        class="font-semibold text-[10px] leading-3 text-[#006879]"
                        @click="openModal"
                      >
                        О враче
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between">
            <button
              class="w-[163px] h-[37px] rounded-[27px] bg-[#00B9C2] text-white border shadow-lg"
              @click="openDatePicker"
            >
              {{ formatDate(selectedDate) || "Выбрать дату" }}
            </button>
            <button
              class="w-[163px] h-[37px] rounded-[27px] bg-[#FFFFFF] border shadow-lg"
              @click="isTimePickerOpen = true"
              :disabled="!selectedDate"
            >
              {{
                selectedTime
                  ? selectedTime.split(" ")[1].slice(0, 5)
                  : "Выбрать время"
              }}
            </button>
          </div>

          <Teleport to="body">
            <div
              v-if="isDatePickerOpen"
              class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <div
                class="bg-white rounded-lg p-4 max-w-md mx-auto max-h-[400px] overflow-auto"
              >
                <h3 class="text-lg font-semibold mb-4">Выберите дату</h3>
                <div class="flex flex-wrap gap-2 justify-around">
                  <button
                    v-for="(item, index) in schedule"
                    :key="index"
                    @click="selectDate(item.date)"
                    class="py-2 px-4 bg-[#00B9C2] text-white rounded w-full"
                  >
                    {{ formatDate(item.date) }}
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="isTimePickerOpen"
              class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <div
                class="bg-white rounded-lg p-4 max-w-md mx-auto max-h-[400px] overflow-auto"
              >
                <h3 class="text-lg font-semibold mb-4">Выберите время</h3>
                <div class="flex flex-wrap gap-2 justify-around">
                  <button
                    v-for="(time, timeIndex) in availableTimes"
                    :key="timeIndex"
                    @click="selectTime(time)"
                    class="py-2 px-4 bg-[#00B9C2] text-white rounded w-[30%]"
                  >
                    {{ time.split(" ")[1].slice(0, 5) }}
                  </button>
                </div>
              </div>
            </div>
          </Teleport>

          <div class="flex justify-center mt-[85px]">
            <button
              class="w-[305px] h-[55px] rounded-[30px] bg-[#00B9C2] text-white border shadow-lg"
              @click="bookAppointment"
            >
              Записаться
            </button>
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model:visible="showModal" modal class="w-[90%]">
      <template v-if="isLoading">
        <Loader />
      </template>
      <template v-else>
        <div v-if="detailText">
          <h3 class="font-semibold text-[20px] text-center mb-4">
            {{ doctorName }}
          </h3>

          <img
            :src="doctorImage"
            alt="doctor preview"
            class="w-full mb-4 rounded"
          />
          <div v-html="detailText" class="text-gray-700 text-[15px]"></div>
        </div>

        <div v-else class="text-center">
          <p class="text-center text-gray-500 pt-[50px]">
            Информация о враче недоступна.
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
