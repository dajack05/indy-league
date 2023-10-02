<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { State } from '../store/State';
import { Race } from '@ill/common';
import { Action } from '../store/Actions';
import { TrashCan, Pencil, Plus } from 'mdue';
import { ref, onMounted } from "vue";
import RaceService from "../services/RaceService";
import AddRace from '../components/RaceEditor/AddRace.vue';
import ModifyRace from "../components/RaceEditor/ModifyRace.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore<State>();
const races = computed<Race[]>(() => store.state.races);

store.dispatch(Action.FETCH_RACES);

onMounted(() => {
    if (!store.state.token || !store.state.user) {
        router.push("/");
    }
});

const showNewRace = ref(false);
const selectedRace = ref<Race | null>(null);

async function deleteRace(index: number) {
    await RaceService.remove(races.value[index]);
    store.dispatch(Action.FETCH_RACES);
}

function modifyRace(index: number) {
    selectedRace.value = races.value[index];
    showNewRace.value = false;
}

function added() {
    showNewRace.value = false;
}

function modified() {
    selectedRace.value = null;
}

</script>

<template>
    <div>
        <p class="text-2xl">Races</p>

        <AddRace v-if="showNewRace" :onCancel="() => showNewRace = false" :onAdd="added" />
        <ModifyRace v-if="selectedRace" :race="selectedRace" :onCancel="() => selectedRace = null"
            :onModify="modified" />

        <table class="table">
            <tr>
                <th class="p-2 text-lg text-center">Date</th>
                <th class="p-2 text-lg text-center">Name</th>
                <th class="p-2 text-lg text-center">
                    <button @click="showNewRace = true" class="button lg success">
                        <Plus />
                    </button>
                </th>
            </tr>
            <tr v-for="race, i in races" :key="i" :class="{ 'bg-gray-100': i % 2 == 0, 'bg-gray-300': i % 2 == 1 }">
                <td class="text-right p-2">{{ race.start.toLocaleDateString() }}</td>
                <td class="text-left p-2">{{ race.name }}</td>
                <td class="p-2">
                    <button class="button warning" @click="modifyRace(i)">
                        <Pencil />
                    </button>
                    <button class="button danger" @click="deleteRace(i)">
                        <TrashCan />
                    </button>
                </td>
            </tr>
        </table>
    </div>
</template>