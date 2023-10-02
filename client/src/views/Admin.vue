<script setup lang="ts">
import ActionService from '@/services/ActionService';
import DraftService from '@/services/DraftService';
import { Action } from '@/store/Actions';
import { State } from '@/store/State';
import { Race, Action as SAction, clone, GamePhase, User } from '@ill/common';
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore<State>();
const races = computed(() => store.state.races);
const users = computed(() => store.state.users);

const server_state = computed(() => store.state.server_state);

const selected_race = ref<Race | undefined>(undefined);
const selected_user = ref<User | undefined>(undefined);
const current_phase = ref<GamePhase | undefined>(undefined);

watch(server_state, _server_state => {
  const race = races.value.find(r => r.id == _server_state?.currentRaceId);
  if (race) {
    selected_race.value = race;
  }

  const user = users.value.find(u => u.id == _server_state?.currentDrafterId);
  if (user) {
    selected_user.value = user;
  }

  const phase = _server_state?.phase;
  if (phase) {
    current_phase.value = phase;
  }
});

watch(selected_race, async (_selected_race, _old_race) => {
  if (_old_race !== undefined && _selected_race) {
    await ActionService.submit(SAction.SET_RACE, [_selected_race.id], store.state.token as string);
  }
});

watch(selected_user, async (_selected_user, _old_user) => {
  if (!_old_user !== undefined && _selected_user) {
    await ActionService.submit(SAction.SET_DRAFTER, [_selected_user.id], store.state.token as string);
  }
});

watch(current_phase, async (_current_phase, _old_phase) => {
  if (!_old_phase !== undefined && _current_phase) {
    await ActionService.submit(SAction.SET_RACE_PHASE, [_current_phase], store.state.token as string);
  }
})

store.dispatch(Action.FETCH_RACES);
store.dispatch(Action.FETCH_DRAFTS);
store.dispatch(Action.FETCH_USERS);

onMounted(() => {
  if (!store.state.token) {
    useRouter().push("/");
  }
});
</script>

<template>
  <div class="m-4 p-4 border">
    <p class="text-2xl">Admin</p>
    <div>
      <p class="text-xl">Current Race</p>
      <select v-model="selected_race" class="input">
        <option v-for="race, i in races" :key="i" :value="race">{{ race.name }}</option>
      </select>

      <p class="mt-4 text-xl">Current Phase</p>
      <select v-model="current_phase" class="input">
        <option v-for="phase in GamePhase" :key="phase" :value="phase">
          {{ phase }}
        </option>
      </select>

      <p class="mt-4 text-xl">Current Drafting User</p>
      <select v-model="selected_user" class="input">
        <option v-for="user, i in users" :key="i" :value="user">{{ user.first_name }} {{ user.last_name }}
        </option>
      </select>
    </div>
  </div>
</template>