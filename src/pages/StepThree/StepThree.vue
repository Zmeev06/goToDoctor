<script setup lang="ts">
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import Loader from "@//components/shared/Loader.vue";
import ico from "@assets/icons/ico.png";
import star from "@assets/icons/star.svg";
import card from "@assets/icons/material-symbols_sd-card-alert-outline.svg";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { getAllClinics, IClinic } from "@//services/service/getAllClinics";
import { getClinicInfo } from "@//services/service/getClinicInfo";
import Dialog from "primevue/dialog";

const router = useRouter();
const clinics = ref<IClinic[]>([]);
const isLoading = ref(true);

const showModal = ref(false);
const clinicInfo = ref<any>(null);

const getAllClinicsHandler = async () => {
  const { data } = await getAllClinics();

  if (!data) {
    console.log("Ошибка на сервере");
    isLoading.value = false;
    return;
  }

  clinics.value = data;
  isLoading.value = false;
};

const selectClinic = (clinic: IClinic) => {
  localStorage.setItem("selectedClinic", JSON.stringify(clinic));
  router.push("/steptwo");
};

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

onMounted(getAllClinicsHandler);
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
              Шаг 1
            </p>
          </div>
          <div v-if="isLoading" class="flex justify-center my-4">
            <Loader />
          </div>
          <div v-else>
            <input type="text" name="search" placeholder="Клиника" />
            <div class="mt-[20px] flex flex-col gap-[18px]">
              <div
                v-for="item in clinics"
                :key="item.id"
                @click="selectClinic(item)"
                class="w-full px-[15px] py-[10px] rounded-[13px] shadow-lg flex justify-around items-center border cursor-pointer"
              >
                <img :src="ico" class="w-[44px] h-[52px]" />
                <div class="flex flex-col ml-2">
                  <h6
                    class="font-semibold text-[20px] leading-6 text-[#00B9C2]"
                  >
                    {{ item.name }}
                  </h6>
                  <div class="flex items-center justify-center mt-[8px]">
                    <div class="flex justify-between">
                      <div
                        class="flex"
                        @click.stop="openClinicInfo(item.id, $event)"
                      >
                        <img :src="card" />
                        <p
                          class="w-[100px] font-normal text-xs leading-[14px] text-[#2C3E4F] cursor-pointer"
                        >
                          О клинике
                        </p>
                      </div>
                      <p
                        class="font-normal text-xs leading-[14px] text-[#2C3E4F] ml-[28px]"
                      >
                        Оценка:
                      </p>
                      <p
                        class="font-medium text-[15px] leading-[18px] text-[#2C3E4F] ml-1"
                      >
                        {{ item.clinic_rating }}
                      </p>
                      <img :src="star" />
                    </div>
                  </div>
                </div>
              </div>
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
