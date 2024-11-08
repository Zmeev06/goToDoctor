<script lang="ts" setup>
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { deleteAccount } from "@/services/User/deleteAccount";
import { useRouter } from "vue-router";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const confirmDelete = () => {
  confirm.require({
    message: "Вы точно хотите удалить аккаунт? Вернуть данные не получится",
    header: "Подтверждение",
    rejectProps: {
      label: "Отмена",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Удалить",
      severity: "danger",
    },
    accept: () => {
      fetchDeleteAccount();
    },
  });
};

const fetchDeleteAccount = async () => {
  const { data, status } = await deleteAccount();
  if (!(status === 200 && data.success)) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Что-то пошло не так",
      life: 3000,
    });

    return;
  }

  toast.add({
    severity: "success",
    summary: "Успешно",
    detail: "Аккаунт удален",
    life: 3000,
  });

  delete localStorage.userData;
  router.push("/auth");
};
</script>

<template>
  <div class="btn-wrap">
    <button @click="confirmDelete()" type="button">Удалить аккаунт</button>
  </div>

  <ConfirmDialog />
</template>

<style scoped>
.btn-wrap {
  width: 100%;
  text-align: center;
}
button {
  margin-top: 30px;
  color: rgb(201 70 70);
}
</style>
