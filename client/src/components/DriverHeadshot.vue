<script setup lang="ts">
import { Driver } from '@ill/common';
import { defineProps } from 'vue';
defineProps<{
    driver: Driver,
}>();
</script>
<template>
    <div class="border bg-cover bg-center rounded-lg w-32 h-32" :style="`background-image: url(${driver.image_url})`">
        <slot>

        </slot>
    </div>
</template>