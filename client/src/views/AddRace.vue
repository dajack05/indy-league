<script setup lang="ts">
import { TokenCookie } from "@/Cookie";
import RaceService from "@/services/RaceService";
import { State } from "@/store/State";
import { UserClass } from "@ill/common";
import Cookies from "js-cookie";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();

const name = ref("");
const date = ref("");

const store = useStore<State>();

onMounted(() => {
    if (!store.state.token || store.state.user?.class !== UserClass.ADMIN) {
        useRouter().push("/");
    }
});

function cancel() {
  router.go(1);
}

async function submit() {
  await RaceService.add(name.value, date.value);
  router.push("/");
}

</script>

<template>
  <div class="container v-box center-x">
    <div class="v-box p-1 pl-4 pr-4 m-5 center-x bordered bg-light">
      <p class="title">Add Race</p>
      <div class="pt-4 pb-4">
        <div class="v-box">
          <div class="input-group">
            <label>Race Name</label>
            <input v-model="name" class="input" type="text" placeholder="Required" />
          </div>
          <div class="input-group">
            <label>Start Time/Date</label>
            <input v-model="date" class="input" type="date" />
          </div>
        </div>
      </div>
      <div class="h-box">
        <button @click="cancel" class="button warning input">Cancel</button>
        <button @click="submit" class="button success input">Submit</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  color: green;

  &.error {
    color: red;
  }
}
</style>
