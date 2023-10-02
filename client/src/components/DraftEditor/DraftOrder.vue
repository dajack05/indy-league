<script setup lang="ts">
import { Race } from '@ill/common';
import { Action } from '@/store/Actions';
import { State } from '@/store/State';
import { User } from '@ill/common';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ArrowUp, ArrowDown } from "mdue";
import DraftOrderService from '@/services/DraftOrderService';

const store = useStore<State>();

store.dispatch(Action.FETCH_USERS);
store.dispatch(Action.FETCH_RACES);
store.dispatch(Action.FETCH_SERVER_STATE);

const selected_race = ref<Race | undefined>();

const users = computed(() => store.state.users);
const draft_order = ref<number[]>([]);

const races = computed(()=>store.state.races);

const new_draft_order = ref<number[]>([]);
const drafters = ref<User[]>([]);

watch(selected_race, async _selected_race=>{
    if(!selected_race.value) return;

    const race = selected_race.value;
    const result = await DraftOrderService.getByRace(race);
    if(result == null || result.order_json == undefined){
        draft_order.value = [];
        new_draft_order.value = users.value.map(u=>u.id);
        return;
    }

    const order = JSON.parse(result.order_json) as number[];
    draft_order.value = order;
    new_draft_order.value = order;
});

watch(users, _users => {
    if (!_users) {
        console.error("_users is empty!");
        return;
    }

    if (!draft_order.value) {
        console.error("draft_order = undefined");
        return;
    }

    new_draft_order.value = draft_order.value;
});

watch(new_draft_order, _new_draft_order => {
    drafters.value = [];
    for (const user_id of _new_draft_order) {
        const user = users.value.find(u => u.id == user_id);
        if (user) {
            drafters.value.push(user);
        }
    }
});

function moveDrafter(index: number, value: number) {
    if (index == users.value.length - 1 && value > 0) {
        // Can't move any further up
        return;
    }
    if (index == 0 && value < 0) {
        // Can't move any further down
        return;
    }

    const new_order = new_draft_order.value.map(v => v);

    const last_pos = index;
    const new_pos = index + value;
    const last_val = new_draft_order.value[last_pos];
    const new_val = new_draft_order.value[new_pos];
    new_order[new_pos] = last_val;
    new_order[last_pos] = new_val;

    new_draft_order.value = new_order;
}

function hasOrderChanged(): boolean {
    if (!draft_order.value) return true;
    if (draft_order.value == []) return true;
    if (draft_order.value.length !== new_draft_order.value.length) return true;

    for (let i = 0; i < draft_order.value?.length; i++) {
        if (new_draft_order.value[i] !== draft_order.value[i]) {
            return true;
        }
    }

    return false;
}

async function saveChanges() {
    if(!selected_race.value || !new_draft_order.value || !store.state.token){
        return;
    }

    await DraftOrderService.set(selected_race.value,JSON.stringify(new_draft_order.value), store.state.token);

    draft_order.value = new_draft_order.value;
}

function cancelChanges() {
    if (draft_order.value)
        new_draft_order.value = draft_order.value;
    else
        new_draft_order.value = [];
}

</script>

<template>
    <div class="border p-2 text-center">
        <p class="text-2xl mb-4">Draft Order</p>
        <hr />
        <select v-model="selected_race" class="input">
            <option v-for="race,i in races" :key="i" :value="race">{{race.name}}</option>
        </select>
        <div class="flex flex-col mt-4">
            <div v-for="drafter, i in drafters" :key="i" class="flex justify-between select-none border-b">
                <strong>{{ i + 1 }}</strong>
                <strong class="mx-4">{{ drafter.first_name }} {{ drafter.last_name[0] }}.</strong>
                <div>
                    <button class="button" @click="moveDrafter(i, -1)">
                        <ArrowUp />
                    </button>
                    <button class="button" @click="moveDrafter(i, +1)">
                        <ArrowDown />
                    </button>
                </div>
            </div>
            <button class="button success mt-4" :class="{ 'disabled': !hasOrderChanged() }" @click="saveChanges">
                Save Changes
            </button>
            <button class="button warning mt-2" :class="{ 'disabled': !hasOrderChanged() }" @click="cancelChanges">
                Cancel Changes
            </button>
        </div>
    </div>
</template>