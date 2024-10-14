<script setup lang="ts">
import back from "@assets/icons/back.png";
import PagesTemplate from "@//components/shared/PagesTemplate.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { getPollDataByCategoryId } from "@//services/preparation/getPollDataByCategoryId";
import { DOMEN } from "@//consts";
import { usePreparationsStore } from "@//services/preparation/preparationsStore.ts";

interface Person {
  name: string;
  preview_text: string;
  preview_picture: string;
  uf_check_list?: any;
  uf_vote_id?: any;
}

const router = useRouter();
const { id } = useRoute().params;
const preparationsStore = usePreparationsStore();

const people = ref<Person[]>([]);

const getPollDataByCategoryIdHandler = async () => {
  const { data } = await getPollDataByCategoryId(id);

  if (!data) {
    console.log("Ошибка сервера");
    return;
  }

  people.value = data;
  preparationsStore.checklist = people.value[0]?.uf_check_list;
  preparationsStore.vote = people.value[0]?.uf_vote_id;
};

const savePersonToSession = (person: Person) => {
  localStorage.setItem("selectedPerson", JSON.stringify(person));
};

onMounted(getPollDataByCategoryIdHandler);
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
        <RouterLink
          to="/parents2"
          v-if="people.length > 0"
          @click.native="savePersonToSession(people[0])"
        >
          <div
            class="w-full flex justify-center items-center gap-[40px] mt-[24px]"
          >
            <div class="flex flex-col">
              <p
                class="font-semibold text-[24px] leading-[29px] text-[#016368]"
              >
                {{ people[0].name }}
              </p>
            </div>
            <img
              class="w-[132px] h-[132px]"
              :src="`${DOMEN}${people[0].preview_picture}`"
            />
          </div>
        </RouterLink>

        <RouterLink
          to="/parents"
          v-if="people.length > 1"
          @click.native="savePersonToSession(people[1])"
        >
          <div
            class="w-full flex justify-center items-center gap-[40px] mt-[24px]"
          >
            <img
              class="w-[132px] h-[132px]"
              :src="`${DOMEN}${people[1].preview_picture}`"
            />
            <div class="flex flex-col">
              <p
                class="font-semibold text-[24px] leading-[29px] text-[#016368]"
              >
                {{ people[1].name }}
              </p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </PagesTemplate>
</template>
