import React, {useState} from "react";
import {StyleSheet, View} from "react-native";
import {useGetFollowersQuery} from "../../generated/graphql";
import {FollowersScreenContent} from "./shared";

interface FollowersViewProps {
  userId: string;
  limit: number;
}

export const FollowersView: React.FC<FollowersViewProps> = ({
  userId,
  limit,
}) => {
  // Se i followers sono finiti
  const [areFollowersGone, setAreFollowersGone] = useState(false);

  // Graphql
  const {data, error, fetchMore, loading} = useGetFollowersQuery({
    variables: {userId, pagination: {limit}},
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = () => {
    if (loading || areFollowersGone) return;
    const offset = data?.getFollowers.length;
    fetchMore({
      variables: {pagination: {offset, limit}},
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.getFollowers.length < limit)
          setAreFollowersGone(true);
        return Object.assign({}, prev, {
          getFollowers: [...prev.getFollowers, ...fetchMoreResult.getFollowers],
        });
      },
    });
  };

  return (
    <FollowersScreenContent
      data={data?.getFollowers}
      loading={loading}
      error={!!error}
      handleLoadMore={handleLoadMore}
      contentType="followers"
    />
  );
};
