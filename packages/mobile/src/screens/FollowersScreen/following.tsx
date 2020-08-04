import React, {useState} from "react";
import {StyleSheet, View} from "react-native";
import {useGetFollowingQuery} from "../../generated/graphql";
import {FollowersScreenContent} from "./shared";

interface FollowingViewProps {
  userId: string;
  limit: number;
}

export const FollowingView: React.FC<FollowingViewProps> = ({
  userId,
  limit,
}) => {
  // Se i seguti sono finiti
  const [areFollowingGone, setAreFollowingGone] = useState(false);

  // Graphql
  const {data, error, fetchMore, loading} = useGetFollowingQuery({
    variables: {userId, pagination: {limit}},
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = () => {
    if (loading || areFollowingGone) return;
    const offset = data?.getFollowing.length;
    fetchMore({
      variables: {pagination: {offset, limit}},
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.getFollowing.length < limit)
          setAreFollowingGone(true);
        return Object.assign({}, prev, {
          getFollowers: [...prev.getFollowing, ...fetchMoreResult.getFollowing],
        });
      },
    });
  };

  return (
    <FollowersScreenContent
      data={data?.getFollowing}
      loading={loading}
      error={!!error}
      handleLoadMore={handleLoadMore}
      contentType="following"
    />
  );
};
