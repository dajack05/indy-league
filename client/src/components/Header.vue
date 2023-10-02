<script setup lang="ts">
import { Action } from '@/store/Actions';
import { State } from '@/store/State';
import { GamePhase, User } from '@ill/common';
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { Logout } from 'mdue';

const store = useStore<State>();
const user = computed<User | null>(() => store.state.user);

const isAdmin = computed(() => store.state.isAdmin);
const phase = computed(() => store.state.server_state?.phase);

const logged_in = computed(() => store.state.user ? true : false);

function logout() {
  store.dispatch(Action.LOGOUT);
}

function getPhaseMessage(): string {
  if (window.innerWidth < 500) {
    return "";
  }
  switch (phase.value) {
    case GamePhase.DRAFTING:
      return `It's time to draft!`;
    case GamePhase.RACING:
      return `Let's go racing!`;
    default:
      return `Welcome ${user.value?.first_name}`;
  }
}
</script>

<template>
  <div id="header" class="w-full flex justify-between justify-center flex-wrap p-4 bg-blue-300">
    <div class="px-2">
      <!-- Left -->
      <RouterLink class="text-2xl" to="/">Indy Loser League</RouterLink>
    </div>
    <div v-if="user" class="flex flex-row-reverse">
      <!-- Right -->
      <div class="flex flex-wrap gap-2 self-center justify-center">
        <RouterLink class="button" to="/">Home</RouterLink>
        <RouterLink v-if="isAdmin" class="button" to="/draftedit">Draft Editor</RouterLink>
        <RouterLink v-if="isAdmin" class="button" to="/raceedit">Race Editor</RouterLink>
        <RouterLink v-if="isAdmin" class="button" to="/driveredit">Driver Editor</RouterLink>
        <RouterLink v-if="isAdmin" class="button" to="/admin">Admin</RouterLink>
        <button @click="logout" class="button danger">
          <Logout></Logout>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#header {
  z-index: 10;
}
</style>
