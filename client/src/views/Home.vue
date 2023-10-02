
<script setup lang="ts">
import Drafting from '@/components/Drafting.vue';
import DraftResults from '@/components/DraftResults.vue';
import { State } from '@/store/State';
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { GamePhase } from '@ill/common';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Action } from '@/store/Actions';

const store = useStore<State>();
const router = useRouter();

const race = computed(() => store.state.races.find(r => r.id === store.state.server_state?.currentRaceId));
const phase = computed(() => store.state.server_state?.phase);

store.dispatch(Action.FETCH_SERVER_STATE);
store.dispatch(Action.FETCH_RACES);

onMounted(() => {
  if (!store.state.token || !store.state.user) {
    router.push('/');
  }
})
</script>

<template>
  <div class="v-box center-x">
    <div class="v-box center-x container">
      <div class="border p-2 bg-blue-50 text-center" v-if="phase == GamePhase.WAITING">
        <p class="text-2xl">Waiting...</p>
        <p class="text-lg mb-4">You're in the right place! Just wait for drafting to start.</p>
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/KnTE1dlJCFA?start=51"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
      <div class="border p-2 bg-blue-50 text-center" v-if="phase == GamePhase.DRAFTING">
        <Drafting v-if="race" :race="race" />
      </div>
      <div class="border p-2 bg-blue-50 text-center" v-if="phase == GamePhase.RACING">
        <p class="text-2xl">🏁 Draft Results 🏁</p>
        <hr />
        <DraftResults />
      </div>
    </div>
  </div>
</template>