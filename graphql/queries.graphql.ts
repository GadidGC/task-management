import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query {
    users {
      avatar
      createdAt
      email
      fullName
      id
      type
      updatedAt
    }
  }
`;

export const GET_TASKS = gql`
  query Task($input: FilterTaskInput!) {
    tasks(input: $input) {
      createdAt
      dueDate
      id
      name
      pointEstimate
      position
      status
      tags
    }
  }
`;
