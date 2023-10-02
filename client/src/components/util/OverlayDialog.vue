<template>
  <div class="dialog" :class="{ hidden: !vis, shown: vis }">
    <div class="bg-light bordered inset rounded">
      <div class="h-box space-between bg-primary tl-rounded tr-rounded">
        <div class="w-20"></div>
        <div class="v-box center-x center-y">
          <p v-if="title" class="title">{{title}}</p>
        </div>
        <div class="h-box right w-20">
          <CloseCircleOutline
            @click="close"
            class="button danger large"
          />
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { CloseCircleOutline } from "mdue";

export default defineComponent({
  components: { CloseCircleOutline },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title:{
      type: String,
    }
  },
  emits: ["onClosed"],
  setup(props, { emit }) {
    const vis = ref(props.visible);

    watch(props, (newProps) => (vis.value = newProps.visible));

    return {
      vis,
      close: () => {
        vis.value = false;
        emit("onClosed");
      },
    };
  },
});
</script>


<style lang="scss" scoped>
.dialog {
  @apply flex absolute opacity-100 left-0 right-0 justify-center items-center;

  transition: 0.5s;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;

  &.hidden {
    top: -100vh;
    bottom: 100vh;
  }

  &.shown {
    top: 0vh;
    bottom: 0vh;
  }
}
</style>