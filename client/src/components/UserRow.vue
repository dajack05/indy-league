<template>
  <tr class="animated w-100">
    <td class="p-2">{{ user.id }}</td>
    <td class="p-2">{{ user.first_name }}</td>
    <td class="p-2">{{ user.last_name }}</td>
    <td class="p-2">{{ user.email }}</td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    user: {
      required: true,
    },
  },
  setup() {},
});
</script>

<style lang="scss" scoped>
tr {
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px -5px black inset;
  }
}
</style>