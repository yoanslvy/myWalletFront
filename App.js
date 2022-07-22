import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);

import React, { useEffect } from "react";
import { NativeBaseProvider, extendTheme, StatusBar } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import AddCryptoScreen from "./screens/AddCryptoScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import AddTransactionsScreen from "./screens/AddTransactionScreen";
import EditTransactionScreen from "./screens/EditTransactionScreen";
import LogOutScreen from "./screens/LogOutScreen";

import authData from "./reducers/auth.reducer";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import StocksScreen from "./screens/StocksScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const store = createStore(combineReducers({ authData }));

const bottomNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "Wallet") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Stocks") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          }
          return <Ionicons name={iconName} size={25} color={color} />;
        },

        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#6c757d",
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopWidth: 3,
          borderTopColor: "#1e293b",
          // paddingBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Wallet" component={HomeScreen} />
      <Tab.Screen name="Stocks" component={StocksScreen} />
      <Tab.Screen name="Settings" component={LogOutScreen} />
    </Tab.Navigator>
  );
};

// extend the theme
const customTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
  components: {
    Select: {
      baseStyle: {},
      defaultProps: {},
      variants: {},
      sizes: {},
    },
    Button: {
      baseStyle: {},
      defaultProps: {},
      variants: {
        addBtn: () => {
          return {
            bg: "violet.900",
            rounded: "full",
            colorScheme: "violet",
            shadow: {
              shadowColor: "#5b21b6",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 1,
              shadowRadius: 5.0,
              elevation: 1,
            },
          };
        },
        active: () => {
          return {
            bg: "violet.900",
            rounded: "full",
            colorScheme: "violet",
            py: 0,
          };
        },
        inactive: () => {
          return {
            bg: "blueGray.900",
            rounded: "full",
            colorScheme: "violet",
          };
        },
        bordered: () => {
          return {
            bg: "blueGray.900",
            rounded: "sm",
            colorScheme: "violet",
          };
        },
      },
      sizes: {},
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={customTheme}>
        <StatusBar barStyle="light-content" backgroundColor={"#0f172a"} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="Sign-in" component={SignInScreen} />
            <Stack.Screen name="Sign-up" component={SignUpScreen} />
            <Stack.Screen name="bottomNav" component={bottomNav} />
            <Stack.Screen name="AddCrypto" component={AddCryptoScreen} />
            <Stack.Screen
              name="ListTransactions"
              component={TransactionsScreen}
            />
            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionsScreen}
            />
            <Stack.Screen
              name="EditTransaction"
              component={EditTransactionScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}

export default App;
