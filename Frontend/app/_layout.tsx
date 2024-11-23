import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./src/screen/HomeScreen";
import LoginScreen from "./src/screen/LogInScreen";
import SignupScreen from "./src/screen/SignUpScreen";
const Stack = createNativeStackNavigator();

const _layout = () => {
  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
      // <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name={"HOME"} component={HomeScreen} />
          <Stack.Screen name={"LOGIN"} component={LoginScreen} />
          <Stack.Screen name={"SIGNUP"} component={SignupScreen} />
        </Stack.Navigator>
      // </NavigationContainer>
    // </GestureHandlerRootView>
  );
};

export default _layout;

const styles = StyleSheet.create({});
