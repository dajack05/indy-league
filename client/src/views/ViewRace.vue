<script lang="ts">
import { defineComponent } from "vue";
import { Action } from "@/store/Actions";
import { State } from "@/store/State";
import { Entry, Race, UserClass } from "@ill/common";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { Plus, TrashCanOutline } from "mdue";
import DriverHeadshot from "@/components/DriverHeadshot.vue";
import AddEntry from "@/components/AddEntry.vue";
import OverlayDialog from "@/components/util/OverlayDialog.vue";

export default defineComponent({
  components: {
    Plus,
    TrashCanOutline,
    DriverHeadshot,
    AddEntry,
    OverlayDialog,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore<State>();

    const user = computed(() => store.state.user);
    const isAdmin = computed(() => user.value?.class === UserClass.ADMIN);

    const showDialog = ref<boolean>(false);
    const race = computed<Race | undefined>(() => {
      if (!route.query.raceid) return undefined;

      return store.state.races.find(
        (_race) => _race.id == Number.parseInt(route.query.raceid!.toString())
      );
    });

    function formatDate(date: Date): string {
      return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }

    function removeEntry(entry: Entry) {
      store.dispatch(Action.DELETE_ENTRY, entry);
    }

    setTimeout(() => {
      if (!race.value) {
        router.push("/");
      }
    }, 1000);

    store.dispatch(Action.FETCH_RACES_DEEP);

    onMounted(() => {
      document.querySelectorAll(".animtextitem").forEach((value, i) => {
        const elem = value as HTMLElement;
        elem.style.animationDelay = `${i / 10}s`;
      });
    });

    return {
      isAdmin,
      showDialog,
      race,

      removeEntry,
      formatDate,
    };
  },
});
</script>

<template>
  <div class="v-box">
    <OverlayDialog
      title="Add Entry"
      @onClosed="showDialog = false"
      :visible="showDialog"
    >
      <AddEntry @cancel="showDialog = false" />
    </OverlayDialog>
    <div class="animtext" v-if="!race">
      <span class="animtextitem" v-for="(c, i) in 'Missing Race'" :key="i">{{
        c
      }}</span>
    </div>
    <div v-if="race" class="v-box p-2 center-x bordered rounded gap-2">
      <p class="subtitle">{{ race.name }}</p>
      <p>{{ formatDate(race.start) }}</p>

      <span class="mt-4"></span>

      <Plus
        v-if="isAdmin"
        @click="showDialog = true"
        class="button success large"
      />
      <table class="table" v-if="race.entries">
        <tr>
          <th></th>
          <th>Driver</th>
          <th>Car</th>
          <th></th>
        </tr>
        <tr v-for="(entry, i) in race.entries" :key="i">
          <td>
            <DriverHeadshot :width="'64px'" :driver="entry.driver" />
          </td>
          <td>{{ entry.driver.first_name }} {{ entry.driver.last_name[0] }}</td>
          <td>{{ entry.car.number }} - {{ entry.car.team_name }}</td>
          <td>
            <TrashCanOutline
              v-if="isAdmin"
              @click="removeEntry(entry)"
              class="button danger"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
td,
th {
  text-align: left;
  padding: 1rem;
}

.animtext {
  font-size: xx-large;

  > * {
    animation: wave 4s forwards;
    animation-iteration-count: infinite;

    bottom: 0rem;
    position: relative;
  }
}

@keyframes wave {
  0% {
    bottom: 0rem;
    color: hsl(0, 100%, 50%);
    font-size: 20pt;
  }

  30% {
    bottom: 1rem;
    color: hsl(20, 100%, 50%);
    font-size: 40pt;
  }

  70% {
    bottom: 0rem;
    color: hsl(40, 100%, 50%);
    font-size: 20pt;
  }

  100% {
    bottom: 0rem;
    color: hsl(0, 100%, 50%);
    font-size: 20pt;
  }
}
</style>