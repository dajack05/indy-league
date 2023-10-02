<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import { useStore } from "vuex";
import { State } from "./store/State";
import { Action } from "./store/Actions";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import { computed } from "@vue/reactivity";

// Checker
let interval: number = -1;

const store = useStore<State>();

const active_server_requests = computed(() => {
  if(store.state.periodic_fetch_running){
    return 0;
  }
  return store.state.active_server_requests;
});

store.commit(Action.PERIODIC_FETCH);
if (interval < 0) {
  interval = setInterval(async () => {
    store.commit(Action.PERIODIC_FETCH);
  }, 2000);
}
</script>

<template>
  <div class="flex flex-col h-screen items-center">
    <LoadingSpinner v-if="active_server_requests > 0" />
    <Header />
    <router-view />
    <div class="flex-grow">

    </div>
    <Footer />
  </div>
</template>
