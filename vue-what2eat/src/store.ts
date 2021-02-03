// src/store.ts
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    constants: 1,
  },
  getters: {
    CONSTANTS: (state) => {
      return state.constants;
    },
  },
});
