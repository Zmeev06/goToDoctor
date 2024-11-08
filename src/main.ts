import { createApp } from "vue";
import { router, store } from "./providers";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import { ru } from "./localeConfig";
import Toast from "primevue/toast";
// @ts-ignore
import VueTheMask from "vue-the-mask";

import Aura from "@primevue/themes/aura";

const app = createApp(App);

app
  .use(router)
  .use(store)
  .use(PrimeVue, {
    ripple: true,
    locale: ru,
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: "",
      },
    },
  })
  .use(ToastService)
  .use(ConfirmationService)
  .use(VueTheMask)
  .mount("#app");

app.component("Toast", Toast);
