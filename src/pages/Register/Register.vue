<template>
  <div>
    <MainTemplate>
      <div class="h-[15vh]"></div>
      <div class="px-4 hidden">
        <img :src="img" class="w-[225px] h-[248px] mx-auto" />
      </div>
    </MainTemplate>
    <h3
      class="flex text-lg font-semibold leading-5 text-[#006879] justify-center"
    >
      Регистрация
    </h3>
    <div class="flex justify-center">
      <div class="pt-[35px] w-[290px] pb-[40px]">
        <div class="flex justify-between">
          <div
            @click="setRoleType(1)"
            :class="[
              'w-[125px]',
              'h-[40px]',
              'flex',
              'justify-center',
              'items-center',
              'rounded-[7px]',
              'cursor-pointer',
              roleType === 1
                ? 'bg-[#00B9C2] text-white'
                : 'bg-[#E5F2FC] hover:bg-[#00B9C2]',
            ]"
          >
            <p>Пациент</p>
          </div>
          <div
            @click="setRoleType(2)"
            :class="[
              'w-[125px]',
              'h-[40px]',
              'flex',
              'justify-center',
              'items-center',
              'rounded-[7px]',
              'cursor-pointer',
              roleType === 2
                ? 'bg-[#00B9C2] text-white'
                : 'bg-[#E5F2FC] hover:bg-[#00B9C2]',
            ]"
          >
            <p>Врач</p>
          </div>
        </div>

        <select
          v-if="roleType === 2"
          v-model="specialization"
          @change="updateSpecialization"
          class="custom-select w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 pr-10 border border-[#00B9C2] focus:outline-none focus:ring-2 focus:ring-[#00B9C2] transition duration-150 ease-in-out shadow-sm"
        >
          <option value="" disabled hidden>Выберите специализацию</option>
          <option
            v-for="spec in specializations"
            :key="spec.spec_id"
            :value="spec.spec_id"
          >
            {{ spec.name }}
          </option>
        </select>

        <input
          v-model="name"
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="Имя"
        />
        <p v-if="nameError" class="text-red-500 text-sm">
          Пожалуйста, введите ваше имя
        </p>

        <input
          v-model="email"
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="Адрес эл. почты"
        />
        <p v-if="emailError" class="text-red-500 text-sm">
          Пожалуйста, введите корректный адрес эл. почты
        </p>

        <input
          type="tel"
          v-model="phone"
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          v-mask="'+7 (###) ###-##-##'"
          placeholder="Телефон"
        />
        <p v-if="phoneError" class="text-red-500 text-sm">
          Пожалуйста, введите номер телефона
        </p>

        <input
          v-model="password"
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          type="password"
          placeholder="Пароль"
        />
        <p v-if="passwordError" class="text-red-500 text-sm">
          Пароль должен содержать не менее 6 символов
        </p>

        <input
          v-if="isCodeSent"
          v-model="code"
          class="w-full h-10 bg-[#E5F2FC] mt-[18px] rounded-[10px] pl-3 focus:outline-none focus:ring-2 focus:ring-[#00B9C2]"
          placeholder="Код подтверждения"
        />
        <p v-if="codeError" class="text-red-500 text-sm">
          Пожалуйста, введите код подтверждения
        </p>

        <p class="text-center text-[11px] text-[#666666] mt-[18px] pb-[20px]">
          Нажимая кнопку “Продолжить” я принимаю
          <u class="cursor-pointer" @click="openPDF">
            Пользовательское соглашение
          </u>
          и даю согласие на
          <u class="cursor-pointer" @click="openPDF">
            обработку персональных данных
          </u>
        </p>

        <div
          v-if="!isCodeSent"
          class="w-full h-[55px] rounded-[30px] bg-[#00B9C2] flex items-center justify-center"
          @click="sendEmailCode"
        >
          <p
            class="text-[20px] leading-[24px] font-bold text-white cursor-pointer"
          >
            Продолжить
          </p>
        </div>

        <div
          v-else
          class="w-full h-[55px] rounded-[30px] bg-[#00B9C2] flex items-center justify-center"
          @click="submitRegistration"
        >
          <p
            class="text-[20px] leading-[24px] font-bold text-white cursor-pointer"
          >
            Регистрация
          </p>
        </div>
        <RouterLink
          to="/auth"
          class="text-[13px] font-semibold leading-4 text-black mt-[20px] flex justify-center"
          >Есть аккаунт?
          <a
            class="ml- cursor-pointer font-bold text-[#00B9C2] text-[15px] leading-[18px] ml-1"
            >Войти</a
          >
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainTemplate from "@//components/shared/MainTemplate.vue";
import { useToast } from "primevue/usetoast";
import {
  sendEmailCodeApi,
  createUser,
  loginUser,
} from "@//services/Auth/RegisterService";
import { getAllSpecializations } from "@//services/service/getAllSpecializations";
import img from "@assets/secondSlide.png";
import privatePolicyPdf from "@/assets/privatepolicy.pdf";
import { updateDeviceToken } from "@/services/User/updateDeviceToken";

const router = useRouter();
const toast = useToast();

const roleType = ref(1);
const specialization = ref("");
const specializations = ref([]);
const name = ref("");
const email = ref("");
const phone = ref("");
const code = ref("");
const password = ref("");
const isCodeSent = ref(false);
const nameError = ref(false);
const emailError = ref(false);
const phoneError = ref(false);
const passwordError = ref(false);
const codeError = ref(false);

const setRoleType = (value) => {
  roleType.value = value;
  if (value === 2) {
    fetchSpecializations();
  } else {
    specialization.value = "";
  }
};

const openPDF = () => {
  window.open(
    "https://idykvrachy.ru//upload/legal/privatepolicy.pdf",
    "_blank"
  );
};

const updateSpecialization = (event) => {
  specialization.value = event.target.value;
};

const fetchSpecializations = async () => {
  try {
    const response = await getAllSpecializations();
    if (response.status === 200) {
      specializations.value = response.data;
    } else {
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: "Ошибка при загрузке специализаций",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Ошибка при загрузке специализаций",
      life: 3000,
    });
  }
};

const validateFields = () => {
  let isValid = true;
  nameError.value = !name.value;
  emailError.value = !email.value;
  phoneError.value = !phone.value;
  passwordError.value = password.value.length < 6;

  if (
    nameError.value ||
    emailError.value ||
    phoneError.value ||
    passwordError.value
  ) {
    isValid = false;
  }
  return isValid;
};

const sendEmailCode = async () => {
  if (!roleType.value) {
    toast.add({
      severity: "warn",
      summary: "Предупреждение",
      detail: "Выберите роль: Пациент или Врач",
      life: 3000,
    });
    return;
  }

  if (!validateFields()) {
    toast.add({
      severity: "warn",
      summary: "Предупреждение",
      detail: "Заполните все обязательные поля",
      life: 3000,
    });
    return;
  }

  try {
    const response = await sendEmailCodeApi(email.value);
    if (response.status === 200 && response.data.success !== false) {
      isCodeSent.value = true;
      toast.add({
        severity: "success",
        summary: "Успешно",
        detail: "Код отправлен на вашу почту",
        life: 3000,
      });
    } else {
      let errorMessage = response.data.error || "Ошибка отправки кода";
      console.log(errorMessage);
      if (errorMessage == "Аккаунт уже создан") {
        errorMessage =
          "Вы уже зарегистрированы в приложении. Войдите под своей учетной записью";
      }

      console.log(errorMessage);

      console.log(toast);

      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: errorMessage,
        life: 5000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Ошибка во время запроса кода",
      life: 3000,
    });
  }
};

const submitRegistration = async () => {
  if (!validateFields() || !isCodeSent.value) {
    toast.add({
      severity: "warn",
      summary: "Предупреждение",
      detail: "Пожалуйста, заполните все поля и подтвердите код",
      life: 3000,
    });
    return;
  }

  if (
    roleType.value === 2 &&
    (!specialization.value || specialization.value === "")
  ) {
    toast.add({
      severity: "warn",
      summary: "Предупреждение",
      detail: "Выберите специализацию врача",
      life: 3000,
    });
    return;
  }

  const userData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    code: code.value,
    password: password.value,
  };
  if (roleType.value === 2) {
    userData.specialization = specialization.value;
  }
  try {
    const response = await createUser(userData);

    if (
      response.status !== 200 ||
      (response.data && response.data.success === false)
    ) {
      const errorMessage = response.data?.error || "Ошибка регистрации";
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: errorMessage,
        life: 3000,
      });
      return;
    }

    toast.add({
      severity: "success",
      summary: "Успешно",
      detail: "Регистрация прошла успешно",
      life: 3000,
    });

    const loginResponse = await loginUser({
      login: email.value,
      password: password.value,
    });
    if (loginResponse.status === 200) {
      router.push("/lcpatient");
      updateDeviceToken();
    } else {
      toast.add({
        severity: "error",
        summary: "Ошибка авторизации",
        detail: "Не удалось войти в систему после регистрации",
        life: 3000,
      });
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Ошибка во время запроса регистрации";
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: errorMessage,
      life: 3000,
    });
  }
};
const logFormData = () => {
  const userData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    code: code.value,
    password: password.value,
  };
  if (roleType.value === 2) {
    userData.specialization = specialization.value;
  }
  console.log("Данные формы:", userData);
};
onMounted(() => {
  if (roleType.value === 2) {
    fetchSpecializations();
  }
});
</script>

<style scoped>
.p-toast {
  width: 90% !important;
  right: 15px !important;
  margin-right: auto !important;
  margin-left: auto !important;
}
</style>
