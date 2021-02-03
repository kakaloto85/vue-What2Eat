<template>
  <div>
    <b-card style="max-width: 20rem;">
      <b-card-body>
        <b-input-group>
          <b-form-input v-model="name">menu</b-form-input>
        </b-input-group>
        <b-input-group>
          <b-form-input v-model="password">menu</b-form-input>
        </b-input-group>
        <CButton color="primary" @click="login(name, password)">Login</CButton>
      </b-card-body>
    </b-card>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { getUserByLogin } from "../graphql/rooms";
export default Vue.extend({
  data() {
    return {
      name: "",
      password: "",
    };
  },
  name: "Login",
  methods: {
    async login(name, password) {
      console.log(name, password);
      const user = await this.$apollo.query({
        query: getUserByLogin,
        variables: {
          name,
          password,
        },
      });
      console.log(Number(user.data.userByLogin.id));
      this.$emit("id", Number(user.data.userByLogin.id));
    },
  },
});
</script>
