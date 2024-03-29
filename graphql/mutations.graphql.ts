import { gql } from "@apollo/client";

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      name
      createdAt
      dueDate
      pointEstimate
      position
      status
      tags
    }
  }
`;