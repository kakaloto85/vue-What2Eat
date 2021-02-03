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
        :key="id"
        primary-key="id"
        small
      >
        <template #cell(title)="rooms">
          <b-input-group>
            <b-form-input v-model="rooms.item.title" v-show="visible"
              >menu</b-form-input
            >
          </b-input-group>
          <div v-show="!visible" size>{{ rooms.item.title }}</div>
        </template>

        <template #cell(식당)="rooms">
          {{          rooms.item.restaurant.name,
          }}
        </template>
        <template #cell(UPDATE)="rooms">
          <CButton
            color="warning"
            variant="outline-primary"
            @click="
              updateRoom(
                Number(rooms.item.id),
                hostId,
                rooms.item.title,
                Number(rooms.item.maxUser[1])
              )
            "
            >수정</CButton
          >
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
            <div>
              {{ rooms.item.maxUser[0] + " /  " }}
              <div v-show="!visible" :style="{ float: left }">
                {{ rooms.item.maxUser[1] }}
              </div>
              <div :style="{ width: '50px', float: left }">
                <b-form-input
                  v-model="rooms.item.maxUser[1]"
                  v-show="visible"
                ></b-form-input>
              </div>
            </div>
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
          <CButton color="success" @click="rooms.toggleDetails">상세</CButton>
        </template>
        <template #row-details="rooms">
          <RoomDetail v-bind:rooms="rooms" />
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
// import draggable from "vuedraggable";

import {
  deleteRoom,
  getRooms,
  createUserChoice,
  updateRoom,
} from "../graphql/rooms";
import InfiniteLoading from "vue-infinite-loading";
import RoomDetail from "./RoomDetail.vue";
export default {
  components: {
    InfiniteLoading,
    RoomDetail,
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
    async loadMore($state) {
      if (this.hasNextPage) {
        await this.$apollo.queries.rooms.refresh();
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
    updateRoom(id, hostId, title, maxUser) {
      console.log(id, hostId, title, maxUser);
      if (this.visible) {
        this.$apollo.mutate({
          mutation: updateRoom,
          variables: {
            id,
            hostId,
            title,
            maxUser,
          },
        });
      }
      this.visible = !this.visible;
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
    startDrag: (evt, item) => {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("itemID", item.id);
    },
  },
  name: "Room",
  data() {
    return {
      draggingRow: null,
      draggingRowIndex: null,
      visible: false,
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
      rooms: [],
    };
  },
  props: {
    id: Number,
    userId: Number,
    hostId: Number,
  },
};
</script>
