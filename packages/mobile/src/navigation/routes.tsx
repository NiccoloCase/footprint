import React, {useState, useEffect, useContext, useRef} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MainHeader} from "../components/Header";
import FeatherIcon from "react-native-vector-icons/Feather";
import {fetchAccessToken} from "../utils/fetchAccessToken";
import {useStoreActions, useStoreState} from "../store";
import {Colors} from "../styles";
import {client} from "../graphql";

// COMPONENTI
import {TabBar} from "../components/TabBar";

// SCHERMATE
import {SplashScreen} from "../screens/SplashScreen";
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
import {useGetNewsFeedLazyQuery} from "../generated/graphql";

const defaultScreenOptions: StackNavigationOptions = {
  headerTitleStyle: {alignSelf: "center"},
  headerStyle: {backgroundColor: Colors.primary},
  headerTintColor: "#fff",
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
  Profile: {id: string};
  Footprint: {
    id: string;
    title: string;
    authorUsername: string;
  };
};
const HomeStack = createStackNavigator<HomeStackParamList>();
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={defaultScreenOptions}>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{header: () => <MainHeader />}}
    />
    <HomeStack.Screen name="Footprint" component={FootprintScreen} />
    <HomeStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{title: "Profilo", headerShown: false}}
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
      options={{title: "Aggiungi un footprint"}}
    />
  </AddFootprintStack.Navigator>
);

// SERACH STACK
export type SearchStackParamList = {
  Explore: undefined;
};
const ExploreStack = createStackNavigator<SearchStackParamList>();
const ExploreStackScreen = () => (
  <ExploreStack.Navigator screenOptions={defaultScreenOptions}>
    <ExploreStack.Screen
      name="Explore"
      component={ExploreScreen}
      options={{headerShown: false}}
    />
  </ExploreStack.Navigator>
);

// PROFILE STACK
export type ProfileStackParamList = {
  MyProfile: undefined;
};
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
    <ProfileStack.Screen
      name="MyProfile"
      component={ProfileScreen}
      options={{title: "Profilo", headerShown: false}}
    />
  </ProfileStack.Navigator>
);

// SETTINGS STACK
export type SettingsStackParamList = {
  Settings: undefined;
};
const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsStackScreen = () => (
  <SettingsStack.Navigator screenOptions={defaultScreenOptions}>
    <SettingsStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{title: "Impostazioni"}}
    />
  </SettingsStack.Navigator>
);

// TAB NAVIGATION
export type BottomTabParamList = {
  Home: undefined;
  AddFootprint: undefined;
  Explore: undefined;
  Profile: undefined;
};
const Tabs = createBottomTabNavigator<BottomTabParamList>();

const TabsScreen = () => (
  <Tabs.Navigator
    initialRouteName="Explore"
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
      name="Profile"
      component={ProfileStackScreen}
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
  Settings: undefined;
};

const AppStack = createStackNavigator();
const AppStackScreen = () => (
  <AppStack.Navigator headerMode="none">
    <AppStack.Screen name="Home" component={TabsScreen} />
    <AppStack.Screen
      name="Settings"
      component={SettingsStackScreen}
      options={{title: "Impostazioni"}}
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
  const [isLoading, setIsLoading] = useState(true);
  const isAuth = useStoreState((state) => state.auth.isAuthenticated);
  const singin = useStoreActions((actions) => actions.auth.singin);

  // funzione per richiede il feed per salvarlo nella cache
  const [loadFeed] = useGetNewsFeedLazyQuery({
    variables: {pagination: {limit: 10}},
  });
  // TODO

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
          loadFeed();
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <RootStackScreen isAutheticated={isAuth} />
    </NavigationContainer>
  );
};
