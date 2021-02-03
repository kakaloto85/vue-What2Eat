<template>
  <div class="hello">
    <template>
      <b-card>
        <b-row>
          <b-col>
            <div>
              <b-icon
                icon="cart-plus-fill
"
                font-scale="3"
              ></b-icon>
            </div>
            <b-row>
              <b-form-checkbox-group
                v-model="selected"
                stacked
                :disabled="rooms.item.maxUser[0] === rooms.item.maxUser[1]"
                :options="
                  rooms.item.restaurant.menus.map((menu) => ({
                    value: menu,
                    text: menu.name + ', 가격: ' + menu.price,
                  }))
                "
              >
              </b-form-checkbox-group>
            </b-row>
            <b-row>
              <div>
                Price:
                <strong>{{
                  selected.reduce(function(pre, menu) {
                    return pre + Number(menu.price);
                  }, 0)
                }}</strong>
              </div>

              <div>
                Selected:
                <strong>{{ selected.map((menu) => menu.name) }}</strong>
              </div>
            </b-row>
            <CButton
              color="success"
              @click="
                enterRoom(
                  2,
                  selected.map((menu) => Number(menu.id)),
                  rooms.item.id
                )
              "
              :disabled="selected.length < 1"
              v-c-popover="{
                header: 'Popover!',
                content: 'I am <strong>popover</strong>',
              }"
              >결정</CButton
            >
          </b-col>
          <b-col>
            <b-row>
              <b-icon
                icon="person-check-fill
"
                font-scale="3"
              ></b-icon
            ></b-row>
            <b-row>
              <b-list-group>
                <ul id="example-1">
                  <li
                    v-for="userChoice in rooms.item.userChoices"
                    v-bind:key="userChoice"
                  >
                    {{ userChoice[0] + " : " + userChoice[1] }}
                  </li>
                </ul>
              </b-list-group>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
    </template>
  </div>
</template>

<script>
import { createUserChoice } from "../graphql/rooms";
export default {
  methods: {
    enterRoom(userId, menuIds, roomId) {
      console.log(menuIds);
      console.log("create");
      for (const i in menuIds) {
        console.log(menuIds[i]);
        this.$apollo.mutate({
          mutation: createUserChoice,
          variables: {
            userChoice: { userId, roomId, menuId: menuIds[i] },
          },
        });
      }
      location.reload();
    },
    onDone() {
      alert("Created");
    },
  },
  name: "RoomDetail",
  data() {
    return {
      selected: [],
    };
  },
  props: {
    rooms: Array,
  },
};
</script>
