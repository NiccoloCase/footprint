import React from "react";
import {DocumentNode} from "graphql";
import {useApolloClient} from "@apollo/react-hooks";
import {OperationVariables} from "apollo-client";

export function useLazyQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
) {
  const client = useApolloClient();
  return React.useCallback(
    (variables: TVariables) =>
      client.query<TData, TVariables>({
        query: query,
        variables: variables,
      }),
    [client],
  );
}
