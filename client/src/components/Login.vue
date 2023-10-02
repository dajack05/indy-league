<script setup lang="ts">
import { ReturnType, User } from "@ill/common";
import AuthService from "@/services/AuthService";
import { State } from "@/store/State";
import { ref } from "vue";
import { useStore } from "vuex";
import { TokenCookie } from "@/Cookie";
import Cookies from "js-cookie";
import { Action } from "@/store/Actions";

const store = useStore<State>();

const email = ref("");
const password = ref("");

const message = ref(" ");

const _cookie = Cookies.get("userinfo");
if (_cookie) {
  // If we already have a cookie... Auto-login
  const c = TokenCookie.FromString(_cookie);
  _login(c);
}

async function login() {
  _login();
}

async function _login(cookie?: TokenCookie) {
  message.value = " ";

  if (cookie) {
    // autofill from cookie
    const response = await AuthService.tokenLogin(
      cookie.user.email,
      cookie.token
    );

    const data = response.data as ReturnType;
    if (data.error) {
      console.log(data.error);
      // await store.dispatch(Action.LOGOUT);
      return;
    } else {
      console.log(data.payload);
      const { user, token } = data.payload;
      store.dispatch(Action.LOGIN, {
        user: user as User,
        token,
      });
    }
    return;
  }

  try {
    const response = await AuthService.login({
      email: email.value,
      password: password.value,
    });

    if (response.data.error) {
      message.value = response.data.error;
      return;
    }

    const { user, token } = response.data;
    store.dispatch(Action.LOGIN, {
      user: user as User,
      token,
    });
  } catch (err) {
    message.value = `${err}`;
    return;
  }
}
</script>

<template>
  <div>
    <div>
      <p class="text-2xl text-center">Login</p>
      <p class="text-red-400 text-center">
        {{ message }}
      </p>
      <div class="flex flex-col gap-2">
        <input class="input" v-model="email" type="email" name="email" placeholder="Email" />
        <input class="input" v-model="password" type="password" name="password" placeholder="Password" />
      </div>
      <button class="button w-full mt-2" @click="login">Log in!</button>
    </div>
    <div class="v-box mt-4">
      <p class="text-lg mt-2">Need an account?</p>
      <div class="flex justify-between">
      <RouterLink to="/register" class="underline">Register</RouterLink>
      <!-- <RouterLink to="/forgotpassword" class="underline">Forgot Password?</RouterLink> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hidden {
  height: 0px;
}
</style>
