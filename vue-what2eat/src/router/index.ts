import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import CreateRoom from "../components/CreateRoom.vue";
import Room from "../components/Room.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  // {
  //   path: "/",
  //   name: "Login",
  //   component: () => import("../components/Login.vue"),
  // },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: "/room/",
        component: CreateRoom,
      },
      {
        path: "/",
        component: Room,
      },
    ],
  },
  // {
  //   path: "/room/",
  //   component: import("../components/CreateRoom.vue"),
  // },

  {
    path: "/mypage",
    name: "Mypage",
    component: () => import("../views/Mypage.vue"),
  },
  {
    path: "/restaurant",
    name: "Restaurant",
    component: () => import("../views/Restaurant.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
