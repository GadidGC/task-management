import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query {
    users {
      fullName
      id
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
      assignee {
        id
        fullName
        avatar
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query profile {
    profile {
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
