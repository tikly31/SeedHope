import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./src/screen/HomeScreen";
import LoginScreen from "./src/screen/LogInScreen";
import SignupScreen from "./src/screen/SignUpScreen";
import MainScreen from "./src/screen/MainScreen1";
import CreateFundraiser from "./src/screen/CreateFundraiser"
import FundraiserBeneficiary from "./src/screen/FundraiserBeneficiary";
import FundraiserAmount from "./src/screen/FundraiserAmount";
import FundraiserDetails from "./src/screen/FundraiserDetails";
import DocumentUpload from "./src/screen/DocumentUpload";
import FundraiserSuccess from "./src/screen/FundraiserSuccess";
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
          <Stack.Screen name={"MAINSCREEN"} component={MainScreen} />
          <Stack.Screen name={"HOME"} component={HomeScreen} />
          <Stack.Screen name={"LOGIN"} component={LoginScreen} />
          <Stack.Screen name={"SIGNUP"} component={SignupScreen} />
          <Stack.Screen name={"CreateFundraiser"} component={CreateFundraiser} />
          <Stack.Screen name={"FundraiserBeneficiary"} component={FundraiserBeneficiary} />
          <Stack.Screen name={"FundraiserAmount"} component={FundraiserAmount} />
          <Stack.Screen name={"FundraiserDetails"} component={FundraiserDetails} />
          <Stack.Screen name={"DocumentUpload"} component={DocumentUpload} />
          <Stack.Screen name={"FundraiserSuccess"} component={FundraiserSuccess} />
        </Stack.Navigator>
      // </NavigationContainer>
    // </GestureHandlerRootView>
  );
};

export default _layout;

const styles = StyleSheet.create({});
