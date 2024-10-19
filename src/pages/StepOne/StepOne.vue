<script setup lang="ts">
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import Loader from "@//components/shared/Loader.vue";
import { useRouter } from "vue-router";
import { getDoctorsCategory } from "@//services/main-doctors/getDoctorsCategory";
import { onMounted, ref } from "vue";
import { DOMEN } from "@//consts";

const router = useRouter();
const doctorsCategory = ref();
const isLoading = ref(true);

const fetchDoctorsCategory = async () => {
  const { data, status } = await getDoctorsCategory();
  if (status === 200) {
    doctorsCategory.value = data;
  } else {
    console.log("Ошибка на сервере");
  }
  isLoading.value = false;
};

const selectCategory = (category: {
  category_id: string;
  name: string;
  picture: string;
}) => {
  const selectedClinic = JSON.parse(
    localStorage.getItem("selectedClinic") || "{}"
  );

  if (selectedClinic && selectedClinic.id) {
    localStorage.setItem("selectedCategory", JSON.stringify(category));
    router.push(`/stepthree/${category.category_id}/${selectedClinic.id}`);
  } else {
    console.log("Ошибка: Клиника не найдена в localStorage");
  }
};

onMounted(() => {
  fetchDoctorsCategory();
});
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
              Шаг 2
            </p>
          </div>
          <div v-if="isLoading" class="flex justify-center my-4">
            <Loader />
          </div>
          <div v-else>
            <input type="text" name="search" placeholder="Категория" />
            <div class="mt-[20px] flex flex-col gap-[18px]">
              <div
                v-for="item in doctorsCategory"
                :key="item.category_id"
                @click="selectCategory(item)"
                class="w-full h-[73px] rounded-[13px] border shadow-lg flex px-[12px] py-[10px] gap-[14px] cursor-pointer items-center"
              >
                <img class="h-[35px]" :src="`${DOMEN}${item.picture}`" />
                <p
                  class="font-semibold text-[15px] leading-[18px] text-[#00B9C2]"
                >
                  {{ item.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
