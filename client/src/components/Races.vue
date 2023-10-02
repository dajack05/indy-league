<script lang="ts">
import { defineComponent } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { Action } from "@/store/Actions";
import { useRouter } from "vue-router";
import { PlusBoxOutline } from "mdue";
import RaceCard from "@/components/RaceCard.vue";
import { State } from "@/store/State";

export default defineComponent({
  components: {
    RaceCard,
    PlusBoxOutline,
  },
  setup() {
    const store = useStore<State>();
    const races = computed(() => store.state.races);
    const router = useRouter();

    store.dispatch(Action.FETCH_RACES);

    function AddRace() {
      router.push("/addrace");
    }

    return {
      races,
      AddRace,
    };
  },
});
</script>

<template>
  <div class="v-box">
    <p class="title">Races</p>
    <div class="h-box wrap bordered center-x">
      <RaceCard v-for="(race, i) in races" :key="i" :race="race" />
    </div>
    <PlusBoxOutline @click="AddRace" class="button success large input" />
  </div>
</template>