import { gql } from "@apollo/client";

export const UPDATE_TASK = gql`
    mutation updateTask ($input: UpdateTaskInput!) {
        updateTask (input: $input) {
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

export const CREATE_TASK = gql`
  mutation createTask ($input: CreateTaskInput!) {
      createTask (input: $input) {
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