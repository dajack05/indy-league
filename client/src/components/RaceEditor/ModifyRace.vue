<script setup lang="ts">
import { useStore } from 'vuex';
import { State } from '../../store/State';
import { Car, clone, Driver, Entry, Race } from '@ill/common';
import { Action } from '../../store/Actions';
import { ref, defineProps, watch } from "vue";
import RaceService from "../../services/RaceService";
import { computed } from '@vue/reactivity';
import { TrashCan, Plus } from 'mdue';
import EntryService from '@/services/EntryService';

const store = useStore<State>();

const props = defineProps<{
    race: Race,
    onModify: () => void,
    onCancel: () => void,
}>();

const enabled = ref(true);

const current_race = computed(() => props.race);
const all_drivers = computed(() => {
    return clone(store.state.drivers).sort((a, b) => a.first_name.localeCompare(b.first_name));
});
const all_cars = computed(() => store.state.cars.sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number)));

const add_driver = ref<Driver | null>(null);
const add_car = ref<Car | null>(null);

const sorted_entries = computed(() => clone(current_race.value.entries).sort((a, b) => Number.parseInt(a.car.number) - Number.parseInt(b.car.number)));

store.dispatch(Action.FETCH_RACES);
store.dispatch(Action.FETCH_DRAFTS);
store.dispatch(Action.FETCH_CARS);
store.dispatch(Action.FETCH_DRIVERS);

watch(add_driver, _add_driver => {
    // Auto select default car for given driver
    if (!_add_driver) return;

    if (!_add_driver.default_car) return;

    add_car.value = _add_driver.default_car;
});

function canSaveRace(): boolean {
    return current_race.value.name.length > 0 && current_race.value.start.toString().length > 0;
}

function cancelChanges() {
    props.onCancel();
}

async function addAllDrivers() {
    enabled.value = false;
    for (const driver of all_drivers.value) {
        if (driver.default_car) {
            await addDriverRaw(driver, driver.default_car, current_race.value);
        }
    }
    console.log("Done Adding All");
    enabled.value = true;
}

async function submitChanges() {
    if (canSaveRace()) {
        await RaceService.update(current_race.value);
        store.dispatch(Action.FETCH_RACES);
        props.onModify();
    }
}

function formatDate(date: Date): string {
    let month = date.getMonth().toString();
    while (month.length < 2) month = `0${month}`;

    let day = date.getDate().toString();
    while (day.length < 2) day = `0${day}`;

    let year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
}

function reformatDate(event: Event): Date {
    const date_str = (event.target as HTMLInputElement).value;
    const splits = date_str.split('-');
    const year = Number.parseInt(splits[0]);
    const month = Number.parseInt(splits[1]);
    const day = Number.parseInt(splits[2]);
    return new Date(year, month, day);
}

async function removeEntry(index: number) {
    enabled.value = false;
    if (store.state.token) {
        console.log("Bam");
        await EntryService.remove(store.state.token, sorted_entries.value[index]);
        store.dispatch(Action.FETCH_RACES);
    }
    enabled.value = true;
}

async function addDriverRaw(driver: Driver, car: Car, race: Race) {
    if (!store.state.token) {
        console.error("Unable to add entry: Missing Token");
        return;
    }
    const entry = new Entry();
    entry.car = car;
    entry.driver = driver;
    entry.race = race;
    await EntryService.add(store.state.token, entry);
}

async function addDriver() {
    enabled.value = false;
    if (add_driver.value && add_car.value && current_race.value) {
        await addDriverRaw(add_driver.value, add_car.value, current_race.value);
        store.dispatch(Action.FETCH_RACES_DEEP);
    }
    enabled.value = true;
}
</script>

<template>
    <div class="p-2 border flex flex-col gap-2">
        <p class="text-2xl">Edit Race</p>
        <div>
            <label>Race Name</label>
            <input v-model="current_race.name" class="input" type="text" />
        </div>
        <div>
            <label>Race Date</label>
            <input :value="formatDate(current_race.start)" @change="current_race.start = reformatDate($event)"
                class="input" type="date" />
        </div>
        <p class="text-2xl">Entries</p>
        <table class="table">
            <tr>
                <th class="text-center p-2">Driver</th>
                <th class="text-center p-2">Car #</th>
                <th class="text-center p-2">Team</th>
                <th class="text-center p-2"></th>
            </tr>
            <tr>
                <td class="p-2">
                    <select v-model="add_driver" class="input">
                        <option v-for="driver, i in all_drivers" :key="i" :value="driver">{{ driver.first_name }} {{
                                driver.last_name
                        }}
                        </option>
                    </select>
                </td>
                <td class="p-2" colspan="2">
                    <select v-model="add_car" class="input">
                        <option v-for="car, i in all_cars" :key="i" :value="car">#{{ car.number }} {{ car.team_name }}
                        </option>
                    </select>
                </td>
                <td>
                    <button class="button success" @click="addDriver">
                        <Plus />
                    </button>
                </td>
            </tr>
            <tr v-for="entry, i in sorted_entries" :key="i">
                <td class="text-right px-2 py-1" :class="{ 'bg-gray-100': i % 2 == 0, 'bg-gray-200': i % 2 == 1 }">{{
                        entry.driver.first_name
                }} {{ entry.driver.last_name }}</td>
                <td class="text-center px-2 py-1" :class="{ 'bg-gray-100': i % 2 == 0, 'bg-gray-200': i % 2 == 1 }">{{
                        entry.car.number
                }}</td>
                <td class="text-left px-2 py-1" :class="{ 'bg-gray-100': i % 2 == 0, 'bg-gray-200': i % 2 == 1 }">{{
                        entry.car.team_name
                }}</td>
                <td>
                    <button class="button danger" :class="{ 'disabled': !enabled }" :disabled="!enabled"
                        @click="removeEntry(i)">
                        <TrashCan />
                    </button>
                </td>
            </tr>
        </table>
        <div class="flex justify-between">
            <div>
                <button class="button warning" @click="cancelChanges">
                    Cancel
                </button>
                <button class="button ml-2" @click="addAllDrivers">
                    Add All Drivers
                </button>
            </div>
            <button class="button success" :class="{ 'disabled': !canSaveRace() }" @click="submitChanges">
                Update
            </button>
        </div>
    </div>
</template>