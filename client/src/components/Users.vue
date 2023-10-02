<template>
  <div>
    <p class="title">Users</p>
    <table class="w-100 table">
      <tr>
        <th class="p-2 bg-primary-dk tl-rounded">ID</th>
        <th class="p-2 bg-primary-dk">First Name</th>
        <th class="p-2 bg-primary-dk">Last Name</th>
        <th class="p-2 bg-primary-dk tr-rounded">Email</th>
      </tr>
      <user-row @click="selectUser(user)" v-for="(user, i) in users" :class="{ active: selectedUser == user }" :key="i"
        :user="user" />
    </table>

    <div v-if="selectedUser" class="bordered bg-light center-x">
      <p class="title">User Editor</p>
      <div class="h-box wrap">
        <div class="input-group vertical">
          <label>First Name</label>
          <input @keyup="checkChanges" class="input" type="text" v-model="selectedUser.first_name" />
        </div>
        <div class="input-group vertical">
          <label>Last Name</label>
          <input @keyup="checkChanges" class="input" type="text" v-model="selectedUser.last_name" />
        </div>
      </div>
      <div class="h-box wrap">
        <div class="input-group vertical">
          <label>Email</label>
          <input @keyup="checkChanges" class="input" type="text" v-model="selectedUser.email" />
        </div>
        <div class="input-group vertical">
          <label>Class</label>
          <select @change="checkChanges" v-model="selectedUser.class" class="input">
            <option value="1">Admin</option>
            <option value="0">User</option>
          </select>
        </div>
      </div>
      <TrashCanOutline @click="deleteUser(selectedUser)" class="button danger input" />
      <button @click="changePassword(selectedUser)">Change Password</button>
      <div v-if="hasUserChanged" class="input-group m-2 p-2" style="text-align: right">
        <button @click="cancelChanges" class="button warning">
          Cancel Changes
        </button>
        <button @click="updateUser" class="button success">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { State } from "@/store/State";
import { Action } from "@/store/Actions";
import UserRow from "./UserRow.vue";
import { User } from "@ill/common";
import { TrashCanOutline } from "mdue";
import UserService from "@/services/UserService";

export default defineComponent({
  components: { UserRow, TrashCanOutline },
  setup() {
    const store = useStore<State>();
    const users = computed(() => store.state.users);

    store.dispatch(Action.FETCH_USERS);

    const selectedUser = ref<User>();
    const selectedUserIdx = ref<number>();
    const hasUserChanged = ref<boolean>(false);

    function checkChanges() {
      if (selectedUserIdx.value != undefined) {
        if (selectedUser.value != users.value[selectedUserIdx.value]) {
          hasUserChanged.value = true;
          return;
        }
      }
      hasUserChanged.value = false;
    }

    function selectUser(user: User) {
      if (user == selectedUser.value) {
        selectedUser.value = undefined;
        selectedUserIdx.value = undefined;
      } else {
        selectedUser.value = JSON.parse(JSON.stringify(user));
        selectedUserIdx.value = users.value.indexOf(user);
      }
    }

    function updateUser(user: User) {
      store.dispatch(Action.UPDATE_USER, user);
    }

    function cancelChanges() {
      if (selectedUserIdx.value)
        selectedUser.value = users.value[selectedUserIdx.value];

      selectedUser.value = undefined;
      selectedUserIdx.value = undefined;
    }

    async function deleteUser(user: User) {
      await UserService.delete(user);
      store.dispatch(Action.FETCH_USERS);
      selectUser(user);
    }

    function changePassword(user: User) {
      const new_password = prompt("Enter new password");

      if (!new_password || new_password.length == 0) {
        alert("No changes were made");
        return;
      }

      user.password = new_password;
      updateUser(user);
    }

    return {
      selectUser,
      updateUser,
      deleteUser,
      selectedUser,
      hasUserChanged,
      checkChanges,
      cancelChanges,
      changePassword,
      users,
    };
  },
});
</script>