<template>
  <div class="mypage" style="justify-content:center">
    <div v-show="!userId">
      <Login @id="setUserId" />
    </div>
    <div v-if="userId">
      <div>내가 들어간 방</div>

      <Room v-bind:userId="userId" />
      <div>내가 만든 방</div>

      <Room v-bind:hostId="userId" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "../components/Login.vue";
import Room from "../components/Room.vue";
export default {
  components: {
    Room,
    Login,
  },
  methods: {
    setUserId(id) {
      console.log(id);
      this.userId = id;
    },
  },
  data() {
    return {
      userId: 0,
    };
  },
};
</script>
