<script setup lang="ts">
declare global {
  interface Window {
    grecaptcha: any;
  }
}

import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import iconZnak from "@//assets/icons/Значок.svg";
import iconMail from "@//assets/icons/mail_feedback-icon.svg";
import iconProfile from "@//assets/icons/profile_feedback.svg";
import iconSubtract from "@//assets/icons/subtract_feedback.svg";
import iconTel from "@//assets/icons/tel_feedback.svg";
import iconRight from "@//assets/icons/right_icon.svg";

const toast = useToast();
const router = useRouter();

const nameField = ref("");
const emailField = ref("");
const phoneField = ref("");
const commentField = ref("");
const agreePolicy = ref(false);
const MAX_COMMENT_LENGTH = 1000;
const commentLength = computed(() => commentField.value.length);

const recaptchaWidgetId = ref<number | null>(null);

function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("recaptcha-script")) {
      return resolve();
    }
    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src =
      "https://www.google.com/recaptcha/api.js?hl=ru&onload=onRecaptchaLoadCallback&render=explicit";
    script.async = true;
    script.defer = true;
    (window as any).onRecaptchaLoadCallback = () => {
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(() => {
  loadRecaptchaScript()
    .then(() => {
      recaptchaWidgetId.value = window.grecaptcha.render(
        "recaptcha-container",
        {
          sitekey: "6LchatwqAAAAAFtvgAVND-B-qmgWTZ8BUbao3YMo",
          callback: onRecaptchaVerified,
        }
      );
    })
    .catch((error) => {
      console.error("Ошибка загрузки reCAPTCHA:", error);
    });
});

function onRecaptchaVerified(response: string) {
  console.log("reCAPTCHA пройдена, ответ:", response);
}

const handleSubmit = async () => {
  if (!nameField.value || !emailField.value || !commentField.value) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, заполните все обязательные поля.",
      life: 3000,
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailField.value)) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Неверный формат email.",
      life: 3000,
    });
    return;
  }

  if (!agreePolicy.value) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Вы должны согласиться с политикой конфиденциальности.",
      life: 3000,
    });
    return;
  }

  let recaptchaResponse = "";
  if (window.grecaptcha && recaptchaWidgetId.value !== null) {
    recaptchaResponse = window.grecaptcha.getResponse(recaptchaWidgetId.value);
  }
  if (!recaptchaResponse) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Пожалуйста, подтвердите, что вы не робот.",
      life: 3000,
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", nameField.value);
    formData.append("email", emailField.value);
    formData.append("phone", phoneField.value);
    formData.append("comment", commentField.value);
    formData.append("g-recaptcha-response", recaptchaResponse);

    const response = await fetch(
      "https://idykvrachy.ru/api/service/sendAskForm",
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    if (result.success) {
      toast.add({
        severity: "success",
        summary: "Успех",
        detail: "Форма успешно отправлена!",
        life: 3000,
      });
      if (window.grecaptcha && recaptchaWidgetId.value !== null) {
        window.grecaptcha.reset(recaptchaWidgetId.value);
      }
      router.back();
    } else {
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: "Ошибка при отправке формы. Попробуйте ещё раз.",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Произошла ошибка при отправке. Попробуйте позже.",
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">Свяжитесь с нами</h1>
    <div class="info-box">
      <img :src="iconZnak" alt="" class="info-icon" />
      <p>Пожалуйста, заполните все формы, отмеченные "звездочкой".</p>
    </div>
    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label><span class="required">*</span> Ваше Имя</label>
        <div class="input-wrapper">
          <input
            v-model="nameField"
            type="text"
            placeholder="Введите ваше имя"
          />
          <div class="input-icon">
            <img :src="iconProfile" alt="" />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label><span class="required">*</span> E-mail</label>
        <div class="input-wrapper">
          <input
            v-model="emailField"
            type="text"
            placeholder="example@mail.com"
          />
          <div class="input-icon">
            <img :src="iconMail" alt="" />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Телефон</label>
        <div class="input-wrapper">
          <input
            v-model="phoneField"
            type="tel"
            placeholder="+7 (999) 999 99 99"
            v-mask="'+7 (###) ###-##-##'"
          />
          <div class="input-icon">
            <img :src="iconTel" alt="" />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label><span class="required">*</span> Комментарий</label>
        <textarea
          v-model="commentField"
          :maxlength="MAX_COMMENT_LENGTH"
          rows="4"
          placeholder="Введите текст"
        ></textarea>
        <div class="comment-hint">
          <span>
            <img :src="iconSubtract" alt="" />
            Длина сообщения не может быть длиннее {{ MAX_COMMENT_LENGTH }}
          </span>
          <span>{{ commentLength }}/{{ MAX_COMMENT_LENGTH }}</span>
        </div>
      </div>

      <div class="checkbox-group">
        <input v-model="agreePolicy" type="checkbox" id="policy" />
        <label for="policy">
          Соглашаюсь с условиями
          <RouterLink to="/privatepolicy"
            >Политикой конфиденциальности</RouterLink
          >
        </label>
      </div>
      <div class="form-group">
        <div id="recaptcha-container"></div>
      </div>
      <button type="submit" class="submit-button">
        Отправить<img :src="iconRight" alt="" />
      </button>
    </form>
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  box-sizing: border-box;
}
.page-title {
  margin-top: 6px;
  font-size: 18px;
  font-weight: 700;
  line-height: 23px;
  color: #308492;
}
.info-box {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #e5fdff;
  border-left: 4px solid #00becc;
  padding: 11px 16px;
  border-radius: 8px;
  margin-top: 24px;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
}
.info-box p {
  color: #008f99;
  font-size: 12px;
  font-weight: normal;
}
.info-icon {
  width: 40px;
  height: 40px;
}
.contact-form {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #444;
}
.input-wrapper {
  position: relative;
}
.input-wrapper input,
.form-group textarea {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  box-sizing: border-box;
  outline: none;
  background-color: #e5fdff;
  color: #00becc;
  font-size: 12px;
}
.input-wrapper input:focus,
.form-group textarea:focus {
  border-color: #60a5fa;
}
.input-wrapper input::placeholder,
.form-group textarea::placeholder {
  font-size: 12px;
  color: #00becc;
}
.input-icon {
  width: 22px;
  height: 22px;
  color: #999;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
  padding: 2px;
}
.input-icon img {
  width: 100%;
}
.form-group textarea {
  resize: vertical;
}
.required {
  color: #e11d48;
  font-weight: bold;
}
.comment-hint {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
.comment-hint span {
  display: flex;
  gap: 10px;
  align-items: center;
  font-style: italic;
}
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border: 1.5px solid #00b9c2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.checkbox-group label a {
  color: black;
  text-decoration: underline;
}
.checkbox-group label {
  color: #4d4d4d;
}
.submit-button {
  background: #e76e70;
  color: #fff;
  padding: 14px 70px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}
.submit-button img {
  margin-top: 5px;
}
.submit-button:hover {
  background: #f86c6e;
}
</style>
