<script setup lang="ts">
import { ref, onMounted } from "vue";
import back from "@assets/icons/back.png";
import dalee from "@assets/icons/dalee.png";
import setting from "@assets/icons/setting.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import { useRouter } from "vue-router";
import { getPatients } from "@//services/patients/getPatients";
import { deletePatient } from "@//services/patients/deletePatient";

const router = useRouter();

const user = JSON.parse(localStorage.getItem("userData") ?? "");
const token = user?.auth_token;

const userData = ref({
  token,
});

interface Patient {
  patient_id: string;
  patient_gender: string;
  patient_user: string;
  patient_last_name: string;
  patient_u_name: string;
  patient_second_name: string;
  patient_date_birth: string;
  patient_email: string;
  patient_phone: string;
  photo: string;
}

const patients = ref<Patient[]>([]);

const getPatientsHandler = async () => {
  const { data, status } = await getPatients(userData.value.token);
  if (status === 200 && data !== null) {
    patients.value = data;
  } else {
    console.log("Ошибка сервера или данные отсутствуют");
    patients.value = [];
  }
};

const deletePatientHandler = async (patientId: string) => {
  const { status } = await deletePatient(userData.value.token, patientId);
  if (status === 200) {
    console.log("Пользователь успешно удален");
    getPatientsHandler();
  } else {
    console.log("Пользователь не найден");
  }
};

onMounted(getPatientsHandler);
</script>

<template>
  <PagesTemplate class="pb-[80px]">
    <div class="h-[15vh]"></div>
    <div class="flex">
      <img
        :src="back"
        class="mx-auto w-[11px] h-[16px] translate-y-[-70px] translate-x-[-60px] cursor-pointer"
        @click="router.back()"
      />
      <RouterLink
        to="/setting"
        class="mx-auto w-[43px] h-[40px] translate-y-[-80px] translate-x-[70px] cursor-pointer"
      >
        <img :src="setting" />
      </RouterLink>
    </div>

    <div class="flex justify-center">
      <div class="w-[354px] max-w-full pb-[20px]">
        <div class="flex justify-between pb-[31px]">
          <RouterLink to="/lcpatient"
            ><p
              class="text-xl font-bold leading-6 text-[#A3A3A3] cursor-pointer"
            >
              Профиль
            </p></RouterLink
          >
          <p class="text-xl font-bold leading-6 text-[#006879] cursor-pointer">
            Дети
          </p>
        </div>

        <div>
          <div class="flex flex-col gap-5">
            <div
              v-for="patient in patients"
              :key="patient.patient_id"
              class="w-full h-[158px] bg-[#F3F9FE] rounded-[10px]"
            >
              <RouterLink
                :to="{
                  path: '/lcchild',
                  query: {
                    token,
                    patientId: patient.patient_id,
                  },
                }"
                ><div
                  class="flex justify-around items-center cursor-pointer mt-[30px] mb-[20px]"
                >
                  <img
                    v-if="patient.photo"
                    class="w-[52px] h-[52px] object-cover rounded-full"
                    :src="`https://idykvrachy.ru${patient.photo}`"
                    alt="Аватар"
                  />

                  <svg
                    v-else
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="52px"
                    height="52px"
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
                  <div class="flex flex-col">
                    <p
                      class="text-[15px] font-semibold leading-[18px] text-[#00B9C2]"
                    >
                      {{ patient.patient_last_name }}
                      {{ patient.patient_u_name }}
                    </p>
                    <p
                      class="text-[15px] font-medium leading-[18px] text-[#2C3E4F]"
                    >
                      {{ patient.patient_date_birth }}
                    </p>
                  </div>
                  <img :src="dalee" class="w-[5px] h-[9px]" /></div
              ></RouterLink>
              <div class="flex justify-around mt-[12px]">
                <button
                  @click="() => deletePatientHandler(patient.patient_id)"
                  class="bg-[#00B9C2] text-white rounded-[7px] w-[102px] h-[28px] cursor-pointer"
                >
                  Удалить
                </button>
                <RouterLink
                  :to="{
                    path: '/lcchild',
                    query: {
                      token,
                      patientId: patient.patient_id,
                    },
                  }"
                >
                  <button
                    class="bg-[#00B9C2] text-white rounded-[7px] w-[166px] h-[28px] cursor-pointer"
                  >
                    Редактировать
                  </button>
                </RouterLink>
              </div>
            </div>
          </div>

          <div
            class="w-full h-[55px] rounded-[30px] border border-[#00B9C2] bg-white flex items-center justify-center mt-[34px]"
          >
            <p
              @click="router.push('/lcchild')"
              class="text-[20px] leading-[24px] font-bold text-[#00B9C2] cursor-pointer"
            >
              Добавить ребенка +
            </p>
          </div>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>
