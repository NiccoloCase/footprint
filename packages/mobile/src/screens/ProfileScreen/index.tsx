import React, {useContext} from "react";
import {View, Text, Button} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {ProfileStackParamList} from "../../navigation";
import {useMeQuery} from "../../generated/graphql";
import {AuthContext} from "../../context";

type SearchScreenProps = StackScreenProps<ProfileStackParamList, "Profile">;

export const ProfileScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  const {data, error} = useMeQuery();
  const {logout} = useContext(AuthContext);

  const renderContent = () => {
    if (error) {
      const err = error.graphQLErrors[0];
      console.log(err);
      return <Text>errore</Text>;
    }
    if (data)
      return (
        <View>
          <Text>
            USERNAME:
            {data.whoami.username}
          </Text>
          <Text>
            EMAIL:
            {data.whoami.email}
          </Text>
          <Button title="Logout" onPress={logout}></Button>
        </View>
      );
    else return <Text>loading...</Text>;
  };

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      {renderContent()}
    </View>
  );
};
