<script setup lang="ts">
import { clone, Driver } from '@ill/common';
import { Action } from '@/store/Actions';
import DriverService from '@/services/DriverService';
import { State } from '@/store/State';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Store } from 'mdue';

const store = useStore<State>();

store.dispatch(Action.FETCH_DRIVERS);
store.dispatch(Action.FETCH_CARS);

const drivers = computed(() => clone(store.state.drivers).sort((a, b) => a.first_name.localeCompare(b.first_name)));
const cars = computed(() => clone(store.state.cars).sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number)));

const selected_driver = ref<Driver | undefined>();
const editing_driver = ref<Driver | undefined>();

watch(selected_driver, _selected_driver => {
    store.dispatch(Action.FETCH_DRIVERS);
    editing_driver.value = clone(_selected_driver);
});

function hasChanged(): boolean {
    return JSON.stringify(selected_driver.value) != JSON.stringify(editing_driver.value);
}

async function save() {
    if (editing_driver.value && store.state.token) {
        await DriverService.set(editing_driver.value, store.state.token);
        selected_driver.value = editing_driver.value;
        return;
    }

    console.error("editing_driver == null or token == null", editing_driver.value, store.state.token);
}

function cancel() {
    editing_driver.value = clone(selected_driver.value);
}

onMounted(() => {
    if (!store.state.token || !store.state.user) {
        useRouter().push("/");
    }
});
</script>

<template>
    <div class="border p-2 text-center">
        <p class="text-2xl mb-4">Driver Editor</p>
        <hr />
        <select v-model="selected_driver" class="input">
            <option v-for="driver, i in drivers" :key="i" :value="driver">{{ driver.first_name }} {{ driver.last_name }}
            </option>
        </select>
        <div v-if="selected_driver && editing_driver" class="flex flex-col mt-4">
            <div class="flex flex-wrap justify-center gap-2">
                <img width="256" :src="selected_driver.image_url"
                    :placeholder="`Headshot of ${selected_driver.first_name} ${selected_driver.last_name}`" />
                <div class="flex flex-col">
                    <div class="flex flex-col md:flex-row">
                        <strong>First Name</strong>
                        <input type="text" class="input" v-model="editing_driver.first_name" />
                    </div>
                    <div class="flex flex-col md:flex-row">
                        <strong>Last Name</strong>
                        <input type="text" class="input" v-model="editing_driver.last_name" />
                    </div>
                    <div class="flex flex-col md:flex-row">
                        <strong>Image URL</strong>
                        <input type="text" class="input" v-model="editing_driver.image_url" />
                    </div>
                    <div class="flex flex-col md:flex-row">
                        <strong>Default Car</strong>
                        <select v-model="editing_driver.default_car" class="input">
                            <option :value="car" v-for="car, i in cars" :key="i">
                                #{{ car.number }} {{ car.team_name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <button class="button success mt-4" :class="{ 'disabled': !hasChanged() }" @click="save">
                Save Changes
            </button>
            <button class="button warning mt-2" :class="{ 'disabled': !hasChanged() }" @click="cancel">
                Cancel Changes
            </button>
        </div>
    </div>
</template>