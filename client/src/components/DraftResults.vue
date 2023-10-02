<script setup lang="ts">
import { Action } from '@/store/Actions';
import { State } from '@/store/State';
import { Car, Driver, User } from '@ill/common';
import { computed } from "@vue/reactivity";
import { useStore } from 'vuex';

interface EntryType {
    user: User;
    car: Car;
    driver: Driver;
}

const store = useStore<State>();

const races = computed(() => store.state.races);

const current_race = computed(() => races.value.find(r => r.id == store.state.server_state?.currentRaceId));
const data = computed(() => {
    const ret: EntryType[] = [];

    if (current_race.value) {
        for (const draft of current_race.value?.drafts) {
            const car = draft.car;
            const user = draft.drafter;
            const driver = current_race.value?.entries.find(e => e.car.id === car.id)?.driver;

            if (car && driver && user) {
                ret.push({
                    car,
                    driver,
                    user,
                });
            }
        }

	data.value.sort((a,b)=>a.user.id - b.user.id);
    }

    ret.sort((a,b)=>a.user.first_name.localeCompare(b.user.first_name));

    return ret;
});

store.dispatch(Action.FETCH_DRAFTS);
store.dispatch(Action.FETCH_SERVER_STATE);
</script>

<template>
    <div>
        <form class="form">
            <tr>
                <th class="p-2 text-center">User</th>
                <th class="p-2 text-center">Driver</th>
                <th class="p-2 text-center">Car #</th>
            </tr>
            <tr v-for="draft, i in data" :key="i">
                <td class="px-1 py-1 text-right" :class="{ dark_row: i % 2 == 0, light_row: i % 2 == 1 }">
                    {{ draft.user.first_name }} {{ draft.user.last_name[0] }}
                </td>
                <td class="px-1" :class="{ dark_row: i % 2 == 0, light_row: i % 2 == 1 }">
                    {{ draft.driver.first_name }} {{ draft.driver.last_name[0] }}
                </td>
                <td class="px-1" :class="{ dark_row: i % 2 == 0, light_row: i % 2 == 1 }">
                    {{ draft.car.number }}
                </td>
            </tr>
        </form>
    </div>
</template>

<style scoped>
.dark_row {
    background-color: #ccc;
}

.light_row {
    background-color: #eee;
}
</style>
