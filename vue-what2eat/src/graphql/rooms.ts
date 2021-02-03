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
            menus {
              id
              name
              price
            }
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
export const getRestaurant = gql`
  query getRestaurant($id: ID!) {
    restaruant(id: $id) {
      name
      menus {
        name
        price
      }
    }
  }
`;
export const getRestaurants = gql`
  query getRestaurants($first: Int, $after: String, $filter: RestaurantFilter) {
    restaurants(first: $first, after: $after, filter: $filter) {
      pageInfo {
        hasNextPage
        endCursor
        totalCount
      }
      edges {
        node {
          id
          name
          menus {
            id
            name
            price
          }
        }
      }
    }
  }
`;
export const createUserChoice = gql`
  mutation createUserChoice($userChoice: UserChoiceParam!) {
    createUserChoice(userChoice: $userChoice) {
      id
    }
  }
`;
export const updateRoom = gql`
  mutation updateRoom($id: ID!, $hostId: ID!, $title: String!, $maxUser: Int!) {
    updateRoom(id: $id, hostId: $hostId, title: $title, maxUser: $maxUser) {
      maxUser
      title
    }
  }
`;
export const getUserByLogin = gql`
  query getUserByLogin($name: String!, $password: String!) {
    userByLogin(name: $name, password: $password) {
      id
      name
    }
  }
`;
