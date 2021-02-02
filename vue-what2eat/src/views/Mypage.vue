<template>
  <div class="mypage">
    <div>내가 들어간 방</div>
    <Room v-bind:userId="2" />
    <div>내가 만든 방</div>

    <Room v-bind:hostId="2" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Room from "../components/Room.vue";
export default {
  components: {
    Room,
  },
};
</script>
