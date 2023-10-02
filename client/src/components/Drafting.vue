<script setup lang="ts">
import DraftService from "@/services/DraftService";
import { Action } from "@/store/Actions";
import { State } from "@/store/State";
import { Driver, Race } from "@ill/common";
import { useStore } from "vuex";
import DriverCard from "./DriverCard.vue";
import { computed } from "@vue/reactivity";
import { defineProps } from "vue";

const props = defineProps<{ race: Race }>();
const store = useStore<State>();

const entries = computed(() => props.race.entries);
const drafter = computed(() => store.state.users.find(u => u.id == store.state.server_state?.currentDrafterId));
const user = computed(() => store.state.user);

const drafts = computed(
  () => store.state.drafts.filter(
    (draft) => draft.race.id === props.race.id
  )
);

function getDrafterName(): string {
  if (drafter.value) {
    if (drafter.value.id === user.value?.id) {
      return `You!`;
    }
    return `${drafter.value.first_name} ${drafter.value.last_name}`;
  }
  return "None";
}

function isDrafted(driver: Driver): boolean {
  if (!driver) {
    return false;
  }

  for (const entry of props.race.entries) {
    if (entry.driver.id === driver.id) {
      for (const draft of drafts.value) {
        if (draft.car.id === entry.car.id) {
          return true;
        }
      }
    }
  }
  return false;
}

async function draft(driver: Driver) {
  if (isDrafted(driver)) return;

  if (store.state.user && store.state.token) {
    await DraftService.draft(props.race, driver, store.state.token);
    store.dispatch(Action.FETCH_DRAFTS);
    store.dispatch(Action.FETCH_RACES_DEEP);
  }
}

function genMessage(driver: Driver): string {
  if (!driver) {
    return "";
  }
  const entry = props.race.entries.find((_entry) => {
    if (_entry.driver.id == driver.id) return _entry;
  });

  if (!entry) {
    return "";
  }

  const draft = drafts.value.find((_draft) => {
    if (_draft.car.id == entry.car.id) return _draft;
  });

  if (!draft) {
    return "";
  }

  return `Drafted by ${draft.drafter.first_name}`;
}

store.dispatch(Action.FETCH_RACE_DATA);
</script>

<template>
  <div>
    <p class="text-2xl text-center">It's time to draft for the {{ race.name }}</p>
    <p class="text-center">Current Drafter:<strong>{{ getDrafterName() }}</strong></p>
    <hr class="my-4" />
    <div class="flex flex-wrap justify-center gap-4" v-if="race">
      <DriverCard @click="draft(entry.driver)" :class="{
        'disabled': isDrafted(entry.driver) || drafter?.id !== user?.id,
        'cursor-x': isDrafted(entry.driver),
      }" v-for="(entry, i) in entries" :driver="entry.driver" :key="i" :message="genMessage(entry.driver)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cursor-x {
  cursor: not-allowed;
}

.disabled {
  filter: saturate(0.1);
  opacity: 0.5;
}
</style>