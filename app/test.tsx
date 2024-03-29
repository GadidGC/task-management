"use client";

export const dynamic = "force-dynamic";

import { gql } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

const query = gql`query {
    users {
        avatar
        createdAt
        email
        fullName
        id
        type
        updatedAt
    }
}`

export function PollPage() {
  const { data } = useSuspenseQuery(query);

  return <div>{JSON.stringify(data)}</div>;
};
