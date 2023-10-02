<template>
  <div>
    <p class="title">Drivers</p>
    <div class="h-box wrap center-x">
      <driver-card v-for="(driver, i) in drivers" :key="i" :driver="driver" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import DriverCard from "@/components/DriverCard.vue";
import { useStore } from "vuex";
import { State } from "@/store/State";
import { Action } from "@/store/Actions";

export default defineComponent({
  components: { DriverCard },
  setup() {
    const store = useStore<State>();
    const drivers = computed(() => store.state.drivers);

    store.dispatch(Action.FETCH_DRIVERS);

    return {
      drivers,
    };
  },
});
</script>
