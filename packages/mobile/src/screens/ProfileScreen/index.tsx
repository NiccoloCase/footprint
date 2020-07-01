import React from "react";
import {View, Text, Button} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {ProfileStackParamList} from "../../navigation";
import {useMeQuery} from "../../generated/graphql";
import {useStoreActions} from "../../store";
import {client} from "../../graphql";
import {TouchableHighlight} from "react-native-gesture-handler";

type SearchScreenProps = StackScreenProps<ProfileStackParamList, "Profile">;

export const ProfileScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  const {data, error} = useMeQuery();
  const logout = useStoreActions((actions) => actions.auth.logout);

  const handleLogout = () => {
    // ripristina la cache di apollo
    client.resetStore();
    // elimina le credenziali di accesso
    logout();
  };

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
            DIO EMAIL:
            {data.whoami.email}
          </Text>
          <TouchableHighlight onPress={handleLogout}>
            <Text>Working logout</Text>
          </TouchableHighlight>
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
