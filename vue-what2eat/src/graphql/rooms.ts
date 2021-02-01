import gql from "graphql-tag";

export const getRooms = gql`
  query rooms($first: Int, $after: String, $filter: RoomFilter) {
    rooms(first: $first, after: $after, filter: $filter) {
      pageInfo {
        hasNextPage
        endCursor
        totalCount
      }
      edges {
        node {
          id
          title
          maxUser
          deliveryFee
          deadline
          timeStamp
          userChoices {
            user {
              name
            }
            menu {
              name
              price
            }
          }
          restaurant {
            name
          }
          host {
            name
          }
        }
      }
    }
  }
`;
export const deleteRoom = gql`
  mutation deleteRoom($id: ID!, $hostId: ID!) {
    deleteRoom(id: $id, hostId: $hostId)
  }
`;
export const createRoom = gql`
  mutation createRoom($room: RoomParam!) {
    createRoom(room: $room) {
      title
      id
    }
  }
`;
