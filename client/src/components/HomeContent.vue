<template>
  <div>

    <div class="box">
      <Drafting v-if="currentRace" :race="currentRace" />
    </div>

    <div v-if="isAdmin" class="box">
      <admin />
    </div>

    <div v-if="isAdmin" class="box">
      <users />
    </div>

    <div class="box">
      <races />
    </div>

    <div class="box">
      <drivers />
    </div>
    
  </div>
</template>

<style lang="scss" scoped>
@import "@/style.scss";
.box{
  @extend .bordered;
  @extend .v-box;
  @extend .center-x ;
  @extend .m-5;
  @extend .p-5;
  @extend .rounded;
}
</style>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Drivers from "@/components/Drivers.vue";
import Drafting from "@/components/Drafting.vue";
import Races from "./Races.vue";
import Users from "./Users.vue";
import { useStore } from "vuex";
import { State } from "@/store/State";
import Admin from "./Admin.vue";

export default defineComponent({
  components: { Drivers, Races, Users, Drafting, Admin },
  setup() {
    const store = useStore<State>();
    const isAdmin = computed(() => store.state.isAdmin);

    const currentRace = computed(()=>store.state.races.find((race)=>race.id === store.state.server_state?.currentRaceId));

    return {
      isAdmin,
      currentRace,
    };
  },
});
</script>
