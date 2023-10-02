<script setup lang="ts">
import DraftOrderVue from '@/components/DraftEditor/DraftOrder.vue';
import { State } from '@/store/State';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore<State>();

onMounted(() => {
  if (!store.state.token || !store.state.user) {
    router.push("/");
  }
});
</script>

<template>
    <DraftOrderVue />
</template>
