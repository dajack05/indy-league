<template>
  <div class="w-full max-w-md flex flex-col text-center p-2 m-2 border bg-blue-50 gap-2">
    <p class="text-2xl">Register</p>

    <div class="flex gap-2 flex-col md:flex-row flex-wrap">
      <input class="input" v-model="first_name" type="text" placeholder="First Name" />
      <input class="input" v-model="last_name" type="text" placeholder="Last Name" />
    </div>

    <input class="input" v-model="email" type="email" name="email" placeholder="Email" />
    <input class="input" v-model="password" type="password" name="password" placeholder="Password" />

    <div class="flex justify-between">
      <button class="button warning" @click="cancel">Cancel</button>
      <button class="button success" @click="register">Register</button>
    </div>
    <p class="subtitle" :class="{ message: true, error: true }">{{ message.text }}</p>
  </div>
</template>

<script lang="ts">
import AuthService from "@/services/AuthService";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const email = ref("");
    const password = ref("");
    const first_name = ref("");
    const last_name = ref("");

    const router = useRouter();

    const message = ref({
      text: "",
      good: true,
    });

    async function register() {
      message.value = {
        text: "",
        good: true,
      };

      const response = await AuthService.register({
        email: email.value,
        password: password.value,
        first_name: first_name.value,
        last_name: last_name.value,
      });

      if (response.data.error) {
        message.value.text = response.data.error;
        message.value.good = false;
      } else {
        router.push("/");
      }
    }

    function cancel(){
      router.push("/");
    }

    return {
      email,
      password,
      first_name,
      last_name,

      message,

      register,
      cancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.message {
  color: green;

  &.error {
    color: red;
  }
}
</style>
