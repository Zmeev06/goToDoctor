<script setup lang="ts">
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import OneDoctor2 from "@//components/OneDoctor2/OneDoctor2.vue";
import colocol from "@assets/icons/mingcute_notification-fill.svg";
import { ref, onMounted, computed } from "vue";
import { getUserInfo } from "../../services/User/getUserInfo";
import { useRouter } from "vue-router";
import { getDoctorsCategory } from "@//services/main-doctors/getDoctorsCategory";
import { getDoctorsDataByCategoryId } from "@//services/main-doctors/getDoctorsDataByCategoryId";
import { getUserMessages } from "@/services/User/getUserMessages";
import { getPatients } from "@/services/patients/getPatients.ts";
import { getUserReceptions } from "@/services/reception/getUserReceptions";

import NotificationBlock from "@/components/NotificationBlock";

import { DOMEN } from "@//consts";
import { Slider } from "@/components/FirstPage/Slider";

import Carousel from "primevue/carousel";
import Popover from "primevue/popover";
import OverlayBadge from "primevue/overlaybadge";

const router = useRouter();

interface User {
  user_id: string;
  name: string;
  email: string;
  isDoctor: boolean;
  auth_token: string;
  personal_photo?: string;
  second_name?: string;
}

const user = ref<User | null>(null);
const doctorsCategory = ref();
const doctors = ref();

const fetchUserInfo = async () => {
  const { data, status } = await getUserInfo();
  if (status === 200) {
    if (data.success) {
      const currentIsDoctor = user.value?.isDoctor;

      user.value = {
        ...data.data,
        isDoctor: currentIsDoctor,
      };
    }
  } else {
    console.log("Ошибка на сервере");
  }
};

const fetchDoctorsCategory = async () => {
  const { data, status } = await getDoctorsCategory();
  if (status === 200) {
    doctorsCategory.value = data;
  } else {
    console.log("Ошибка на сервере");
  }
};

const fetchDoctorsDataByCategoryId = async (sectionId: string) => {
  const { data } = await getDoctorsDataByCategoryId(sectionId);

  if (data) {
    doctors.value = data;
  } else {
    console.log("Ошибка на сервере");
  }
};

const dataReceptions = ref<any[]>([]);
const fetchPatients = (token: string) => {
  getPatients(token).then(({ data: patients, status }) => {
    if (status != 200) return;

    patients?.forEach((patient) => {
      const data = {
        token,
        patientId: patient.patient_id,
        complete: "0",
      };
      getUserReceptions(data).then(({ data: receptions, status }) => {
        if (status != 200) return;

        dataReceptions.value.push(...receptions);
      });
    });
  });

  console.log(dataReceptions.value);
};

const routeToPush = computed(() => {
  return user.value?.isDoctor ? "/lcdoctor" : "/lcpatient";
});

const userMessages = ref([]);
const fetchUserMessages = () => {
  getUserMessages().then(({ data, status }) => {
    if (status != 200) return;

    userMessages.value = data.data ?? [];
  });
};
const notifyPopover = ref();
const toggleNotifyPopover = (e: Event) => {
  notifyPopover.value.toggle(e);
};

onMounted(() => {
  fetchUserInfo();
  fetchDoctorsCategory();
  fetchUserMessages();

  const userData = localStorage.getItem("userData");
  if (userData) {
    user.value = JSON.parse(userData) as User;
    fetchPatients(user.value.auth_token);
  } else {
    console.log("No user data found in localStorage");
  }
});
const formatDateTime = (dateTimeString: string) => {
  const [datePart, timePart] = dateTimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  const formattedDate = `${day}.${month}.${year}`;
  const formattedTime = timePart.slice(0, 5);
  return `${formattedDate} ${formattedTime}`;
};
</script>

<template>
  <PagesTemplate class="pb-[80px]" v-if="user">
    <div class="flex mt-[60px] items-center gap-[15%]">
      <div
        class="flex items-center gap-[8px]"
        @click="router.push(routeToPush)"
      >
        <img
          v-if="user.personal_photo"
          class="size-[50px] object-cover rounded-full"
          :src="`https://idykvrachy.ru${user.personal_photo}`"
          alt="Аватар"
        />
        <svg
          v-else
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="10%"
          height="10%"
          viewBox="0 0 512 512"
          preserveAspectRatio="xMidYMid meet"
          opacity="0.3"
        >
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path
              d="M2380 5114 c-19 -2 -78 -9 -130 -14 -330 -36 -695 -160 -990 -336
              -375 -224 -680 -529 -904 -904 -175 -292 -291 -632 -338 -990 -16 -123 -16
              -497 0 -620 82 -623 356 -1150 820 -1581 256 -239 575 -425 922 -539 274 -91
              491 -124 800 -124 228 0 329 9 530 50 689 141 1304 583 1674 1204 175 292 291
              632 338 990 16 123 16 497 0 620 -47 358 -163 698 -338 990 -224 375 -529 680
              -904 904 -289 173 -634 291 -980 336 -88 12 -438 21 -500 14z m385 -304 c583
              -54 1146 -347 1517 -790 487 -581 652 -1337 452 -2067 -77 -281 -213 -550
              -398 -785 -34 -43 -63 -78 -66 -78 -3 0 -19 43 -35 96 -85 284 -283 589 -512
              790 -144 126 -341 247 -518 319 l-40 16 35 26 c63 47 216 208 253 266 142 221
              202 460 177 704 -37 366 -251 681 -575 850 -674 350 -1488 -91 -1565 -850 -20
              -197 18 -404 106 -579 71 -141 189 -287 305 -375 27 -20 49 -40 49 -43 0 -3
              -33 -18 -73 -34 -270 -109 -540 -321 -729 -571 -109 -145 -213 -349 -264 -520
              -15 -52 -31 -95 -34 -95 -8 0 -122 148 -179 233 -63 94 -174 310 -219 425 -78
              198 -127 427 -144 675 -52 717 271 1445 839 1898 459 366 1041 542 1618 489z
              m5 -860 c257 -73 458 -274 536 -535 35 -119 37 -289 6 -406 -93 -347 -395
              -579 -752 -579 -357 0 -659 232 -752 579 -31 117 -29 287 6 406 88 296 316
              497 636 559 58 11 247 -3 320 -24z m-5 -1851 c310 -40 584 -178 821 -414 178
              -178 290 -358 362 -585 26 -81 67 -271 59 -275 -1 -1 -31 -24 -67 -52 -308
              -240 -679 -394 -1095 -454 -116 -17 -454 -17 -570 0 -416 60 -787 214 -1095
              454 -36 28 -66 51 -67 52 -2 1 4 39 12 84 91 517 461 950 961 1124 221 77 431
              98 679 66z"
            />
          </g>
        </svg>

        <p
          class="font-semiboldm text-sm leading-[18px] font-semibold text-[#040404] bg-white py-1 px-3 rounded shadow"
        >
          Здравствуйте, {{ `${user.name}` }}
        </p>
      </div>
      <div
        style="position: absolute; right: 20px"
        class="w-[25px]"
        @click="toggleNotifyPopover"
      >
        <OverlayBadge
          :value="userMessages.length"
          size="small"
          severity="danger"
        >
          <img :src="colocol" />
        </OverlayBadge>
      </div>
    </div>
    <p
      class="font-semibold text-[18px] leading-[18px] text-[#006879] mt-[18px]"
    >
      Предложения наших партнеров
    </p>

    <Popover ref="notifyPopover">
      <NotificationBlock :messages="userMessages" />
    </Popover>

    <Slider />
    <p
      class="mt-[37px] ml-[21px] font-semibold text-[15px] leading-6 text-[#006879]"
    >
      Все врачи
    </p>
    <div class="flex gap-2 overflow-auto py-2">
      <div
        class="h-[47px] rounded-[28px] bg-[#E5F2FC] mt-[28px] flex items-center justify-center gap-[12px] whitespace-nowrap px-6"
        v-for="(item, index) in doctorsCategory"
        @click="() => fetchDoctorsDataByCategoryId(item.category_id)"
        :key="index"
      >
        <img style="height: 50%" :src="`${DOMEN}${item.picture}`" />
        <p class="font-semibold text-[14px] leading-6 text-[#000000]">
          {{ item.name }}
        </p>
      </div>
    </div>

    <div v-if="doctors" class="flex justify-center items-center mt-[34px]">
      <div class="w-[361px] rounded-[14px] border shadow-lg gap-[px]">
        <div class="py-[16px] px-[17px]">
          <OneDoctor2
            v-for="(item, index) in doctors"
            :key="index"
            v-bind="{ ...item }"
          />
        </div>
      </div>
    </div>

    <p
      v-if="!doctors && dataReceptions"
      class="mt-[37px] ml-[21px] font-semibold text-[15px] leading-6 text-[#006879]"
    >
      Запись
    </p>
    <div v-if="!doctors && dataReceptions" class="mt-[34px]">
      <Carousel
        :value="dataReceptions"
        :numVisible="1"
        :numScroll="1"
        :showIndicators="false"
      >
        <template #item="{ data }">
          <router-link :to="'/treatment2/' + data.reception_id">
            <div
              class="flex flex-col px-[32px] py-[17px] rounded-[14px] border shadow"
            >
              <p class="font-semibold text-[20px] leading-6 text-[#00B9C2]">
                {{ data.doctor_specialization }}
              </p>
              <p class="font-normal text-[15px] leading-6 text-[#979797]">
                {{ formatDateTime(data.datetime) }}
              </p>
              <div class="flex justify-between mt-[20px]">
                <p
                  class="font-semibold text-[12px] leading-[15px] text-[#828282]"
                >
                  {{ data.doctor_clinic }}
                </p>
              </div>
            </div>
          </router-link>
        </template>
      </Carousel>
    </div>
  </PagesTemplate>
</template>

<style scoped>
.embla__text ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.embla__text ul li {
  position: relative;
  padding-left: 30px;
  margin-bottom: 10px;
}

.embla__text ul li::before {
  content: "—";
  position: absolute;
  left: 0;
  top: 0;
  color: #007bff;
}
.p-badge {
  border-radius: 100% !important;
  height: 20px !important;
  width: 20px !important;
}
</style>
