import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import Admin from "@/views/Admin.vue";
import LoginVue from "@/views/Login.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: LoginVue,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path:"/draftedit",
    name:"Draft Editor",
    component:()=>import("../views/DraftEditor.vue"),
  },
  {
    path: "/raceedit",
    name: "Race Editor",
    component:()=>import("../views/RaceEditor.vue"),
  },
  {
    path: "/driveredit",
    name: "Driver Editor",
    component:()=>import("../views/DriverEditor.vue"),
  },
  {
    path: "/login",
    redirect: () => ({ path: "/" }),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import("../views/Register.vue"),
  },
  {
    path: "/forgotpasswrod",
    name: "Forgot Password",
    component: () =>
      import("../views/ForgotPassword.vue"),
  },
  {
    path: "/addrace",
    name: "Add Race",
    component: () =>
      import("../views/AddRace.vue"),
  },
  {
    path: "/viewrace",
    name: "View Race",
    component: () =>
      import("../views/ViewRace.vue"),
  },
];

const location = process.env.NODE_ENV === 'development' ? "" : process.env.VUE_APP_BASE_URL;

const router = createRouter({
  history: createWebHistory(location),
  routes,
});

export default router;
