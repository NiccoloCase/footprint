import React, {useState, useEffect} from "react";
import {TouchableOpacity} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import {createSharedElementStackNavigator} from "react-navigation-shared-element";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {MainHeader} from "../components/Header";
import FeatherIcon from "react-native-vector-icons/Feather";
import {fetchAccessToken} from "../utils/fetchAccessToken";
import {useStoreActions, useStoreState} from "../store";
import {Colors} from "../styles";
import hexToRgba from "hex-to-rgba";
import {GetNewsFeedDocument} from "../generated/graphql";
import {useLazyQuery} from "../graphql/useLazyQuery";
import NativeSplashScreen from "react-native-splash-screen";

// COMPONENTI
import {ProfileScreenDrawerContent} from "../components/ProfileScreenDrawer";
import {TabBar} from "../components/TabBar";

// SCHERMATE
import {WelcomeScreen} from "../screens/authScreens/Welcome";
import {SignInScreen} from "../screens/authScreens/SignIn";
import {SignUpScreen} from "../screens/authScreens/SignUp";
import {VerifyEmail} from "../screens/authScreens/VerifyEmail";
import {ForgotPasswordScreen} from "../screens/authScreens/ForgotPassword";
import {HomeScreen} from "../screens/HomeScreen";
import {AddFootprintScreen} from "../screens/AddFootprintScreen";
import {ExploreScreen} from "../screens/ExploreScreen";
import {ProfileScreen} from "../screens/ProfileScreen";
import {SettingsScreen} from "../screens/SettingsScreen";
import {FootprintScreen} from "../screens/FootprintScreen";
import {MediaScreen} from "../screens/MediaScreen";
import {MapScreen} from "../screens/MapScreen";
import {EditProfileScreen} from "../screens/EditProfile";
import {EditPasswordScreen} from "../screens/authScreens/EditPassword";
import {FollowersScreen} from "../screens/FollowersScreen";
import {CommentsScreen} from "../screens/CommentsScreen";

const defaultScreenOptions: StackNavigationOptions = {
  headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
  headerStyle: {
    backgroundColor: "#fff",
    shadowColor: "transparent",
    borderBottomWidth: 0,
    elevation: 0,
  },
  headerTintColor: Colors.darkGrey,
  headerTitleAlign: "center",
};

// AUTH STACK
export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: {
    email?: string;
    picture?: string;
    withGoogle?: boolean;
    googleAccessToken?: string;
  };
  VerifyEmail: {
    email: string;
    editedProfile?: boolean;
  };
  ForgotPassword: undefined;
};
const AuthStack = createStackNavigator<AuthStackParamList>();
const AuthStackScreen = () => (
  <AuthStack.Navigator initialRouteName="Welcome" headerMode="none">
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="VerifyEmail" component={VerifyEmail} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// HOME STACK
export type HomeStackParamList = {
  Home: undefined;
};
const HomeStack = createStackNavigator<HomeStackParamList>();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={defaultScreenOptions}>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{header: () => <MainHeader />}}
    />
  </HomeStack.Navigator>
);

// ADD-FOOTPRINT STACK
export type AddFootprintStackParamList = {
  AddFootprint: undefined;
};
const AddFootprintStack = createStackNavigator<AddFootprintStackParamList>();
const AddFootprintStackScreen = () => (
  <AddFootprintStack.Navigator screenOptions={defaultScreenOptions}>
    <AddFootprintStack.Screen
      name="AddFootprint"
      component={AddFootprintScreen}
      options={{title: "Pubblica un footprint"}}
    />
  </AddFootprintStack.Navigator>
);

// EXPLORE STACK
export type ExploreStackParamList = {
  Explore: undefined;
};
const ExploreStack = createStackNavigator<ExploreStackParamList>();
const ExploreStackScreen = () => (
  <ExploreStack.Navigator screenOptions={defaultScreenOptions}>
    <ExploreStack.Screen
      name="Explore"
      component={ExploreScreen}
      options={{headerShown: false}}
    />
  </ExploreStack.Navigator>
);

// SETTINGS STACK
export type SettingsStackParamList = {
  Settings: undefined;
};
const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsStackScreen = () => (
  <SettingsStack.Navigator
    screenOptions={({navigation}) => ({
      ...defaultScreenOptions,
      headerRightContainerStyle: {marginRight: 15},
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <FeatherIcon name="menu" size={22} />
        </TouchableOpacity>
      ),
    })}>
    <SettingsStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{title: "Impostazioni"}}
    />
  </SettingsStack.Navigator>
);

// EDIT PROFILE STACK
export type EditProfileStackParamList = {
  EditProfile: undefined;
  EditPassword: undefined;
};
const EditProfileStack = createStackNavigator<EditProfileStackParamList>();
const EditProfileStackScreen = () => (
  <EditProfileStack.Navigator
    screenOptions={({navigation}) => ({
      ...defaultScreenOptions,
      headerRightContainerStyle: {marginRight: 15},
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <FeatherIcon name="menu" size={22} />
        </TouchableOpacity>
      ),
    })}>
    <EditProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{title: "Modifica il profilo"}}
    />
    <EditProfileStack.Screen
      name="EditPassword"
      component={EditPasswordScreen}
      options={{title: "Modifica la password"}}
    />
  </EditProfileStack.Navigator>
);

// PERSONAL PROFILE DRAWER
export type MyProfileDrawerParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  SavedFootpritns: undefined;
  Settings: undefined;
};
const MyProfileDrawer = createDrawerNavigator<MyProfileDrawerParamList>();
const MyProfileDrawerScreen = () => (
  <MyProfileDrawer.Navigator
    drawerContentOptions={{
      labelStyle: {fontWeight: "bold"},
      itemStyle: {marginBottom: 15},
      activeBackgroundColor: hexToRgba(Colors.primary, 0.25),
      inactiveTintColor: Colors.darkGrey,
      activeTintColor: Colors.primary,
    }}
    drawerContent={ProfileScreenDrawerContent}
    screenOptions={defaultScreenOptions}
    drawerPosition="right">
    <MyProfileDrawer.Screen
      name="MyProfile"
      component={ProfileScreen}
      options={{
        drawerLabel: "Profilo",
        drawerIcon: ({color, size}) => (
          <FeatherIcon name="user" color={color} size={size} />
        ),
      }}
    />
    <MyProfileDrawer.Screen
      name="EditProfile"
      component={EditProfileStackScreen}
      options={{
        drawerLabel: "Modifica profilo",
        drawerIcon: ({color, size}) => (
          <FeatherIcon name="edit" color={color} size={size} />
        ),
      }}
    />
    <MyProfileDrawer.Screen
      name="SavedFootpritns"
      component={ProfileScreen}
      options={{
        drawerLabel: "Footprint salvati",
        drawerIcon: ({color, size}) => (
          <FeatherIcon name="bookmark" color={color} size={size} />
        ),
      }}
    />
    <MyProfileDrawer.Screen
      name="Settings"
      component={SettingsStackScreen}
      options={{
        drawerLabel: "Impostazioni",
        drawerIcon: ({color, size}) => (
          <FeatherIcon name="settings" color={color} size={size} />
        ),
      }}
    />
  </MyProfileDrawer.Navigator>
);

// TAB NAVIGATION
export type BottomTabParamList = {
  Home: undefined;
  AddFootprint: undefined;
  Explore: undefined;
  MyProfile: undefined;
};
const Tabs = createBottomTabNavigator<BottomTabParamList>();

const TabsScreen = () => (
  <Tabs.Navigator
    initialRouteName="Home"
    tabBar={TabBar}
    tabBarOptions={{
      activeTintColor: Colors.primary,
      inactiveTintColor: "#606060",
    }}>
    <Tabs.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <FeatherIcon name="home" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Explore"
      component={ExploreStackScreen}
      options={{
        title: "Esplora",
        tabBarIcon: ({color, size}) => (
          <FeatherIcon name="compass" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="AddFootprint"
      component={AddFootprintStackScreen}
      options={{
        title: "Nuovo",
        tabBarIcon: ({color, size}) => (
          <FeatherIcon name="plus" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="MyProfile"
      component={MyProfileDrawerScreen}
      options={{
        title: "Profilo",
        tabBarIcon: ({color, size}) => (
          <FeatherIcon name="user" size={size} color={color} />
        ),
      }}
    />
  </Tabs.Navigator>
);

// APP
export type AppStackParamList = {
  Home: undefined;
  Footprint: {
    id: string;
    title: string;
    image: string;
    authorUsername: string;
    authorProfileImage: string;
  };
  Profile: {id: string};
  Image: {uri: string};
  MapScreen: {
    annotations?: {coordinates: number[]}[];
  };
  FollowersScreen: {
    userId: string;
    following?: boolean;
  };
  CommentsScreen: {
    contentId: string;
    textInputValue?: string;
  };
};
const AppStack = createSharedElementStackNavigator<AppStackParamList>();
const AppStackScreen = () => (
  <AppStack.Navigator screenOptions={{headerShown: false}}>
    <AppStack.Screen name="Home" component={TabsScreen} />
    <AppStack.Screen
      name="Footprint"
      component={FootprintScreen}
      options={() => ({
        headerBackTitleVisible: false,
        cardStyleInterpolator: ({current: {progress}}) => ({
          cardStyle: {opacity: progress},
        }),
      })}
      sharedElementsConfig={({params}) => {
        return [
          {
            id: `footprint.${params.id}.image`,
            animation: "move",
            resize: "clip",
            align: "center-top",
          },
          {
            id: `footprint.${params.id}.title`,
            animation: "move",
          },
          {id: `footprint.${params.id}.profileImage`},
          {id: `footprint.${params.id}.data`},
          {id: `footprint.${params.id}.username`},
        ];
      }}
    />
    <AppStack.Screen
      name="Profile"
      component={(props) => <ProfileScreen {...props} />}
      options={() => ({
        headerBackTitleVisible: false,
        cardStyle: {backgroundColor: "transparent"},
        cardStyleInterpolator: ({current: {progress}}) => ({
          cardStyle: {opacity: progress},
        }),
      })}
    />
    <AppStack.Screen
      name="Image"
      component={MediaScreen}
      options={(navigation) => ({
        headerBackTitleVisible: false,
        gestureEnabled: false,
        cardStyleInterpolator: ({current: {progress}}) => ({
          cardStyle: {opacity: progress},
        }),
        cardStyle: {backgroundColor: "transparent"},
      })}
    />
    <AppStack.Screen
      name="MapScreen"
      component={MapScreen}
      options={() => ({
        headerBackTitleVisible: false,
        gestureEnabled: false,
        cardStyleInterpolator: ({current: {progress}}) => ({
          cardStyle: {opacity: progress},
        }),
        cardStyle: {backgroundColor: "transparent"},
      })}
    />
    <AppStack.Screen
      name="FollowersScreen"
      component={FollowersScreen}
      options={() => ({
        headerBackTitleVisible: false,
        gestureEnabled: false,
        cardStyleInterpolator: ({current: {progress}}) => ({
          cardStyle: {opacity: progress},
        }),
        cardStyle: {backgroundColor: "transparent"},
      })}
      sharedElementsConfig={({params}) => {
        const {userId} = params;
        return [
          {
            id: `followers.card.${userId}`,
            animation: "move",
            resize: "stretch",
            align: "center-top",
          },
          {
            id: `followers.card.${userId}.title`,
            animation: "move",
            resize: "stretch",
          },
          {
            id: `followers.card.${userId}.link`,
            animation: "fade-out",
          },
          {
            id: `followers.card.${userId}.content`,
            animation: "fade-out",
          },
        ];
      }}
    />
    <AppStack.Screen
      name="CommentsScreen"
      component={CommentsScreen}
      options={() => ({
        headerBackTitleVisible: false,
        cardStyleInterpolator: ({current: {progress}}) => ({
          cardStyle: {opacity: progress},
        }),
        cardStyle: {backgroundColor: "transparent"},
      })}
      sharedElementsConfig={({params}) => {
        const {contentId} = params;
        return [
          {
            id: `comments.card.${contentId}`,
            animation: "move",
            resize: "stretch",
            align: "center-top",
          },
          {
            id: `comments.card.${contentId}.title`,
            animation: "move",
            resize: "stretch",
          },
          {
            id: `comments.card.${contentId}.inputBox`,
            animation: "move",
            resize: "stretch",
          },
          {
            id: `comments.card.${contentId}.content`,
            animation: "fade-out",
          },
        ];
      }}
    />
  </AppStack.Navigator>
);

// ROOT STACK
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};
const RootStack = createStackNavigator<RootStackParamList>();
const RootStackScreen: React.FC<{isAutheticated: boolean}> = ({
  isAutheticated,
}) => (
  <RootStack.Navigator
    headerMode="none"
    screenOptions={{animationEnabled: false}}>
    {isAutheticated ? (
      <RootStack.Screen name="App" component={AppStackScreen} />
    ) : (
      <RootStack.Screen name="Auth" component={AuthStackScreen} />
    )}
  </RootStack.Navigator>
);

export const Navigation = () => {
  const isAuth = useStoreState((state) => state.auth.isAuthenticated);
  const singin = useStoreActions((actions) => actions.auth.singin);

  // Funzione per richiede il feed per salvarlo nella cache
  const prefetchFeed = useLazyQuery(GetNewsFeedDocument);

  // richieda al server un nuovo token di accesso
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchAccessToken();
        const data = await res.json();
        if (data && data.success && data.tokens) {
          // Imposta il nuovo token di accesso e quello di aggiornamento
          const {accessToken, refreshToken} = data.tokens;
          singin({accessToken, refreshToken});

          // Richiede il feed per salvarlo nella cache
          await prefetchFeed({pagination: {limit: 10}});
        }
      } finally {
        NativeSplashScreen.hide();
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <RootStackScreen isAutheticated={isAuth} />
    </NavigationContainer>
  );
};
