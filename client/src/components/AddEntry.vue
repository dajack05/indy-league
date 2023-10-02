<template>
  <div>
    <div class="v-box m-2">
      <table>
        <tr>
          <th>
            <label>Race</label>
          </th>
          <td colspan="2">
            <select v-model="selectedRace" class="input w-100">
              <option :value="race" v-for="(race, i) in races" :key="i">
                {{ race.name }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th>
            <label>Driver</label>
          </th>
          <td>
            <select v-model="selectedDriver" class="input w-100">
              <option :value="driver" v-for="(driver, i) in drivers" :key="i">
                {{ driver.first_name }} {{ driver.last_name }}
              </option>
            </select>
          </td>
          <td>
            <DriverHeadshot v-if="selectedDriver" :driver="selectedDriver" />
          </td>
        </tr>
        <tr>
          <th>
            <label>Car</label>
          </th>
          <td colspan="2">
            <select v-model="selectedCar" class="input w-100">
              <option :value="car" v-for="(car, i) in cars" :key="i">
                {{ car.number }} - {{ car.team_name }}
              </option>
            </select>
          </td>
        </tr>
      </table>
    </div>

    <div class="h-box space-between">
      <Cancel @click="$emit('cancel')" class="button input warning large" />
      <Plus @click="add" class="button input success large" />
    </div>
  </div>
</template>

<style lang="scss">
.driver-image {
  min-width: 50px;
  min-height: 40px;
  width: 50px;
  height: 40px;

  background-size: cover;
  background-position: center;
}

th {
  text-align: right;
}

td {
  text-align: left;
  * > {
    flex-grow: 1;
  }
}
</style>

<script lang="ts">
import { Action } from "@/store/Actions";
import { State } from "@/store/State";
import { Car, Driver, Entry, Race } from "@ill/common";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { Cancel, Plus } from "mdue";
import DriverHeadshot from "./DriverHeadshot.vue";

export default defineComponent({
  components: { Cancel, Plus, DriverHeadshot },
  emits: ["cancel"],
  setup(props, { emit }) {
    const store = useStore<State>();
    const drivers = computed<Driver[] | undefined>(() => store.state.drivers);
    const races = computed<Race[] | undefined>(() => store.state.races);
    const cars = computed<Car[] | undefined>(() => store.state.cars);

    const selectedDriver = ref<Driver>();
    watch(drivers, (newDrivers) => {
      if (newDrivers) {
        return (selectedDriver.value = newDrivers[0]);
      }
      return new Driver();
    });

    const selectedCar = ref<Car>();
    watch(cars, (newCars) => {
      if (newCars) {
        return (selectedCar.value = newCars[0]);
      }
      return new Car();
    });

    const selectedRace = ref<Race>();
    watch(races, (newRaces) => {
      if (newRaces) {
        return (selectedRace.value = newRaces[0]);
      }
      return new Race();
    });

    store.dispatch(Action.FETCH_DRIVERS);
    store.dispatch(Action.FETCH_RACES);
    store.dispatch(Action.FETCH_CARS);

    async function add() {
      if (selectedDriver.value && selectedCar.value && selectedRace.value) {
        const entry = new Entry();
        entry.driver = selectedDriver.value;
        entry.car = selectedCar.value;
        entry.race = selectedRace.value;

        store.dispatch(Action.ADD_ENTRY, entry);

        emit("cancel");
      } else {
        console.error("Invalid selected driver or car");
      }
    }

    return {
      drivers,
      races,
      cars,

      selectedDriver,
      selectedCar,
      selectedRace,

      add,
    };
  },
});
</script>
