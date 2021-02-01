<template>
  <div class="hello">
    <b-container fluid>
      <!-- <from v-on:submit.prevent="mutate()"> -->
      <b-input-group prepend="title">
        <b-form-input v-model="title"></b-form-input>
      </b-input-group>
      <b-input-group prepend="deadline">
        <b-form-input v-model.number="deadline"></b-form-input>
      </b-input-group>
      <b-input-group prepend="maxUser">
        <b-form-input v-model.number="maxUser"></b-form-input>
      </b-input-group>
      <b-input-group prepend="deliveryFee">
        <b-form-input v-model.number="deliveryFee"></b-form-input>
      </b-input-group>
      <b-input-group prepend="restaurantId">
        <b-form-input v-model.number="restaurantId"></b-form-input>
      </b-input-group>
      <b-input-group prepend="hostId">
        <b-form-input v-model.number="hostId"></b-form-input>
      </b-input-group>

      <b-button
        variant="outline-primary"
        @click="
          create(title, deadline, maxUser, deliveryFee, restaurantId, hostId)
        "
        >CreateRoom</b-button
      >
      <!-- </from> -->
    </b-container>
  </div>
</template>

<script>
import { createRoom } from "../graphql/rooms";
export default {
  methods: {
    create(title, deadline, maxUser, deliveryFee, restaurantId, hostId) {
      this.$apollo.mutate({
        mutation: createRoom,
        variables: {
          room: { restaurantId, title, maxUser, deliveryFee, deadline, hostId },
        },
      });
    },
  },
  name: "Room",
  data() {
    return {};
  },
  props: {
    msg: String,
  },
};
</script>
