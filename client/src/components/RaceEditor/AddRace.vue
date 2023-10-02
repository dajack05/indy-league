<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
import { State } from '../../store/State';
import { Race } from '@ill/common';
import { Action } from '../../store/Actions';
import { ref, defineProps } from "vue";
import RaceService from "../../services/RaceService";

const store = useStore<State>();

const props = defineProps<{
    onAdd:()=>void,
    onCancel:()=>void,
}>();

const races = computed<Race[]>(() => store.state.races);

const showNewRace = ref(false);
const newRaceName = ref("");
const newRaceDate = ref("");

store.dispatch(Action.FETCH_RACES);

function canAddRace(): boolean {
    return newRaceName.value.length > 0 && newRaceDate.value.length > 0;
}

function cancelNewRace() {
    showNewRace.value = false;
    newRaceName.value = "";
    newRaceDate.value = "";
    props.onCancel();
}

async function submitNewRace() {
    if (canAddRace()) {
        await RaceService.add(newRaceName.value, newRaceDate.value);
        cancelNewRace();
        store.dispatch(Action.FETCH_RACES);
    }
    props.onAdd();
}
</script>

<template>
    <div class="p-2 border flex flex-col gap-2">
        <p class="text-2xl">New Race</p>
        <div>
            <label>Race Name</label>
            <input v-model="newRaceName" class="input" type="text" />
        </div>
        <div>
            <label>Race Date</label>
            <input v-model="newRaceDate" class="input" type="date" />
        </div>
        <div class="flex justify-between">
            <button class="button warning" @click="cancelNewRace">Cancel</button>
            <button class="button success" :class="{ 'disabled': !canAddRace() }" @click="submitNewRace">Add</button>
        </div>
    </div>
</template>