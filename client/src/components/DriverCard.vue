<script setup lang="ts">
import { Driver } from "@ill/common";
import { defineProps } from 'vue'
import DriverHeadshot from "./DriverHeadshot.vue";

defineProps<{
  driver: Driver,
  message: string,
}>();

</script>

<template>
  <div v-if="driver" class="flex flex-col justify-center card rounded-md text-center">
    <DriverHeadshot :driver="driver">
      <div class="holder">
        <div class="banner rounded-t-md">
          <strong class="text-white">{{ driver.first_name }}. {{ driver.last_name[0] }}</strong>
        </div>
        <div class="spacer"></div>
        <div v-if="message.length > 0" class="message">{{ message }}</div>
      </div>
    </DriverHeadshot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  @apply cursor-pointer transform-gpu hover:shadow-lg hover:scale-105;

  .banner {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .holder {
    @apply flex flex-col h-full w-full;

    .spacer {
      @apply flex-grow;
    }

    .message {
      @apply text-center bg-blue-400 rounded-b-md;
    }
  }
}
</style>