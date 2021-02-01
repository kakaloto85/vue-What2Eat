<template>
  <div class="hello">
    <router-link to="/room">CreateRoom</router-link>
    <div class="table-restponsive">
      <b-table
        striped
        hover
        :items="rooms"
        :fields="fields"
        :tbody-tr-class="rowClass"
        small
      >
        <!-- <router-link to="/rooms/1">CreateRoom</router-link> -->
        <template #cell(UPDATE)>
          <b-button variant="outline-primary">UpdateRoom</b-button>
        </template>
        <template #cell(DELETE)="rooms">
          <b-button
            variant="outline-primary"
            @click="deleteRoom(rooms.item.id, rooms.index)"
            >{{ rooms.item.id }}</b-button
          >
        </template>
        <template #cell(restaurant)="rooms">{{
          rooms.item.restaurant
        }}</template>

        <template #cell(open)="rooms">
          <b-button variant="outline-primary" @click="open(rooms.item.id)">{{
            rooms.item.id
          }}</b-button>
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
import { deleteRoom, createRoom, getRooms } from "../graphql/rooms";
import InfiniteLoading from "vue-infinite-loading";
export default {
  components: {
    InfiniteLoading,
  },
  beforeMount() {
    console.log("befroe");
    this.start = true;
  },

  apollo: {
    rooms: {
      query: getRooms,
      variables() {
        return {
          first: this.first,
          after: this.after,
          fitler: this.filter,
        };
      },
      update(data) {
        console.log(data);
        this.endCursor = data.rooms.pageInfo.endCursor;
        console.log(this.endCursor);
        this.start = this.endcursor ? false : true;
        this.hasNextPage = data.rooms.pageInfo.hasNextPage;
        return data.rooms.edges.map((room) => ({
          ...room.node,
          restaurant: room.node.restaurant.name,
          host: room.node.host.name,
          maxUser: room.node.userChoices.length + "/" + room.node.maxUser,
          userChoices: room.node.userChoices.map((userChoice) => [
            userChoice.menu.name,
            userChoice.user.name,
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
      console.log("loadMore");
      if (this.hasNextPage) {
        await this.$apollo.queries.rooms.refresh();
        console.log(this.endCursor);
        await this.$apollo.queries.rooms.fetchMore({
          variables: {
            first: 2,
            after: this.endCursor,
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
    // open(id) {
    //   this.$apollo.mutate({
    //     mutation: openRoom,
    //     variables: {
    //       id: id,
    //       hostId: this.hostId,
    //     },
    //   });
    // },
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
      start: true,
      first: 0,
      fields: [
        "id",
        "title",
        "restaurant",
        "maxUser",
        "deliveryFee",
        "deadline",
        "timeStamp",
        "host",
        "UPDATE",
        "DELETE",
        "open",
        "userChoices",
      ],
      types: ["title", "deadline", "restaurantId", "maxUser", "deliveryFee"],
      endCursor: "",
      hasNextPage: true,
      hostId: 1,
      // limit: 0,
      rooms: [],
    };
  },
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
