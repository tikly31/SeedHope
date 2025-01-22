import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screen/LogInScreen";
import HomeScreen from "./src/screen/HomeScreen";
import SignupScreen from "./src/screen/SignUpScreen";
import MainScreen from "./src/screen/MainScreen1";
import CreateFundraiser from "./src/screen/CreateFundraiser"
import FundraiserBeneficiary from "./src/screen/FundraiserBeneficiary";
import FundraiserAmount from "./src/screen/FundraiserAmount";
import FundraiserDetails from "./src/screen/FundraiserDetails";
import DocumentUpload from "./src/screen/DocumentUpload";
import FundraiserSuccess from "./src/screen/FundraiserSuccess";
import ExploreScreen from './src/screen/ExploreScreen';
import ProfileScreen from "./src/screen/ProfileScreen";
import EditProfileScreen from "./src/screen/EditProfileScreen";
import CategoryScreen from "./src/screen/CategoryScreen";
import FundraiserDetailsScreen from "./src/screen/FundraiserDetailsScreen";
import PostListScreen from "./src/screen/PostListScreen";
import PostDetailsScreen from "./src/screen/PostDetailsScreen";
import DonationPage from "./src/screen/DonationPage";
import ProfileScreen1 from "./src/screen/ProfileScreen1";
import EditProfileScreen1 from "./src/screen/EditProfileScreen1";
import SearchScreen from "./src/screen/SearchScreen";
import LogoutScreen from "./src/screen/LogoutScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
      // <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name={"ProfileScreen1"} component={ProfileScreen1} />
          <Stack.Screen name={"MainScreen"} component={MainScreen} />
          <Stack.Screen name={"LoginScreen"} component={LoginScreen} />
          <Stack.Screen name={"EditProfileScreen1"} component={EditProfileScreen1} />
          <Stack.Screen name={"SearchScreen"} component={SearchScreen} />
        
          <Stack.Screen name={"PostListScreen"} component={PostListScreen} />
          <Stack.Screen name={"PostDetails"} component={PostDetailsScreen} />
          <Stack.Screen name={"FundraiserDetailsScreen"} component={FundraiserDetailsScreen} />
          <Stack.Screen name={"DonationPage"} component={DonationPage} />
          <Stack.Screen name={"ExploreScreen"} component={ExploreScreen} />
          <Stack.Screen name={"HomeScreen"} component={HomeScreen} />
          <Stack.Screen name={"SignupScreen"} component={SignupScreen} />
          <Stack.Screen name={"CreateFundraiser"} component={CreateFundraiser} />
          <Stack.Screen name={"FundraiserBeneficiary"} component={FundraiserBeneficiary} />
          <Stack.Screen name={"FundraiserAmount"} component={FundraiserAmount} />
          <Stack.Screen name={"FundraiserDetails"} component={FundraiserDetails} />
          <Stack.Screen name={"DocumentUpload"} component={DocumentUpload} />
          <Stack.Screen name={"FundraiserSuccess"} component={FundraiserSuccess} />
          <Stack.Screen name={"ProfileScreen"} component={ProfileScreen} />
          <Stack.Screen name={"EditProfileScreen"} component={EditProfileScreen} />
          <Stack.Screen name={"CategoryScreen"} component={CategoryScreen} />
          <Stack.Screen name={"LogoutScreen"} component={LogoutScreen} />
        </Stack.Navigator>
      // </NavigationContainer>
    // </GestureHandlerRootView>
     
  );
};

export default AppNavigator;

