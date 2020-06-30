import React, {useState, useEffect, useContext} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {MainHeader} from "../components/Header";
import {DrawerContent} from "../components/DrawerContent";
import FeatherIcon from "react-native-vector-icons/Feather";
import {fetchAccessToken, setAccessToken, setRefreshToken} from "../auth";
import {AuthContext} from "../context";

// COMPONENTI
import {TabBar} from "../components/TabBar";

// SCHERMATE
import {SplashScreen} from "../screens/SplashScreen";
import {HomeScreen} from "../screens/HomeScreen";
import {AddFootprintScreen} from "../screens/AddFootprintScreen";
import {SearchScreen} from "../screens/SearchScreen";
import {SettingsScreen} from "../screens/SettingsScreen";
import {WelcomeScreen} from "../screens/Auth/Welcome";
import {SignInScreen} from "../screens/Auth/SignIn";
import {SignUpScreen} from "../screens/Auth/SignUp";
import {ProfileScreen} from "../screens/ProfileScreen";

const defaultScreenOptions: StackNavigationOptions = {
  headerTitleStyle: {alignSelf: "center"},
  headerStyle: {backgroundColor: "#FF596E"},
  headerTintColor: "#fff",
  headerTitleAlign: "center",
};

// AUTH STACK
export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};
const AuthStack = createStackNavigator<AuthStackParamList>();
const AuthStackScreen = () => (
  <AuthStack.Navigator
    // initialRouteName="SignIn"
    screenOptions={{
      // headerTransparent: true,
      headerTitleAlign: "center",
      headerTintColor: "#FF596E",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 23,
      },
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
      },
    }}>
    <AuthStack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{title: "Accedi", headerShown: false}}
    />
    <AuthStack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{title: "Accedi"}}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{title: "Registrati"}}
    />
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
      options={{headerTitle: () => <MainHeader />}}
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
    />
  </AddFootprintStack.Navigator>
);

// SERACH STACK
export type SearchStackParamList = {
  Search: undefined;
};
const SearchStack = createStackNavigator<SearchStackParamList>();
const SearchStackScreen = () => (
  <SearchStack.Navigator screenOptions={defaultScreenOptions}>
    <SearchStack.Screen
      name="Search"
      component={SearchScreen}
      options={{title: "Cerca"}}
    />
  </SearchStack.Navigator>
);

// PROFILE STACK
export type ProfileStackParamList = {
  Profile: undefined;
};
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{title: "Profilo"}}
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
  Search: undefined;
  Profile: undefined;
};
const Tabs = createBottomTabNavigator<BottomTabParamList>();
const TabsScreen = () => (
  <Tabs.Navigator
    initialRouteName="Profile"
    tabBar={TabBar}
    tabBarOptions={{
      activeTintColor: "#FF596E",
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
      name="Search"
      component={SearchStackScreen}
      options={{
        title: "Cerca",
        tabBarIcon: ({color, size}) => (
          <FeatherIcon name="search" size={size} color={color} />
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

// DRAWER
export type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};
const Drawer = createDrawerNavigator<DrawerParamList>();
const DrawerScreen = () => (
  <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={TabsScreen} />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} />
    <Drawer.Screen
      name="Settings"
      component={SettingsStackScreen}
      options={{title: "Impostazioni"}}
    />
  </Drawer.Navigator>
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
      <RootStack.Screen name="App" component={DrawerScreen} />
    ) : (
      <RootStack.Screen name="Auth" component={AuthStackScreen} />
    )}
  </RootStack.Navigator>
);

export const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

  // richieda al server un nuovo token di accesso
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchAccessToken();
        const data = await res.json();
        console.log({data});
        if (!data.success || !data.tokens) return setIsAuthenticated(false);
        // imposta il nuovo token di accesso e quello di aggiornamento
        const {accessToken, refreshToken} = data.tokens;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <RootStackScreen isAutheticated={isAuthenticated} />
    </NavigationContainer>
  );
};
