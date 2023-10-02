<script setup lang="ts">
import { watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import Login from "@/components/Login.vue";
import { State } from "@/store/State";
import { useRouter } from "vue-router";
import { Action } from "@/store/Actions";

const store = useStore<State>();
const router = useRouter();
const token = computed(() => store.state.token);

watch(token,()=>checkCredentials());
onMounted(() => checkCredentials());

function checkCredentials() {
  if (token.value != null) {
    router.push('/home');
  }
}

</script>

<template>
  <div class="flex flex-col justify-center mt-2">
    <div class="flex flex-row">
      <div class="border-2 rounded-lg p-2" v-if="token == null">
        <Login />
      </div>
    </div>
  </div>
</template>