<script setup lang="ts">
import fon from "@assets/Fon.png";

import back from "@assets/icons/back.png";
import setting from "@assets/icons/setting.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { getUserInfo } from "../../services/User/getUserInfo";
import { updateUser } from "@//services/User/updateUser";

const router = useRouter();

const user = ref({});

const fetchUserInfo = async () => {
  const { data, status } = await getUserInfo();
  if (status === 200) {
    if (data.success) {
      user.value = data.data;
      user.value.birthday = data.data.birthday
        ? data.data.birthday.split(".").join("-")
        : null;
    }
  }
};

watch(
  user,
  (newVal) => {
    if (newVal && newVal.personal_gender) {
      user.value.gender = newVal.personal_gender;
    }
  },
  { deep: true }
);

function UploadAvatar(event: any) {
  const file = event.target.files[0];
  user.value.personal_photo = file;

  const reader = new FileReader();

  reader.onload = (e) => {
    user.value.personal_photo_preview = e.target?.result;
  };

  reader.readAsDataURL(file);
}

onMounted(() => {
  fetchUserInfo();
});

const updateUserHandler = async () => {
  const { data, status } = await updateUser(user.value);
  if (status === 200) {
    console.log(data);
    location.reload();
  } else {
    console.log("Ошибка сервера");
  }
};

const handleInput = (event) => {
  let inputValue = event.target.value;

  inputValue = inputValue.replace(/[^0-9.]/g, "");

  if (inputValue.length >= 3 && inputValue[2] !== ".") {
    inputValue = inputValue.slice(0, 2) + "." + inputValue.slice(2);
  }
  if (inputValue.length >= 6 && inputValue[5] !== ".") {
    inputValue = inputValue.slice(0, 5) + "." + inputValue.slice(5);
  }

  if (inputValue.length >= 2) {
    const day = parseInt(inputValue.slice(0, 2), 10);
    if (day < 1 || day > 31) {
      inputValue = inputValue.slice(0, 1);
    }
  }

  if (inputValue.length >= 5) {
    const month = parseInt(inputValue.slice(3, 5), 10);
    if (month < 1 || month > 12) {
      inputValue = inputValue.slice(0, 4);
    }
  }

  if (inputValue.length === 10) {
    const year = parseInt(inputValue.slice(6, 10), 10);
    if (year < 1900 || year > new Date().getFullYear()) {
      inputValue = inputValue.slice(0, 6);
    }
  }

  user.value.birthday = inputValue;
};

const logout = () => {
  delete localStorage.userData;
  router.push("/auth");
};
</script>

<template>
  <PagesTemplate class="pb-[80px]">
    <Teleport to="#head-bg">
      <div class="h-[15vh]">
        <img :src="fon" class="mt-[43px] mx-auto w-full" />
      </div>
    </Teleport>
    <div class="flex justify-between w-full relative">
      <img
        :src="back"
        class="absolute top-[-120px] left-4 w-[11px] h-[16px] cursor-pointer"
        @click="router.back()"
      />
      <RouterLink
        to="/setting"
        class="absolute top-[-130px] right-4 w-[43px] h-[40px] cursor-pointer"
      >
        <img :src="setting" />
      </RouterLink>
    </div>
    <input
      type="file"
      id="avatar"
      @change="UploadAvatar"
      class="hidden"
      accept="image/*"
    />
    <label
      for="avatar"
      class="top-[-70px] translate-y-[-100px] translate-x-[15px]"
      style="position: relative"
    >
      <img
        v-if="user.personal_photo_preview"
        class="mx-auto size-[150px] object-cover rounded-full"
        :src="user.personal_photo_preview"
        alt="Аватар"
      />
      <img
        v-else-if="user.personal_photo"
        class="mx-auto size-[150px] object-cover rounded-full"
        :src="`https://idykvrachy.ru${user.personal_photo}`"
        alt="Аватар"
      />
      <svg
        v-else
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="50%"
        height="50%"
        viewBox="0 0 512 512"
        preserveAspectRatio="xMidYMid meet"
        opacity="0.3"
        class="mx-auto size-[150px] object-cover rounded-full"
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
    </label>

    <div class="flex justify-center">
      <div class="w-[354px] max-w-full pb-[20px] pt-[20px]">
        <div class="flex justify-between pb-[31px]">
          <p class="text-xl font-bold leading-6 text-[#006879] cursor-pointer">
            Профиль
          </p>
          <RouterLink to="/patientschildren"
            ><a
              class="text-xl font-bold leading-6 text-[#A3A3A3] cursor-pointer"
              >Дети</a
            ></RouterLink
          >
        </div>
        <input
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="Иванов"
          v-model="user.last_name"
        />
        <input
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="Иван"
          v-model="user.name"
        />
        <input
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="Иванович"
          v-model="user.second_name"
        />
        <input
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] px-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="Дата рождения"
          v-model="user.birthday"
          @input="handleInput"
          maxlength="10"
        />

        <input
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="ivanov@mail.ru"
          v-model="user.email"
        />
        <input
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          v-mask="'+7 (###) ###-##-##'"
          placeholder="+ 7 (903) 465-37-26"
          v-model="user.personal_phone"
        />
        <div>
          <p
            class="text-[#A4A5A5] text-sm font-medium leading-4 mt-[23px] ml-[34px]"
          >
            Пол
          </p>
          <div class="flex gap-[17px] mt-[16px] ml-[10px]">
            <div class="flex gap-[10px]">
              <input
                class="bg-[#E5F2FC]"
                type="radio"
                name="personal_gender"
                value="F"
                v-model="user.personal_gender"
              />
              <p class="text-[#A4A5A5] text-sm font-medium leading-4">Жен.</p>
            </div>
            <div class="flex gap-[10px]">
              <input
                class="bg-[#E5F2FC]"
                type="radio"
                name="personal_gender"
                value="M"
                v-model="user.personal_gender"
              />
              <p class="text-[#A4A5A5] text-sm font-medium leading-4">Муж.</p>
            </div>
          </div>
          <div
            @click="updateUserHandler"
            class="w-full h-[55px] rounded-[30px] bg-[#00B9C2] flex items-center justify-center mt-[34px]"
          >
            <p
              class="text-[20px] leading-[24px] font-bold text-white cursor-pointer"
            >
              Сохранить
            </p>
          </div>

          <div
            @click="logout"
            class="w-full h-[55px] rounded-[30px] bg-[#c94646] flex items-center justify-center mt-[25px]"
          >
            <p
              class="text-[20px] leading-[24px] font-bold text-white cursor-pointer"
            >
              Выйти
            </p>
          </div>
        </div>
      </div>
    </div>
  </PagesTemplate>
</template>
<style scoped>
.p-datepicker-input {
  background: #e5f2fc;
  border: none;
  box-shadow: none;
}
</style>
