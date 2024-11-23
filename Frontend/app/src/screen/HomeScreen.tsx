import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {colors} from '../utils/colors';
const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Image source={require("../assets/man.png")} style={styles.bannerImage} />
      <Text style={styles.title}>Lorem ipsum dolor.</Text>
      <Text style={styles.subTitle}>
        Lorem ipsum dolor sit amet, constur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore 
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleLogin}
        >
        <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper]}
          onPress={handleSignup}
        >
          <Text style={styles.signupButtonText}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    </View>
    </GestureHandlerRootView>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  }, 
  logo: {
    height: 40,
    width: 140,
    marginVertical: 30,
  },
  bannerImage: { 
    marginVertical: 20,
    height: 250,
    width: 231,
  }, 
  title:{
    fontSize: 40,
    // fontFamily: fonts.SemiBold,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.primary,
    marginTop: 40,
  },
  subTitle:{
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.secondary,
    // fontFamily: fonts.Medium,
    marginVertical: 20,
  }, 
  buttonContainer: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    width: "80%",
    height: 60,
  },
  loginButtonWrapper: {
    width: "80%",
    borderRadius: 100,
  }, 
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    // fontFamily: fonts.SemiBold,
  },
  signupButtonText: {
    fontSize: 18,
    // fontFamily: fonts.SemiBold,
  }
})