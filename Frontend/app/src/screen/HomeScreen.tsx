import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

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
        <View style={styles.textContainer}>
          <Text style={styles.title}>Lorem ipsum dolor.</Text>
          <Text style={styles.subTitle}>
            Lorem ipsum dolor sit amet, constur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore 
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.loginButton]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonWrapper, styles.signupButton]}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Sign-up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.05,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  bannerImage: {
    width: width * 0.8,
    height: height * 0.3,
    resizeMode: 'contain',
  },
  textContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text || '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: colors.subText || '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    width: '48%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary || '#007AFF',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary || '#007AFF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButtonText: {
    color: colors.primary || '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//     alignItems: "center",
//   }, 
//   logo: {
//     height: 40,
//     width: 140,
//     marginVertical: 30,
//   },
//   bannerImage: { 
//     marginVertical: 20,
//     height: 250,
//     width: 231,
//   }, 
//   title:{
//     fontSize: 40,
//     // fontFamily: fonts.SemiBold,
//     paddingHorizontal: 20,
//     textAlign: "center",
//     color: colors.primary,
//     marginTop: 40,
//   },
//   subTitle:{
//     fontSize: 18,
//     paddingHorizontal: 20,
//     textAlign: "center",
//     color: colors.secondary,
//     // fontFamily: fonts.Medium,
//     marginVertical: 20,
//   }, 
//   buttonContainer: {
//     marginTop: 20,
//     flexDirection: "column",
//     alignItems: "center",
//     width: "80%",
//     height: 60,
//   },
//   loginButtonWrapper: {
//     width: "80%",
//     borderRadius: 100,
//   }, 
//   loginButtonText: {
//     color: colors.white,
//     fontSize: 18,
//     // fontFamily: fonts.SemiBold,
//   },
//   signupButtonText: {
//     fontSize: 18,
//     // fontFamily: fonts.SemiBold,
//   }
// })