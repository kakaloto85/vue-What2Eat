<template>
  <div class="hello">
    <div v-if="!this.$props.hostId && !this.$props.userId">
      <CButton color="success" router-link to="/room">생성</CButton>
    </div>
    <div class="table-restponsive">
      <b-table
        striped
        hover
        :items="rooms"
        :fields="fields"
        :tbody-tr-class="rowClass"
        small
      >
        <template #cell(식당)="rooms">
          {{          rooms.item.restaurant.name,
          }}
        </template>
        <template #cell(UPDATE)>
          <CButton color="warning" variant="outline-primary">수정</CButton>
        </template>
        <template #cell(maxUser)="rooms">
          <div>
            <CProgress
              :value="(rooms.item.maxUser[0] / rooms.item.maxUser[1]) * 100"
              color="success"
              animated
              style="height:20px;"
              class="mt-1"
            />
            {{ `${rooms.item.maxUser[0]} / ${rooms.item.maxUser[1]}` }}
          </div>
        </template>

        <template #cell(DELETE)="rooms">
          <CButton
            color="danger"
            @click="deleteRoom(rooms.item.id, rooms.index)"
          >
            삭제
          </CButton>
        </template>
        <template #cell(open)="rooms">
          <CButton color="warning" @click="rooms.toggleDetails">상세</CButton>

          <b-form-checkbox
            v-model="rooms.detailsShowing"
            @change="rooms.toggleDetails"
          >
            Details via check
          </b-form-checkbox>
        </template>
        <template #row-details="rooms">
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

        <template>
          <CCollapse :show="true" class="mt-2">
            <CCard body-wrapper>Hello!</CCard>
          </CCollapse>
        </template>
      </b-table>
      <infinite-loading
        @infinite="loadMore"
        spinner="waveDots"
      ></infinite-loading>
    </div>
  </div>
</template>

<script>
import {
  deleteRoom,
  createRoom,
  getRooms,
  createUserChoice,
} from "../graphql/rooms";
import InfiniteLoading from "vue-infinite-loading";
export default {
  components: {
    InfiniteLoading,
  },
  beforeMount() {
    console.log("befroe");
    console.log(this.$props.userId);
    this.filter = this.$props.userId
      ? { by: "UserId", userId: this.$props.userId }
      : this.$props.hostId
      ? { by: "HostId", hostId: this.$props.hostId }
      : {};
    console.log(this.filter);
  },

  apollo: {
    rooms: {
      query: getRooms,
      fetchPolicy: "no-cache",
      variables() {
        return {
          first: this.first,
          after: this.after,
          filter: this.filter,
        };
      },
      update(data) {
        this.endCursor = data.rooms.pageInfo.endCursor;
        this.start = this.endcursor ? false : true;
        this.hasNextPage = data.rooms.pageInfo.hasNextPage;
        return data.rooms.edges.map((room) => ({
          ...room.node,
          host: room.node.host.name,
          deadline:
            (room.node.deadline % 12) +
            `${room.node.deadline > 12 ? "PM" : "AM"}`,
          maxUser: [room.node.userChoices.length, room.node.maxUser],
          userChoices: room.node.userChoices.map((userChoice) => [
            userChoice.user.name,
            userChoice.menu.name,
          ]),
        }));
      },
      // Optional result hook
      result({ data, loading }) {
        console.log(data);
        if (!loading) this.rooms.push(...data);
      },
      error(error) {
        console.error("We've got an error!", error);
      },
    },
  },

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
    async loadMore($state) {
      console.log("loadMore");
      if (this.hasNextPage) {
        await this.$apollo.queries.rooms.refresh();
        console.log(this.endCursor);
        await this.$apollo.queries.rooms.fetchMore({
          variables: {
            first: 2,
            after: this.endCursor,
            filter: this.filter,
          },
          updateQuery(previous, { fetchMoreResult }) {
            const { pageInfo, edges, __typename } = fetchMoreResult.rooms;
            return {
              rooms: {
                __typename,
                edges: [...previous.rooms.edges, ...edges],
                pageInfo,
              },
            };
          },
        });
        console.log("loaded");
        $state.loaded();
      } else {
        console.log("completed");
        $state.complete();
      }
    },
    onDone() {
      alert("Created");
    },
    deleteRoom(id, index) {
      this.deleteRoomId = id;
      console.log(id);
      console.log(this.hostId);
      this.$apollo.mutate({
        mutation: deleteRoom,
        variables: {
          id: id,
          hostId: this.hostId,
        },
      });
      this.rooms.splice(index, 1);
      // this.$apollo.queries.rooms.refresh();
    },
  },
  name: "Room",
  data() {
    return {
      counter: 86,
      selected: [],
      start: true,
      first: 0,
      filter: {},
      fields: this.$props.hostId
        ? [
            "title",
            "식당",
            "maxUser",
            "deliveryFee",
            "deadline",
            "timeStamp",
            "host",
            "UPDATE",
            "DELETE",
            "open",
          ]
        : [
            "title",
            "식당",
            "maxUser",
            "deliveryFee",
            "deadline",
            "timeStamp",
            "host",
            "open",
          ],
      types: ["title", "deadline", "restaurantId", "maxUser", "deliveryFee"],
      endCursor: "",
      hasNextPage: true,
      // limit: 0,
      rooms: [],
    };
  },
  props: {
    userId: Number,
    hostId: Number,
  },
};
</script>
