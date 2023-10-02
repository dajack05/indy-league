<script lang="ts">
import { Race } from "@ill/common";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

interface IProps {
  race: Race;
}

export default defineComponent({
  props: ["race"],
  setup(props: IProps) {
    const router = useRouter();

    function raceDate(): string {
      if (props.race) {
        const d = new Date(props.race.start);
        return d.toLocaleDateString();
      }
      return "";
    }

    function viewRace() {
      if (props.race) {
        router.push({
          name: "View Race",
          query: {
            raceid: props.race.id,
          },
        });
      }
    }

    return {
      raceDate,
      viewRace,
    };
  },
});
</script>

<style lang="scss" scoped>
.card {
  width: 200px;
  height: 100px;

  transition: 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);

  cursor: pointer;

  &:hover {
    box-shadow: black 0 0 20px -10px;
    transform: scale(1.05);
  }
}
</style>

<template>
  <div
    v-if="race"
    @click="viewRace"
    class="v-box bordered p-2 m-2 center-x card"
  >
    <p>{{ race.name }}</p>
    <p>{{ raceDate() }}</p>
  </div>
</template>