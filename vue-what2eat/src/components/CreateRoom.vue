<template>
  <div class="hello">
    <b-card bg-variant="light">
      <b-form-group
        label-cols-lg="3"
        label="Create Room"
        label-size="lg"
        label-class="font-weight-bold pt-0"
        class="mb-0"
      >
        <b-container fluid>
          <b-input-group prepend="title" class="my-3">
            <b-form-input v-model="title"></b-form-input>
          </b-input-group>
          <div>
            <b-input-group prepend="deadline">
              <b-form-input v-model.number="deadline"></b-form-input>
            </b-input-group>
          </div>
          <b-input-group prepend="maxUser">
            <div class="input-group-addon">
              <span class="glyphicon glyphicon-envelope"></span>
            </div>

            <b-form-input v-model.number="maxUser"></b-form-input>
          </b-input-group>
          <b-input-group prepend="deliveryFee">
            <b-form-input v-model.number="deliveryFee"></b-form-input>
          </b-input-group>
          <b-input-group prepend="restaurant">
            <b-form-input v-model="menuName">menu</b-form-input>
            <b-form-select
              v-model="restaurantId"
              :options="restaurants"
            ></b-form-select>
          </b-input-group>
          <div v-if="this.restaurantId !== 0">
            <div v-if="this.menus.length != 0">
              <b-input-group prepend="menus">
                <b-form-select
                  v-model="menuId"
                  :options="
                    this.menus.find((list) => list[0] === restaurantId)[1]
                  "
                ></b-form-select>
              </b-input-group>
            </div>
          </div>
          <b-input-group prepend="hostId">
            <b-form-input v-model.number="hostId"></b-form-input>
          </b-input-group>

          <b-button
            variant="outline-primary"
            @click="
              create(
                title,
                deadline,
                maxUser,
                deliveryFee,
                restaurantId,
                hostId
              )
            "
          >
            <router-link to="/">CreateRoom</router-link></b-button
          >
        </b-container>
      </b-form-group>
    </b-card>
  </div>
</template>

<script>
import { createRoom, getRestaurants, createUserChoice } from "../graphql/rooms";
export default {
  apollo: {
    restaurants: {
      query: getRestaurants,
      variables() {
        return {
          first: this.first,
          after: this.after,
          filter: this.menuName
            ? { by: "MenuName", menuName: this.menuName }
            : {},
        };
      },

      update(data) {
        console.log(data);
        this.endCursor = data.restaurants.pageInfo.endCursor;
        this.start = this.endcursor ? false : true;
        this.hasNextPage = data.restaurants.pageInfo.hasNextPage;
        this.menus = data.restaurants.edges.map((r) => [
          r.node.id,
          r.node.menus.map((menu) => ({
            value: menu.id,
            text: [menu.name, menu.price],
          })),
        ]);
        console.log(this.menus);
        return data.restaurants.edges.map((r) => ({
          value: r.node.id,
          text: r.node.name,
        }));
      },
    },
  },
  methods: {
    async create(title, deadline, maxUser, deliveryFee, restaurantId, hostId) {
      console.log(restaurantId);
      const {
        data: {
          createRoom: { id: result },
        },
      } = await this.$apollo.mutate({
        mutation: createRoom,
        variables: {
          room: { restaurantId, title, maxUser, deliveryFee, deadline, hostId },
        },
      });
      console.log(result);
      this.$apollo.mutate({
        mutation: createUserChoice,
        variables: {
          userChoice: { userId: hostId, menuId: this.menuId, roomId: result },
        },
      });
    },
  },
  name: "CreateRoom",
  data() {
    return {
      first: 0,
      after: "",
      menuName: "",
      restaurantId: 0,
    };
  },
  props: {
    msg: String,
  },
};
</script>
