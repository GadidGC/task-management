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