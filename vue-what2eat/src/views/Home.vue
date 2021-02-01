<template>
  <div class="home">
    <Room msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Room from "../components/Room.vue"; // @ is an alias to /src

@Component({
  components: {
    Room,
  },
})
export default class Home extends Vue {}
</script>
