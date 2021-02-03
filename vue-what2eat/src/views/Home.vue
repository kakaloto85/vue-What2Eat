<template>
  <div class="home">
    <!-- <div v-show="!userId">
      <Login @id="setUserId" />
    </div> -->
    <!-- <div v-if="userId"> -->
    <router-view to="/" />
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import Login from "../components/Login.vue";

export default {
  component: {
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
